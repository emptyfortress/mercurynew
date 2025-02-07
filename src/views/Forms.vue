<script setup lang="ts">
import { ref, nextTick, } from 'vue'
import { animations, state } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useQuasar } from 'quasar'
import AddButton from '@/components/common/AddButton.vue'
import Trash from '@/components/common/Trash.vue'
import { useRouter, } from 'vue-router'
import Empty from '@/components/Empty.vue'

const router = useRouter()

gsap.registerPlugin(Flip)

const forms = ref([
	{
		id: 1,
		label: 'Создание',
		expand: false,
		avatar: 'create'
	},
	{
		id: 2,
		label: 'Редактирование',
		expand: false,
		avatar: 'edit'
	},
	{
		id: 3,
		label: 'Просмотр',
		expand: false,
		avatar: 'view'
	},

])

const $q = useQuasar()

const dragStatus = ref(false)
state.on("dragStarted", () => {
	dragStatus.value = true
})

state.on("dragEnded", () => {
	dragStatus.value = false
})

const expanded = ref<boolean>(false)

const expand = async (item: any) => {
	const state = Flip.getState('.item1, .img')
	expanded.value = !expanded.value
	item.expand = !item.expand
	await nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.item1, .img',
			absolute: true,
			absoluteOnLeave: true,
			nested: true,

			onEnter: (elements) =>
				gsap.fromTo(
					elements,
					{ opacity: 0 },
					{ opacity: 1, duration: 0.6, ease: 'linear', delay: 0.2 }
				),
			onLeave: (elements) =>
				gsap.fromTo(elements, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'linear' }),
		})
	})
}

const calcClass = (item: any) => {
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
	else return ''
}

const getImageUrl = (name: string) => new URL(`../assets/img/${name}.svg`, import.meta.url).href

const create = ((e: any) => {
	let tmp = {
		id: +new Date(),
		label: e.label,
		expand: false,
		avatar: 'edit'
	}
	tapes.value.push(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлена форма'
		})
	}, 1200)
})

const navigate = (() => {
	router.push('/form')
})

const draggedItem = ref(100)

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (el: any) => {
		return el.id !== 'no-drag'
	},
	onDragstart: (e: any) => {
		draggedItem.value = e.draggedNode.data.index
	},
}
const [parent, tapes] = useDragAndDrop(forms.value, config)

const remove = (() => {
	tapes.value.splice(draggedItem.value, 1)
	$q.notify({
		message: 'Форма удалена',
		color: 'negative',
		icon: 'mdi-check-bold',
		actions: [
			{ label: 'Отмена', color: 'white', handler: () => { /* ... */ } }
		]
	})
})
</script>

<template lang="pug">
q-page(padding)
	.all
		.header Формы
		.pa(ref='parent')
			div(v-if='tapes.length == 0' id="no-drag"
				v-motion
				:initial="{ y: 40, opacity: 0 }"
				:enter='{ y: 0, opacity: 1, transition: { delay: 400 } }'
				)
				Empty(mode='form')
			.item1(v-else v-for="(item, index) in tapes" :key="item.id"
				v-motion
				:initial="{ y: 40, opacity: 0 }"
				:enter='{ y: 0, opacity: 1, transition: { delay: 400 + 100 * index } }'
				@click.stop='expand(item)'
				:class="calcClass(item)"
				)
				q-img.img(:src='getImageUrl(item.avatar)')
				.hg {{ item.label }}
				.content(v-if='item.expand'
					v-motion
					:initial="{ x: 100, opacity: 0 }"
					:enter="{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30, delay: 300 } }")
					br
					.text-center
						.text-h6 Здесь свойства формы
						br
						q-btn(unelevated color="secondary" label="Редактировать форму" @click.stop='navigate') 

			div(id="no-drag")
				AddButton(v-if='!expanded' @create='create' mode="form")

	Trash(v-model="dragStatus" @remove="remove" :group='expanded')

</template>

<style scoped lang="scss">
.all {
	margin: 0 auto;
	padding: 0;
	width: 728px;
}

.pa {
	display: grid;
	grid-template-columns: repeat(5, 150px);
	column-gap: 1rem;
	align-items: center;
	row-gap: 1rem;
	margin: 0 auto;
	width: 728px;
	border: none;
	outline: none;
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
	}

}

.header {
	font-size: 1.5rem;
	text-align: center;
}

.smooth-dnd-container.horizontal.list {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.item1 {
	width: 150px;
	height: 216px;
	text-align: center;
	margin: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	position: relative;
	background: #fff;

	.img {
		width: 120px;
		margin-bottom: .5rem;
	}

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.active {
		position: fixed;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		left: 0;
		right: 0;
		top: 120px;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
		text-align: left;

		.img {
			width: 220px;
		}
	}

	&.inactive {
		display: none;
	}

	img {
		user-select: none;
	}
}

.add {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background: #fff;
	margin-top: -1rem;
	margin-left: 5rem;
	background: hsl(199 23% 69% / 1);
}

.list {
	display: flex;
}

.trash {
	position: fixed;
	bottom: 6rem;
	left: 50%;
	font-size: 3rem;
	color: darkred;
	transform: translateX(-50%);
	vertical-align: middle;
	text-align: center;
	line-height: 1.0;

	label {
		display: block;
		font-size: 1rem;
	}

}
</style>
