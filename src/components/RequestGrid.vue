<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconClear from '@/components/icons/IconClear.vue'
import { usePanels } from '@/stores/panels'
import { useTree } from '@/stores/tree12'
import { GridLayout, GridItem } from 'vue3-grid-layout-next'

const mytree = useTree()
// const panels = usePanels()

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
			)
				.remove(@click='removeItem(item.i)') &times;
				div(v-if='item.data?.length') {{ item.data[0].text }} {{ item.data[1].text }} {{ item.data[2].text }}
				div(v-else) {{ item.i }}

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
	padding: 1rem;
}

// .q-card {
// 	width: 150px;
// 	text-align: center;
// 	padding: .25rem;
// }

.vue-grid-item {
	background: #ccc;
	overflow: hidden;
	font-size: .85rem;
	line-height: 1;
	display: flex;
	justify-content: center;
	align-items: center;
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
</style>
