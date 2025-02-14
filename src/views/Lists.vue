<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount, } from 'vue'
import { animations, state } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useQuasar } from 'quasar'
import AddButton from '@/components/common/AddButton.vue'
import IconFolderSearch from '@/components/icons/IconFolderSearch.vue'
import Trash from '@/components/common/Trash.vue'
import { useRouter, } from 'vue-router'
import { useList } from '@/stores/list'
import Empty from '@/components/Empty.vue'

const router = useRouter()

gsap.registerPlugin(Flip)

const list = useList()

const $q = useQuasar()

const dragStatus = ref(false)
state.on("dragStarted", () => {
	dragStatus.value = true
})
state.on("dragEnded", () => {
	dragStatus.value = false
})

const expanded = ref<boolean>(false)

const calcClass = (item: any) => {
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
	else return ''
}

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
const [parent, tapes] = useDragAndDrop(list.lists, config)

const create = ((e: any) => {
	let tmp = {
		id: +new Date(),
		label: e.label,
		descr: e.description,
		expand: false,
	}
	tapes.value.push(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлен список'
		})
	}, 1200)
})

const remove = (() => {
	tapes.value.splice(draggedItem.value, 1)
	$q.notify({
		message: 'Список удален',
		color: 'negative',
		icon: 'mdi-check-bold',
		actions: [
			{ label: 'Отмена', color: 'white', handler: () => { /* ... */ } }
		]
	})
})

const navigate = ((id: any) => {
	router.push(`/request/${id}`)
})

onBeforeUnmount(() => {
	expanded.value = false
	list.reset()
})

const duple = ref(false)
const onDragEnterPlus = (() => {
	duple.value = true
})
const onDragLeavePlus = (() => {
	duple.value = false
})
const onDropPlus = (() => {
	duple.value = false
})
</script>

<template lang="pug">
q-page(padding)
	.header Cписки
	.pa(ref='parent')
		div(v-if='tapes.length == 0' id="no-drag"
			v-motion
			:initial="{ y: 40, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 400 } }'
			)
			Empty(mode='list')
		.item1(v-else v-for="(item, index) in tapes" :key="item.id"
			v-motion
			:initial="{ y: 40, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 400 + 100 * index } }'
			@click.stop='expand(item)'
			:class="calcClass(item)"
			)
			IconFolderSearch.img
			.hg {{ item.label }}

			.content(v-if='item.expand'
				v-motion
				:initial="{ x: 100, opacity: 0 }"
				:enter="{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30, delay: 300 } }")
				br
				.grid
					label Название
					.val {{ item.label }}
					template(v-for="n in 3")
						label Свойство
						.val Параметр

				.text-center
					.q-gutter-x-sm
						q-btn(unelevated color="secondary" label="Редактировать запрос" @click.stop='navigate(item.id)') 
						q-btn(unelevated color="secondary" label="Редактировать представление" @click.stop='') 

		.plusCont(id="no-drag"
			@dragover.prevent="onDragEnterPlus"
			@dragenter.prevent
			@dragleave="onDragLeavePlus"
			@drop='onDropPlus'
			:class="{ duplicate: duple }"
			)
			AddButton(v-if='!expanded' @create='create' mode="list")

	Trash(v-model="dragStatus" @remove="remove" :group='expanded' :duple='duple')
</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
}

.q-page {
	position: relative;
}

.val {
	color: $primary;
	border-bottom: 1px dotted $primary;
}

.grid {
	width: 300px;
	margin: 1rem auto 4rem;
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: .5rem;
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
	border: 1px solid #fff;

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.active {
		position: absolute;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		left: 60px;
		right: 0;
		top: 64px;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.inactive {
		display: none;
	}

	.img {
		font-size: 4rem;
		color: $secondary;
	}
}

.hg {
	margin-top: .5rem;
	line-height: 100%;
}

.plusCont {
	width: 150px;
	height: 150px;
	border-radius: var(--rad);
	display: flex;
	justify-content: center;
	align-items: center;

	&.duplicate {
		background: hsl(213 38% 81% / 1) !important;
		border: 2px dashed $primary;
	}
}
</style>
