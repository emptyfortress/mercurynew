<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconClear from '@/components/icons/IconClear.vue'
// import TreeItem from '@/components/TreeItem.vue'
// import TreeQuery from '@/components/TreeQuery.vue'
// import { Draggable } from '@he-tree/vue'
// import '@he-tree/vue/style/default.css'
// import '@he-tree/vue/style/material-design.css'
import { usePanels } from '@/stores/panels'
import { useTree } from '@/stores/tree'
import { GridLayout, GridItem } from 'vue3-grid-layout-next'

const mytree = useTree()
const panels = usePanels()

// const addOper = (() => {
// 	let tmp = {
// 		type: 10,
// 		text: "И",
// 		and: true,
// 		children: []
// 	}
// 	// tree.value.add(tmp, tree.value.rootChildren[0])
// })

interface GridItem {
	x: number,
	y: number,
	w: number,
	h: number,
	i: string
}

const layout = ref<GridItem[]>([
	{ x: 0, y: 0, w: 2, h: 2, i: '1' }
])

const colNum = ref<number>(12);
const index = ref<number>(1);

const addItem = (): void => {
	layout.value.push({
		x: 0, // Always starts at the leftmost position
		y: layout.value.length + (colNum.value || 12), // Puts it at the bottom
		w: 2,
		h: 2,
		i: index.value.toString(), // Convert number to string
	});
	index.value++; // Ensure key is always unique
};

const removeItem = (val: string): void => {
	const itemIndex = layout.value.findIndex((item) => item.i === val);
	if (itemIndex !== -1) {
		layout.value.splice(itemIndex, 1);
	}
};

const addTemp = (() => {
	addItem()
})

const isGridEmpty = computed(() => layout.value.length === 0)

</script>

<template lang="pug">
div
	.empty(v-if='isGridEmpty')
		IconFaceMask.big
		div Запрос не настроен.
		q-btn.q-mt-md(unelevated color="primary" label="Настроить" @click="addTemp") 
		// q-btn.q-mt-md(unelevated color="primary" label="Настроить" @click="mytree.toggleDragWindow") 


	// .grid
	grid-layout(v-if='!isGridEmpty'
		:layout.sync="layout"
		:col-num="12"
		:row-height="30"
		:is-draggable="true"
		:is-resizable="true"
		:is-mirrored="false"
		:vertical-compact="true"
		:margin="[4, 4]"
		:use-css-transforms="true"
	)
		grid-item(
			v-for="item in layout"
			:x="item.x"
			:y="item.y"
			:w="item.w"
			:h="item.h"
			:i="item.i"
			:key="item.i"
		) {{ item.i }}
			.remove &times;

	.text-center.q-mt-md(v-if='!isGridEmpty')
		q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить условие" @click="addTemp") 
		// q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить условие" @click="mytree.toggleDragWindow") 
		// q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить оператор" @click="addOper") 
		q-btn.q-ml-sm(flat color="negative" @click="clear") 
			IconClear.ic.q-mr-sm
			.q-cursor Очистить все



</template>

<style scoped lang="scss">
.empty {
	text-align: center;
	margin: 1rem auto;
	color: $secondary;
}


:deep(.drag-placeholder) {
	height: 36px;
	border-radius: .25rem;
}

:deep(.tree-hline) {
	width: 30px;
}

:deep(.tree-node-inner) {
	min-width: 450px;

	&:hover {

		.close,
		.eye {
			display: block;
		}
	}
}

.eye {
	position: absolute;
	right: 1.7rem;
	top: 50%;
	transform: translateY(-50%);
	display: none;
}

.close {
	position: absolute;
	right: .25rem;
	top: 50%;
	transform: translateY(-50%);
	display: none;
}

.big {
	font-size: 3rem;
	color: $secondary;
}

.ic {
	font-size: 1.5rem;
}

.topblock,
.err {
	padding: 1rem;
}

.grid {
	padding: 1rem;
	display: flex;
	justify-content: space-between;
	align-items: start;
}

.err {
	cursor: pointer;
	padding-bottom: 0;
}

.q-card {
	width: 150px;
	text-align: center;
	padding: .25rem;
}

.err {
	animation: bounce-top 0.9s 5s;
}

.pink {
	background: transparent;
	color: darkred;
}

.vue-grid-item {
	background: #ccc;
}

:deep(.vue-grid-item.vue-grid-placeholder) {
	background: green;
}

.remove {
	position: absolute;
	top: -3px;
	right: 2px;
	cursor: pointer;
	font-size: .9rem;
	color: #666;
}
</style>
