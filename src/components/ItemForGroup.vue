<script setup lang="ts">
import { ref } from 'vue'

const tapes = defineModel<App[]>('tapes')

const hoverItem = ref()
const draggingItem = ref()

const onDragStart = (n: number) => {
	draggingItem.value = n
}
const onDragEnter = (index: number) => {
	hoverItem.value = index
}
const onDragLeave = () => {
	hoverItem.value = null
}

const onDrop1 = () => {
	let item = tapes.value![hoverItem.value]
	if (item) {
		item.group = true
	}
	onDragLeave()
	tapes.value!.splice(draggingItem.value, 1)
	draggingItem.value = null
}

const calcOver = (index: number) => {
	if (hoverItem.value == index && index !== draggingItem.value) return 'green'
	return ''
}
</script>

<template lang="pug">
.item(
	v-for="(item, index) in tapes"
	:key="item.id"
	:draggable='true'
	@dragstart='onDragStart(index)'
	@dragover.prevent="onDragEnter(index)"
	@dragenter.prevent
	@dragleave="onDragLeave"
	@drop='onDrop1'
	:class='calcOver(index)'
	) {{ item.label }}
</template>

<style scoped lang="scss"></style>
