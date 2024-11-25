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

<style scoped lang="scss">
.item {
	width: 200px;
	height: 200px;
	background: #fff;
	// border-radius: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	margin: 0.5rem;
	position: relative;

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
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.inactive {
		opacity: 0;
		user-select: none;
		display: none;
	}
	&.group {
		box-shadow: 1px 1px 5px rgba($color: #000000, $alpha: 0.2);

		&:before {
			content: '';
			display: block;
			width: 200px;
			height: 200px;
			background: #fff;
			// border-radius: 0.5rem;
			position: absolute;
			top: 0px;
			left: 0px;
			transform: rotate(3deg);
			z-index: -2;
			box-shadow:
				2px 2px 3px rgba($color: #000000, $alpha: 0.2),
				-1px -1px 2px rgba($color: #000000, $alpha: 0.2);
		}
	}

	&.green {
		background: #a8d7a8;
	}
}
</style>
