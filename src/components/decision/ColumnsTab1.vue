<script setup lang="ts">
import { ref, computed } from 'vue'
import { Draggable, dragContext } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import { useDndStore } from '@/stores/dnd'
import Column from '@/components/decision/Column.vue'
import Param from '@/components/decision/Param.vue'
// import { useDrag } from '@/stores/drag'

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
	children: ParamNode[]
}
interface ParamNode extends BaseNode {
	type: 'param'
	parents?: any
	kind?: any
}
type TreeNode = ColumnNode | ParamNode

const dndStore = useDndStore()

const treeData = ref(props.initialTree ?? [])

const treeRef = ref<InstanceType<typeof Draggable> | null>(null)

// const drag = useDrag()

let colCounter = 0
function addColumn() {
	colCounter++
	treeRef.value?.add(
		{
			id: `col-${Date.now()}-${colCounter}`,
			type: 'column',
			text: `Колонка ${colCounter}`,
			children: [],
		} satisfies ColumnNode,
		null,
		treeRef.value.rootChildren.length
	)
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
	const type = draggingType()
	if (type === 'column') return false // колонку никуда не вкладываем
	return stat.data.type === 'column' || stat.data.type === 'param'
}

function eachDraggable() {
	return true // и колонки, и параметры можно тащить
}

function externalDataHandler(_event: DragEvent): ParamNode | null {
	console.log('external')
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
</script>

<template lang="pug">
q-btn(unelevated color="primary" label="Добавить колонку" @click="addColumn" size="sm") 

.empty(v-if='treeData.length === 0')
	ol
		li Добавьте нужное количество колонок.
		li Задайте названия и тип колонок.
		li Настройте данные для показа в колонке, перетащив нужное поле из списка справа.

Draggable.q-mt-md(
	ref='treeRef'
	v-model='treeData'
	:root-droppable='rootDroppable'
	:each-droppable='eachDroppable'
	:each-draggable='eachDraggable'
	:onExternalDragOver="()=> true"
	:external-data-handler='externalDataHandler'
	:max-level='2'
	@change='repairTree'
	:indent="40"
	treeLine
	:treeLineOffset="20"
	class="mtl-tree"
	)

	template(#default='{ stat, node, index }')
		.all(:class='node.type')
			Column(v-if='node.type === "column"' :stat="stat" @kill="remove(stat)" @toggle='toggle(stat)')
			Param(v-else :stat="stat" @kill="remove(stat)")
</template>

<style scoped lang="scss">
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
</style>
