<script setup lang="ts">
import { ref, nextTick, } from 'vue'
import { animations, state } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import cadrovik from '@/assets/img/cadrovik.png'
import { useQuasar } from 'quasar'
import AddButton from '@/components/common/AddButton.vue'
import Trash from '@/components/common/Trash.vue'

gsap.registerPlugin(Flip)

const roles = ref([
	{
		id: 1,
		label: 'Инициатор',
		expand: false,
		avatar: 'avatar1'
	},
	{
		id: 2,
		label: 'Руководитель',
		expand: false,
		avatar: 'avatar2'
	},
	{
		id: 3,
		label: 'Кадровик',
		expand: false,
		avatar: 'avatar3'
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

const expand = (item: any) => {
	const state = Flip.getState('.item1')
	expanded.value = !expanded.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.item1',
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

const create = ((e: string) => {
	let tmp = {
		id: +new Date(),
		label: e,
		expand: false,
		avatar: 'avatar1'
	}
	tapes.value.push(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлена роль'
		})
	}, 1200)
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
const [parent, tapes] = useDragAndDrop(roles.value, config)

const remove = (() => {
	tapes.value.splice(draggedItem.value, 1)
	$q.notify({
		message: 'Роль удалена',
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
	.header Роли
	.pa(ref='parent')
		.item1(v-for="(item, index) in tapes" :key="item.id"
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
				img(:src='cadrovik')

		div(id="no-drag")
			AddButton(v-if='!expanded' @create='create' mode="role")

	Trash(v-model="dragStatus" @remove="remove" :group='expanded')


</template>

<style scoped lang="scss">
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

.header {
	font-size: 1.5rem;
	text-align: center;
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
	}

}

.item1 {
	width: 150px;
	height: 150px;
	border-radius: .5rem;
	text-align: center;
	margin: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	position: relative;
	background: #fff;

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.active {
		position: fixed;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		left: 60px;
		right: 0;
		top: 120px;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.inactive {
		display: none;
	}

	.img {
		width: 100px;
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
</style>
