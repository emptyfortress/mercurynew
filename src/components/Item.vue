<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import { useKeyModifier } from '@vueuse/core'
import AppPreviewNew from '@/components/AppPreviewNew.vue'
import GroupInsidePreview from '@/components/GroupInsidePreview.vue'

const expanded = defineModel('expanded')
const tapes = defineModel<App[]>('tapes')
const activeItem = defineModel<string>('activeItem')
const shift = useKeyModifier('Shift')

const hoverItem = ref(100)
const draggedItem = ref(100)

const Div = motion.div

const emit = defineEmits(['navigate', 'dragged'])

const action = (item: App) => {
	// if (item.group >= 2) {
	// 	emit('navigate', item.id)
	// } else {
	if (activeItem.value !== '' && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = ''
	} else {
		expanded.value = true
		activeItem.value = item.id
	}
	// }
}

const calcClass = (item: App, index: number) => {
	if (expanded.value && activeItem.value == item.id && item.group > 1) return 'active group'
	if (expanded.value && activeItem.value == item.id) return 'active'
	if (hoverItem.value == index && index !== draggedItem.value) return 'over'
	if (item.group > 1 && hoverItem.value == index && index !== draggedItem.value)
		return 'group1 over'
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

const onDragStart = (n: number) => {
	draggedItem.value = n
	emit('dragged', n)
}

const onDragEnter = (index: number) => {
	if (shift.value) {
		hoverItem.value = index
	}
}
const onDragLeave = () => {
	hoverItem.value = 100
}

const onDrop1 = () => {
	if (shift.value && tapes.value) {
		let tmp = {} as App
		if (tapes.value[hoverItem.value].group == 1) {
			tmp.id = tapes.value[draggedItem.value].id
			tmp.label = 'Группа'
			tmp.descr = ''
			tmp.expand = false
			tmp.version = ''
			tmp.author = ''
			tmp.group = 1
			tmp.list = []
		} else tmp = tapes.value[hoverItem.value]

		tmp.group += 1
		tmp.list.push(tapes.value[hoverItem.value])
		tmp.list.push(tapes.value[draggedItem.value])

		tapes.value.splice(hoverItem.value, 1, tmp)
		tapes.value.splice(draggedItem.value, 1)

		draggedItem.value = 100
		hoverItem.value = 100
	}
}

const remove = (el: App) => {
	// console.log(el)
	const ind = tapes.value?.findIndex((item) => item.id == el.id)
	if (ind) {
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
	@dragstart='onDragStart(index)'
	@dragover.prevent="onDragEnter(index)"
	@dragenter.prevent
	@dragleave="onDragLeave"
	@drop='onDrop1'
)
	span {{ item.label }}

	AppPreviewNew(
		v-if='activeItem == item.id && item.group == 1'
		:item='item',
		@remove='remove'
	)
	
	GroupInsidePreview(
		v-if='activeItem == item.id && item.group > 1'
		:list="item.list"
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
</style>
