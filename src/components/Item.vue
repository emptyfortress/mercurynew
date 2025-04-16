<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import { useKeyModifier } from '@vueuse/core'
import { uid, useQuasar } from 'quasar'

const expanded = defineModel('expanded')
const tapes = defineModel<App[]>('tapes')
const activeItem = defineModel<string>('activeItem')
const shift = useKeyModifier('Shift')

const hoverItem = ref(100)
const draggedItem = ref(100)

const Div = motion.div

const emit = defineEmits(['navigate'])

const action = (item: App) => {
	if (item.group == 2) {
		emit('navigate', item.id)
	} else {
		if (activeItem.value !== '' && activeItem.value == item.id) {
			expanded.value = false
			activeItem.value = ''
		} else {
			expanded.value = true
			activeItem.value = item.id
		}
	}
}

const calcClass = (item: App) => {
	if (item.group >= 2) return 'group1'
	if (expanded.value && activeItem.value == item.id) return 'active'
	return ''
}
const calcId = (item: App) => {
	if (item.group == 2) return item.id
}

const initial = {
	opacity: 0,
	y: 20,
}

const animate = {
	opacity: 1,
	y: 0,
	// transition: { delay: 0.4 + index * 0.1 },
}

const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}

const onDragStart = (n: number) => {
	draggedItem.value = n
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
			tmp.id = uid()
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
</script>

<template lang="pug">
Div.it(v-for="(item, index) in tapes", :key="item.id",
	@click.stop='action(item)',
	:data-state="expanded",
	layout,
	:layout-id="calcId(item)"
	:class='calcClass(item)'
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

	.img(v-if='item.group == 1')
		component(:is='item.pic')

	template(v-if='item.group >= 2')
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
