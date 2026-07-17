<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// import { Draggable, dragContext } from '@he-tree/vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
// import '@he-tree/vue/style/default.css'
// import '@he-tree/vue/style/material-design.css'
import { useDndStore } from '@/stores/dnd'
import DropTarget from '@/components/decision/DropTarget.vue'
// import Column from '@/components/decision/Column.vue'
// import Param from '@/components/decision/Param.vue'
import { Kind } from '@/types/enum'

const props = defineProps<{
	initialTree?: TreeNode[]
}>()

type NodeType = 'column' | 'param'

interface BaseNode {
	id: string
	type: NodeType
	text: string
}
interface ColumnNode extends BaseNode {
	type: 'column'
	kind: Kind | null
	children: ParamNode[]
}
interface ParamNode extends BaseNode {
	type: 'param'
	parents?: any
	kind?: any
}
type TreeNode = ColumnNode | ParamNode

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

const treeRef = ref<InstanceType<typeof Draggable> | null>(null)

let colCounter = 0
function addColumn() {
	colCounter++
	treeRef.value?.add(
		{
			id: `col-${Date.now()}-${colCounter}`,
			type: 'column',
			text: `Колонка ${colCounter}`,
			kind: null,
			children: [],
		} satisfies ColumnNode,
		null,
		treeRef.value.rootChildren.length
	)
	console.log(treeData.value)
}

// Что сейчас тащат. Если dragContext.dragNode пуст — значит перетаскивание
// пришло снаружи дерева, а снаружи у нас только параметры.
function draggingType(): NodeType {
	return dragContext.dragNode ? (dragContext.dragNode.data as TreeNode).type : 'param'
}

// В корень можно только колонки
function rootDroppable() {
	return draggingType() === 'column'
}

// Наведение на узел stat: разрешаем "приземлиться" рядом/внутрь только
// в допустимых комбинациях
function eachDroppable(stat: any) {
	return true
	// const type = draggingType()
	// if (type === 'column') return false // колонку никуда не вкладываем
	//
	// return stat.data.type === 'column' && stat.data.kind === dndStore.externalDragPayload.kind
}

function eachDraggable() {
	return true // и колонки, и параметры можно тащить
}

function externalDataHandler(_event: DragEvent): ParamNode | null {
	const payload = dndStore.externalDragPayload
	if (!payload) return null
	return {
		id: payload.id ?? `param-${Date.now()}`,
		type: 'param',
		text: payload.text,
		parents: payload.parents,
		kind: payload.kind,
	}
}

// Страховка: разные DnD-библиотеки по-разному трактуют зоны "вставить рядом"
// и "вложить внутрь". Поэтому после любого изменения дерева дополнительно
// проверяем структуру и чиним её, если что-то нарушилось.
function repairTree() {
	const tree = treeRef.value
	if (!tree) return
	const root = tree.rootChildren as any[]

	// параметр в корне — переносим в первую колонку (или удаляем, если колонок нет)
	for (const stat of [...root]) {
		if (stat.data.type === 'param') {
			const firstColumn = root.find((s) => s.data.type === 'column')
			firstColumn ? tree.move(stat, firstColumn, firstColumn.children.length) : tree.remove(stat)
		}
	}

	// колонка внутри колонки — поднимаем обратно в корень
	const walk = (stats: any[]) => {
		for (const stat of stats) {
			if (stat.level > 1 && stat.data.type === 'column') {
				tree.move(stat, null, tree.rootChildren.length)
			}
			walk(stat.children as any[])
		}
	}
	walk(root)
}

const remove = (e: Stat) => {
	treeRef.value?.remove(e)
}
const toggle = (stat: Stat) => {
	stat.open = !stat.open
}

const drop = (e: Event, item: any) => {
	console.log('fuck ', item)
	item.children.push(dndStore.externalDragPayload)
}
const isDrop = (item: any) => {
	return dndStore.externalDragPayload !== null && dndStore.externalDragPayload.kind == item.kind
}

// const sortDisabled = computed(() => dndStore.externalDragPayload != null)

// const config = {
// 	plugins: [animations()],
// 	dragPlaceholderClass: 'ghost',
// 	// draggable: (child: HTMLElement) => {
// 	// 	return child.classList.contains('my-expansion')
// 	// },
// 	draggable: (child: HTMLElement) => {
// 		// пока идёт внешний драг — ни один child не считается узлом formkit
// 		if (dndStore.externalDragPayload != null) return false
// 		return child.classList.contains('my-expansion')
// 	},
// }

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('my-expansion')
	},
}

const [parent, tapes] = useDragAndDrop(treeData.value, config)

// watch(
// 	() => dndStore.externalDragPayload,
// 	(payload) => {
// 		// payload != null → идёт внешний драг → полностью отключаем DnD-систему formkit на списке
// 		updateConfig({ disabled: payload != null })
// 	}
// )
</script>

<template lang="pug">
q-btn.q-mb-md(unelevated color="primary" label="Добавить колонку" @click="addColumn" size="sm") 

.empty(v-if='treeData.length === 0')
	ol
		li Добавьте нужное количество колонок.
		li Задайте названия и тип колонок.
		li Настройте данные для показа в колонке, перетащив нужное поле из списка справа.

.par(ref='parent')
	DropTarget(:item="item" v-for="item in tapes" :key="item.id")

// Draggable.q-mt-md(
// 	ref='treeRef'
// 	v-model='treeData'
// 	:root-droppable='rootDroppable'
// 	:each-droppable='eachDroppable'
// 	:each-draggable='eachDraggable'
// 	:indent="40"
// 	treeLine :treeLineOffset="20" class="mtl-tree") template(#default='{ stat, node, index }') .all(:class='node.type') Column( v-if='node.type === "column"', :stat="stat", @kill="remove(stat)", @toggle='toggle(stat)'
// 				@dragover.prevent,
// 				@drop="drop($event, node)"
// 			)
// 			Param(v-else :stat="stat" @kill="remove(stat)")
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
.ghost {
	width: 100%;
	height: 48px;
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
	}
}
</style>
