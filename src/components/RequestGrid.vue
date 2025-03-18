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

const colNum = ref<number>(6)
const index = ref<number>(2)

const addItem = (): void => {
	mytree.layout.push({
		x: 0, // Always starts at the leftmost position
		y: mytree.layout.length + (colNum.value || 12), // Puts it at the bottom
		w: 1,
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

const isAdjacent = (item: GridItem, selectedItems: GridItem[]) => {
	return selectedItems.some(selected => (
		(item.x === selected.x && Math.abs(item.y - selected.y) === 1) || // Vertical adjacency
		(item.y === selected.y && Math.abs(item.x - selected.x) === 1)    // Horizontal adjacency
	));
};

const isStillConnected = (tempSelection: string[]) => {
	if (tempSelection.length === 0) return true; // No items left = valid state

	const remainingItems = mytree.layout.filter(item => tempSelection.includes(item.i));
	const queue = [remainingItems[0]]; // Start BFS from the first selected item
	const visited = new Set<string>();

	while (queue.length) {
		const current = queue.pop();
		if (!current) continue;
		visited.add(current.i);

		remainingItems.forEach(item => {
			if (!visited.has(item.i) && isAdjacent(item, [current])) {
				queue.push(item);
			}
		});
	}

	return visited.size === tempSelection.length; // Ensure all selected items are connected
};

const select = (i: string) => {
	const item = mytree.layout.find(item => item.i === i);
	if (!item) return;

	if (selection.value.includes(i)) {
		// Deselect item
		const tempSelection = selection.value.filter(id => id !== i);

		if (isStillConnected(tempSelection)) {
			selection.value = tempSelection;
		} else {
			alert("Deselecting this item would break the selection group.")
			// console.warn("Deselecting this item would break the selection group.");
		}
	} else {
		// Selecting new item - must be adjacent to existing selection
		if (selection.value.length === 0 || isAdjacent(item, mytree.layout.filter(it => selection.value.includes(it.i)))) {
			selection.value.push(i);
		} else {
			alert("Only adjacent items can be selected.");
			// console.warn("Only adjacent items can be selected.");
		}
	}
};


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
			:col-num="6"
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
			:style="{ left: `calc(${(selectedBounds.x * (100 / 6))}% + 2px`, top: `calc(${(selectedBounds.y * 40) + (selectedBounds.y * 4) + 3}px)`, width: `calc(${(selectedBounds.w * (100 / 6))}%`, height: `calc(${(selectedBounds.h * 40)}px + ${(selectedBounds.h - 1) * 4}px)` }"
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
		cursor: pointer;
		pointer-events: auto;
		display: inline-flex;
	}

	.or {
		position: absolute;
		right: -12px;
		top: 50%;
		transform: translateY(-50%);
		background: hsl(240.69deg 93.55% 70%);
		color: white;
		cursor: pointer;
		pointer-events: auto;
		display: inline-flex;
	}
}
</style>
