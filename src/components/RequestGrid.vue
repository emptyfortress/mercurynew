<script setup lang="ts">
import { ref, computed, } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconClear from '@/components/icons/IconClear.vue'
import { useTree } from '@/stores/tree12'
import { GridLayout, GridItem } from 'vue3-grid-layout-next'

const mytree = useTree()

interface GridItem {
	x: number,
	y: number,
	w: number,
	h: number,
	i: string
}

const colNum = ref<number>(12)
const index = ref<number>(2)

const addItem = (): void => {
	mytree.layout.push({
		x: 0, // Always starts at the leftmost position
		y: mytree.layout.length + (colNum.value || 12), // Puts it at the bottom
		w: 2,
		h: 1,
		i: index.value.toString(), // Convert number to string
	})
	index.value++ // Ensure key is always unique
}

const removeItem = (val: string): void => {
	console.log(val)
	const itemIndex = mytree.layout.findIndex((item) => item.i === val)
	if (itemIndex !== -1) {
		mytree.layout.splice(itemIndex, 1)
	}
}

const clearAll = (() => {
	mytree.layout.length = 0
})

const addTemp = (() => {
	addItem()
})

const isGridEmpty = computed(() => mytree.layout.length === 0)

const selection = ref<string[]>([])
// const select = ((i: string) => {
// 	selection.value = i
// })
const select = (i: string) => {
	const index = selection.value.indexOf(i)
	if (index === -1) {
		// If item is not already selected, add it
		selection.value.push(i)
	} else {
		// If item is already selected, remove it (toggle)
		selection.value.splice(index, 1)
	}
}

const selectedBounds = computed(() => {
	if (selection.value.length === 0) return null

	const selectedItems = mytree.layout.filter(item => selection.value.includes(item.i))
	if (selectedItems.length === 0) return null

	const minX = Math.min(...selectedItems.map(item => item.x))
	const maxX = Math.max(...selectedItems.map(item => item.x + item.w))
	const minY = Math.min(...selectedItems.map(item => item.y))
	const maxY = Math.max(...selectedItems.map(item => item.y + item.h))

	return {
		x: minX,
		y: minY,
		w: maxX - minX,
		h: maxY - minY
	}
})

</script>

<template lang="pug">
div
	.empty(v-if='isGridEmpty')
		IconFaceMask.big
		div Запрос не настроен.
		q-btn.q-mt-md.q-mr-sm(flat color="primary" label="Quick add" @click="addTemp") 
		q-btn.q-mt-md(unelevated color="primary" label="Настроить" @click="mytree.toggleDragWindow") 


	.grid
		grid-layout(v-if='!isGridEmpty'
			:layout.sync="mytree.layout"
			:col-num="12"
			:row-height="40"
			:is-draggable="true"
			:is-resizable="true"
			:is-mirrored="false"
			:vertical-compact="true"
			:margin="[4, 4]"
			:use-css-transforms="true"
		)
			grid-item(
				v-for="item in mytree.layout"
				:x="item.x"
				:y="item.y"
				:w="item.w"
				:h="item.h"
				:i="item.i"
				:key="item.i"
				@click='select(item.i)'
				:class="{ selected: selection.includes(item.i) }"
			)
				.remove(@click='removeItem(item.i)') &times;
				div(v-if='item.data?.length') {{ item.data[0].text }} {{ item.data[1].text }} {{ item.data[2].text }}
				div(v-else) x: {{ item.x }}, y: {{ item.y }}, {{ item.i }}

		div.selection-box(v-if="selectedBounds"
			:style="{ left: `calc(${(selectedBounds.x * (100 / 12))}% + ${selectedBounds.x * 4}px)`, top: `calc(${(selectedBounds.y * 40) + (selectedBounds.y * 4) + 3}px)`, width: `calc(${(selectedBounds.w * (100 / 12))}% + ${(selectedBounds.w - 1) * 4}px)`, height: `calc(${(selectedBounds.h * 40)}px + ${(selectedBounds.h - 1) * 4}px)` }"
		)
			q-btn.and(round icon='mdi-plus' dense size='xs')
			q-btn.or(round icon='mdi-plus' dense size='xs')

	.text-center.q-mt-md(v-if='!isGridEmpty')
		q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Quick add" @click="addTemp") 
		q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить условие" @click="mytree.toggleDragWindow") 
		q-btn.q-ml-sm(flat color="negative" @click="clearAll") 
			IconClear.ic.q-mr-sm
			.q-cursor Очистить все

</template>

<style scoped lang="scss">
.empty {
	text-align: center;
	margin: 1rem auto;
	color: $secondary;
	gap: .5rem;
}

.big {
	font-size: 3rem;
	color: $secondary;
}

.ic {
	font-size: 1.5rem;
}

.grid {
	margin: 1rem;
	position: relative;
}

.vue-grid-item {
	background: #ccc;
	overflow: hidden;
	font-size: .85rem;
	line-height: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	touch-action: none;

	&.selected {
		background: var(--selection);
		// border: 2px solid hsl(240.69deg 93.55% 70%);
	}
}

:deep(.vue-grid-item.vue-grid-placeholder) {
	background: green;
}

.remove {
	position: absolute;
	top: 0px;
	right: 2px;
	cursor: pointer;
	font-size: .9rem;
	color: #666;
}

.selection-box {
	position: absolute;
	// border: 2px solid red;
	border: 2px solid hsl(240.69deg 93.55% 70%);
	pointer-events: none;
	box-shadow: 0 0 5px hsl(240.69deg 93.55% 70%);
	z-index: 10; // Ensure it appears above grid items

	.and {
		position: absolute;
		bottom: -12px;
		left: 50%;
		transform: translateX(-50%);
		background: hsl(240.69deg 93.55% 70%);
		color: white;
	}

	.or {
		position: absolute;
		right: -12px;
		top: 50%;
		transform: translateY(-50%);
		background: hsl(240.69deg 93.55% 70%);
		color: white;
	}
}
</style>
