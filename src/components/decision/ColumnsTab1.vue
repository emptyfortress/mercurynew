<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useDndStore } from '@/stores/dnd'
import DropTarget from '@/components/decision/DropTarget.vue'
// import { Kind } from '@/types/enum'

const props = defineProps<{
	initialTree?: TreeNode[]
}>()

const dndStore = useDndStore()

const treeData = ref(
	props.initialTree ?? [
		{
			id: 'col-1784195793292-1',
			type: 'column',
			text: 'Автор',
			kind: 5,
			children: [],
		},
		{
			id: 'col-1784195799717-2',
			type: 'column',
			text: 'Тема',
			kind: 0,
			children: [],
		},
		{
			id: 'col-1784195800967-3',
			type: 'column',
			text: 'Колонка 3',
			kind: null,
			children: [],
		},
	]
)

let colCounter = 0
function addColumn() {
	colCounter++
	let newColumn = {
		id: `col-${Date.now()}-${colCounter}`,
		type: 'column',
		text: `Колонка ${colCounter}`,
		kind: null,
		children: [],
	}
	treeData.value?.push(newColumn)
}

const remove = (index: number) => {
	tapes.value.splice(index, 1)
}

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('my-expansion')
	},
	disabled: false,
}

const [parent, tapes, updateConfig] = useDragAndDrop(treeData.value, config)

watch(
	() => dndStore.externalDragPayload,
	(payload) => {
		// payload != null → идёт внешний драг → отключаем DnD-систему formkit на списке
		updateConfig({ disabled: payload != null })
	}
)

const insert = (item: any) => {
	item.children.push(dndStore.externalDragPayload)
}
</script>

<template lang="pug">
q-btn.q-mb-md(unelevated color="primary" label="Добавить колонку" @click="addColumn" size="sm") 

.empty(v-if='treeData.length === 0')
	ol
		li Добавьте нужное количество колонок.
		li Задайте названия и тип колонок.
		li Настройте данные для показа в колонке, перетащив нужное поле из списка справа.

.par(ref='parent')
	DropTarget(:item="item" v-for="(item, index) in tapes" :key="item.id" @drop='insert(item)' @kill='remove(index)')

</template>

<style scoped lang="scss">
.empty {
	margin-top: 1rem;
	padding: 1rem;
	border: 1px solid var(--my-border-color);
}
.ghost {
	width: 100%;
	height: 48px;
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none !important;
	}
}
</style>
