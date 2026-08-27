<script setup lang="ts">
import { ref } from 'vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import GroupNode from './GroupNode.vue'
import SimpleNode from './SimpleNode.vue'
import OptionsNode from './OptionsNode.vue'
import ConditionsNode from './ConditionsNode.vue'
import type {
	AnyNode,
	GroupNode as GroupNodeType,
	SimpleElement,
	OptionsSetNode,
	ConditionsSetNode,
} from './nodesTypes'

const result = ref()
const options = [
	'Строка',
	'Строка Unicode',
	'Дата и время',
	'Целое число',
	'Дробное число',
	'Идентификатор',
	'Да / нет',
]

let nextId = 1

const list = ref<AnyNode[]>([])
const tree = ref()

const addFunction = (item: any) => {
	console.log('add function chain', item)
}

const addNode = (node: AnyNode) => {
	if (!tree.value) return

	let rootStats = tree.value.rootChildren as any[]

	// если корневой группы ещё нет — создаём её
	if (!rootStats.length) {
		tree.value.add(createGroupNode())
		rootStats = tree.value.rootChildren
	}

	// корневой элемент — всегда group, добавляем узел в него
	const rootGroupStat = rootStats[0]
	tree.value.add(node, rootGroupStat)
}

const createGroupNode = (): GroupNodeType => ({
	id: nextId++,
	type: 'group',
	name: 'Группа',
	function: '[ + ]',
	open: false,
	expanded: false,
	children: [],
})

const createSimpleElement = (): SimpleElement => ({
	id: nextId++,
	type: 'simple',
	name: 'Новый элемент',
	open: false,
	expanded: false,
	mode: 'field',
	section: '',
	field: '',
	func: '',
	funcLength: null,
	preview: '',
	valueType: '',
	fixedValue: '',
	children: [],
})

const createOptionsSetNode = (): OptionsSetNode => ({
	id: nextId++,
	type: 'options',
	name: 'Набор вариантов',
	open: false,
	expanded: false,
	children: [],
})

const createConditionsSetNode = (): ConditionsSetNode => ({
	id: nextId++,
	type: 'conditions',
	name: 'Набор условий',
	open: false,
	expanded: false,
	children: [],
})

const addSimpleElement = () => addNode(createSimpleElement())
const addOptionsSet = () => addNode(createOptionsSetNode())
const addConditionsSet = () => addNode(createConditionsSetNode())
const addGroup = () => addNode(createGroupNode())

// ---- ограничения drag & drop ----

const eachDraggable = () => {
	return true
}

const eachDroppable = (stat: any) => {
	// принимать вложенные узлы могут только узлы типа group
	return stat.data.type === 'group'
}
</script>

<template lang="pug">
.mygrid
	label Тип результата:
	q-select(v-model="result" dense outlined :options="options")
	div
.text-bold.text-center Элементы вычисляемого поля

Draggable(
	ref="tree"
	treeLine
	v-model="list"
	:indent="40"
	:each-draggable="eachDraggable"
	:each-droppable="eachDroppable"
	:rootDroppable='false'
	triggerClass="drag-handle"
)
	template(#default="{ node, stat }")
		GroupNode(
			v-if="node.type === 'group'"
			:node="node"
			:stat="stat"
		)
		SimpleNode(
			v-else-if="node.type === 'simple'"
			:node="node"
			:stat="stat"
			@addFunction="addFunction"
		)
		OptionsNode(
			v-else-if="node.type === 'options'"
			:node="node"
			:stat="stat"
		)
		ConditionsNode(
			v-else-if="node.type === 'conditions'"
			:node="node"
			:stat="stat"
		)

.text-center.q-mt-md
	q-btn(flat icon="mdi-plus" color="primary" label="Добавить" size="12px") 
		q-menu
			q-list
				q-item(clickable @click="addSimpleElement" v-close-popup)
					q-item-section(side) ⠿
					q-item-section Простой элемент
				q-item(clickable @click="addOptionsSet" v-close-popup)
					q-item-section(side) ⠿
					q-item-section Набор вариантов
				q-item(clickable @click="addConditionsSet" v-close-popup)
					q-item-section(side) ⠿
					q-item-section Набор условий
				q-separator
				q-item(clickable @click="addGroup" v-close-popup)
					q-item-section(side) [+]
					q-item-section Группа
</template>

<style scoped lang="scss">
.mygrid {
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.q-select {
	width: 100%;
}
.q-expansion-item {
	background: var(--bgLight);
	border-radius: 0.25rem;
	margin-bottom: 0.5rem;
	cursor: pointer;
	border: var(--border);
}

.my-expansion :deep(.q-expansion-item__container > .q-item .q-focus-helper) {
	display: none;
}
.my-expansion :deep(.q-expansion-item__container > .q-item:hover) {
	border-radius: 0.25rem;
	box-shadow: var(--shad0);
}
:deep(.q-expansion-item--expanded) {
	background: white;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
	border: 1px solid $secondary;
}

.inside {
	padding: 1rem;
}
.drag-handle {
	font-size: 1.3rem;
	cursor: grab;
	user-select: none;
	margin-right: 1rem;

	&:active {
		cursor: grabbing;
	}
}
:deep(.tree-hline) {
	width: 28px;
}
.q-item__section--side {
	font-size: 1rem;
	color: $primary;
}
:deep(.drag-placeholder) {
	height: 48px;
	border-radius: 0.25rem;
}
</style>
