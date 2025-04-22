<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
// import { useKeyModifier } from '@vueuse/core'
import AppPreviewNew from '@/components/AppPreviewNew.vue'
import GroupInsidePreview from '@/components/GroupInsidePreview.vue'

const expanded = defineModel('expanded')
const tapes = defineModel<App[]>('tapes')
const activeItem = defineModel<string>('activeItem')
// const shift = useKeyModifier('Shift')

// const hoverItem = ref(100)
// const draggedItem = ref(100)

const Div = motion.div

const emit = defineEmits(['navigate', 'dragged'])

const action = (item: App) => {
	if (activeItem.value !== '' && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = ''
	} else {
		expanded.value = true
		activeItem.value = item.id
	}
}

const calcClass = (item: App, index: number) => {
	if (expanded.value && activeItem.value == item.id && item.group > 1) return 'active group'
	if (expanded.value && activeItem.value == item.id) return 'active'
	if (item.group > 1) return 'group1'
	return ''
}

const calcId = (item: App) => {
	if (item.group > 1) return 'gr'
	else return item.id
}

const initial = {
	opacity: 0,
	y: 20,
}

const animate = {
	opacity: 1,
	y: 0,
}

const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}

const overGroup = ref(false)

const draggedItem = ref()

const onDragStart = (item: App, n: number) => {
	// console.log(n)
	draggedItem.value = n
	// console.log(draggedItem.value)
}

const onDragEnter = (app: App) => {
	if (activeItem.value == app.id) {
		overGroup.value = true
	}
}
const onDragLeave = () => {
	overGroup.value = false
}

const onDrop1 = (el: App, n: number) => {
	// el.group += 1

	// console.log(draggedItem.value)
	// tapes.value?.splice(draggedItem.value, 1)
	overGroup.value = false
	// if (shift.value && tapes.value) {
	// 	let tmp = {} as App
	// 	if (tapes.value[hoverItem.value].group == 1) {
	// 		tmp.id = tapes.value[draggedItem.value].id
	// 		tmp.label = 'Группа'
	// 		tmp.descr = ''
	// 		tmp.expand = false
	// 		tmp.version = ''
	// 		tmp.author = ''
	// 		tmp.group = 1
	// 		tmp.list = []
	// 	} else tmp = tapes.value[hoverItem.value]
	//
	// 	tmp.group += 1
	// 	tmp.list.push(tapes.value[hoverItem.value])
	// 	tmp.list.push(tapes.value[draggedItem.value])
	//
	// 	tapes.value.splice(hoverItem.value, 1, tmp)
	// 	tapes.value.splice(draggedItem.value, 1)
	//
	// 	draggedItem.value = 100
	// 	hoverItem.value = 100
	// }
}

const remove = (el: App) => {
	const ind = tapes.value?.findIndex((item) => item.id == el.id)
	if (ind !== undefined) {
		tapes.value?.splice(ind, 1)
		expanded.value = false
	}
}
</script>

<template lang="pug">
Div.it(v-for="(item, index) in tapes", :key="item.id",
	@click.stop='action(item)',
	:layout-id="calcId(item)"
	:class='calcClass(item, index)'
	:initial="initial"
	:animate="animate"
	:transition="spring"
	@dragstart='onDragStart(item, index)'
	@dragenter='onDragEnter(item)'
	@dragover.prevent
	@dragleave='onDragLeave'
	@drop='onDrop1(item, index)'
)
	.createGroup(v-if='item.group < 2 && activeItem == item.id && overGroup')
		div Создать группу приложений
	template(v-else)
		span {{ item.label }} - {{ index }}

		AppPreviewNew(
			v-if='activeItem == item.id && item.group == 1'
			:item='item',
			@remove='remove'
		)
		
		GroupInsidePreview(
			v-if='activeItem == item.id && item.group > 1'
			v-model:list="item.list"
		)

		.img(v-if='item.group == 1')
			component(:is='item.pic')

		template(v-if='item.group > 1 && activeItem !== item.id')
			.img1
				component(:is='el.pic' v-for="el in item.list" :key="el.id")

	
</template>

<style scoped lang="scss">
.img1 {
	bottom: 0.5rem;
	left: 0.8rem;
	font-size: 1.5rem;
}
.createGroup {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: var(--ghost);
	width: 100%;
	height: 100%;
	border-radius: 0.25rem;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.3rem;
	color: $primary;
}
</style>
