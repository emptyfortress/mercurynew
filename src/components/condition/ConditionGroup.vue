<script setup lang="ts">
import { computed } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'
import ConditionLeaf from './ConditionLeaf.vue'
import type {
	ConditionNode,
	ConditionGroupNode,
	ConditionLeafNode,
} from '@/components/condition/conditionTypes'
import { ConditionResult } from '@/components/condition/conditionTypes'

interface List {
	id: string
	text: string
	text1: string
	selected: boolean
	hidden: boolean
	type: number
	author: string
}

const modelValue = defineModel<ConditionGroupNode>({ required: true })

const props = defineProps<{
	stageOptions: List[]
	depth?: number
}>()

const depth = computed(() => props.depth ?? 0)

// Настройка drag-and-drop
const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'drag-placeholder',
	sortable: true,
	dragHandle: '.drag-handle',
	draggable: (child: HTMLElement) => {
		return child.classList.contains('child-item')
	},
	group: 'condition-nodes',
}

// useDragAndDrop возвращает [parent (ref), children (reactive массив)]
const [parentRef, children] = useDragAndDrop(modelValue.value.children, config)

// Синхронизируем с modelValue
const updateChildren = () => {
	modelValue.value.children = children.value
}

// Переключение оператора
const toggleOperator = () => {
	modelValue.value.type = modelValue.value.type === 'AND' ? 'OR' : 'AND'
}

// Удаление ребёнка
const removeChild = (index: number) => {
	children.value.splice(index, 1)
}

// Обновление ребёнка
const updateChild = (index: number, newChild: ConditionNode) => {
	children.value[index] = newChild
}

// Добавить условие (лист)
const addLeaf = () => {
	const newLeaf: ConditionLeafNode = {
		id: crypto.randomUUID(),
		kind: 'leaf',
		stageId: null,
		result: ConditionResult.Positive,
	}
	children.value.push(newLeaf)
}

// Добавить подгруппу
const addGroup = () => {
	const newGroup: ConditionGroupNode = {
		id: crypto.randomUUID(),
		kind: 'group',
		type: 'AND',
		children: [],
	}
	children.value.push(newGroup)
}
</script>

<template lang="pug">
.condition-group(:style="{ marginLeft: `${depth * 20}px` }")
	.group-header
		q-btn-toggle(
			:model-value="modelValue.type"
			@update:model-value="toggleOperator"
			:options="[{ label: 'И', value: 'AND' }, { label: 'ИЛИ', value: 'OR' }]"
			size="sm"
			dense
			unelevated
		)
		
		q-btn(icon="mdi-plus" size="sm" round dense flat color="primary")
			q-menu(auto-close anchor="bottom left" self="top left")
				q-list(style="min-width: 180px")
					q-item(clickable @click="addLeaf")
						q-item-section Добавить условие
					q-item(clickable @click="addGroup")
						q-item-section Добавить группу

	.children(v-if="children.length > 0" ref="parentRef")
		.child-item(
			v-for="(child, index) in children"
			:key="child.id"
		)
			.drag-handle
				q-icon(name="mdi-drag-vertical" color="grey-6" size="sm")
			
			.child-content
				ConditionGroup(
					v-if="child.kind === 'group'"
					:model-value="child"
					@update:model-value="updateChild(index, $event)"
					:stage-options="stageOptions"
					:depth="depth + 1"
				)
				ConditionLeaf(
					v-else
					:model-value="child"
					@update:model-value="updateChild(index, $event)"
					:stage-options="stageOptions"
				)
			
			q-btn(
				icon="mdi-delete"
				size="xs"
				round
				dense
				flat
				color="negative"
				@click="removeChild(index)"
			)

	.empty-state(v-else)
		.text-caption.text-grey-7 нет условий
</template>

<style scoped lang="scss">
.condition-group {
	position: relative;
	padding-left: 12px;
	margin-bottom: 10px;

	// Вертикальная линия левого края
	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 2px;
		background: #d0d0d0;
	}

	// Горизонтальная линия к первому ребёнку
	&::after {
		content: '';
		position: absolute;
		left: 0;
		top: 16px;
		width: 10px;
		height: 2px;
		background: #d0d0d0;
	}
}

.group-header {
	display: flex;
	gap: 8px;
	align-items: center;
	margin-bottom: 8px;
}

.children {
	display: flex;
	flex-direction: column;
	gap: 8px;
	background: var(--bgLight);
	border: 1px solid var(--my-border-color);
	border-radius: 0.25rem;
	padding: 4px 8px;
	padding-left: 0;
}

.child-item {
	display: flex;
	gap: 8px;
	align-items: flex-center;
	position: relative;

	// Горизонтальная линия к каждому ребёнку
	&::before {
		content: '';
		position: absolute;
		left: -10px;
		top: 20px;
		width: 10px;
		height: 2px;
		background: #d0d0d0;
	}
}

.drag-handle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	flex-shrink: 0;
	cursor: grab;

	&:active {
		cursor: grabbing;
	}
}

.child-content {
	flex: 1;
	min-width: 0; // важно для flex-layout
	align-items: center;
}

.empty-state {
	padding: 8px 12px;
	border-radius: 4px;
	background: #fafafa;
	text-align: center;
	font-style: italic;
}
</style>
