<script setup lang="ts">
import { ref } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'

const selection = ref([])
const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const config = {
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('drag-select-option')
	},
	accept: (draggedElement: HTMLElement) => {
		return !draggedElement.classList.contains('group')
	},
}

const [parent, tapes] = useDragAndDrop(options, config)
</script>

<template lang="pug">
q-page(padding)
	.zg Selection {{ selection}}
	drag-select(
		v-model="selection",
		:clickOptionToSelect="true",
		:draggableOnOption='true'
	)
		.container(ref='parent')
				drag-select-option(
					v-for="item in tapes",
					:value="item",
					:key="item",
				)
					span {{item}}
</template>

<style scoped lang="scss">
.zg {
	font-size: 1.3rem;
	font-weight: 500;
	text-align: center;
}

.container {
	max-width: 800px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: repeat(6, 100px);
	gap: 1rem;
	&:focus {
		outline: none;
	}
}
:deep(.drag-select) {
	// background: #ccc;
	height: 800px;
	padding-top: 3rem;
}
.drag-select-option {
	width: 100px;
	height: 100px;
	background: #fff;
	color: #000;
	font-size: 1rem;
}

.drag-select-option--selected {
	color: #000000;
	background: hsl(241 94% 81% / 1);
}
</style>
