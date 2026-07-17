<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useDndStore } from '@/stores/dnd'
import DropTarget from '@/components/decision/DropTarget.vue'
import { Kind } from '@/types/enum'

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

const drop = (e: Event, item: any) => {
	console.log('fuck ', item)
	item.children.push(dndStore.externalDragPayload)
}
const isDrop = (item: any) => {
	return dndStore.externalDragPayload !== null && dndStore.externalDragPayload.kind == item.kind
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
</script>

<template lang="pug">
q-btn.q-mb-md(unelevated color="primary" label="Добавить колонку" @click="addColumn" size="sm") 

.empty(v-if='treeData.length === 0')
	ol
		li Добавьте нужное количество колонок.
		li Задайте названия и тип колонок.
		li Настройте данные для показа в колонке, перетащив нужное поле из списка справа.

.par(ref='parent')
	DropTarget(:item="item" v-for="(item, index) in tapes" :key="item.id" @kill='remove(index)')

</template>

<style scoped lang="scss">
.droptarget {
	height: 50px;
	background: #ccc;
	margin-bottom: 1px;
	&.drop {
		background: teal;
	}
}
.all {
	width: 100%;
	cursor: pointer;
	height: 48px;
	margin-bottom: 2px;
}
.pad {
	min-height: 50px;
	margin-top: 1rem;
}
.empty {
	margin-top: 1rem;
	// text-align: center;
	padding: 1rem;
	border: 1px solid var(--my-border-color);
	// color: $negative;
}
:deep(.drag-placeholder) {
	height: 58px;
	margin-bottom: 0.3rem;
}
.headtable {
	display: grid;
	grid-template-columns: 3fr 1fr 90px;
	align-items: center;
	padding-left: 1.3rem;
	margin-bottom: 0.5rem;
	div {
		font-weight: 600;
		font-size: 0.8rem;
	}
}
:deep(.drag-placeholder) {
	background-color: hsl(212 46% 75% / 1);
	border: none;
	border-radius: 4px;
	height: 48px;
}
.my-placeholder {
	display: flex;
	align-items: center;
	height: 100%;
	margin-left: 1rem;
}
:deep(.ghost) {
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
