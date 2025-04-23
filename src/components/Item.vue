<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'
import AppPreviewNew from '@/components/AppPreviewNew.vue'
import GroupInsidePreview from '@/components/GroupInsidePreview.vue'

const expanded = defineModel('expanded')
const tapes = defineModel<App[]>('tapes')
const activeItem = defineModel<string>('activeItem')

const Div = motion.div

const emit = defineEmits(['navigate', 'createGroup'])

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
	if (item.group > 1) return 'group'
	return ''
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
const dragIndex = ref<number | null>(null)

const onDragStart = (item: App, n: number) => {
	draggedItem.value = item
	dragIndex.value = n
}

const onDragEnter = (app: App) => {
	if (activeItem.value == app.id && draggedItem.value?.group == 1) {
		overGroup.value = true
	}
}
const onDragLeave = () => {
	overGroup.value = false
}

const onDrop1 = (el: App, n: number) => {
	if (el.id == draggedItem.value?.id || draggedItem.value?.group > 1) return
	if (el.group > 1) {
		el.list.push(draggedItem.value)
	}
	if (el.id !== activeItem.value) return
	emit('createGroup', el, draggedItem.value)
	overGroup.value = false
	draggedItem.value = null
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
	:layout-id="item.id"
	:class='calcClass(item, index)'
	:initial="initial"
	:animate="animate"
	:transition="spring"
	@dragstart='onDragStart(item, index)'
	@dragenter='onDragEnter(item)'
	@dragover.prevent
	@dragleave='onDragLeave'
	@drop='onDrop1(item, draggedItem)'
)
	.createGroup(v-if='item.group < 2 && activeItem == item.id && overGroup')
		div Создать группу приложений

	template(v-else)
		span {{ item.label }}

		AppPreviewNew(
			v-if='activeItem == item.id && item.group == 1'
			:item='item',
			@remove='remove'
		)

		GroupInsidePreview(
			v-if='activeItem == item.id && item.group > 1'
			v-model:list="item.list"
			@removeGroup='remove(item)'
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
