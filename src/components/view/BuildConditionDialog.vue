<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import FieldPicker from '@/components/decision/FieldPicker.vue'

type OperatorType = 'AND' | 'OR'
type ValueSource = 'field' | 'value' | 'search'

interface ConditionNode {
	id: string
	kind: 'condition'
	fieldLabel: string | null
	operation: string | null
	value: string | null
	valueType: string | null
	valueSource: ValueSource | null
}

interface OperatorNode {
	id: string
	kind: 'operator'
	type: OperatorType
	children: BuildConditionNode[]
}

type BuildConditionNode = ConditionNode | OperatorNode

const ROOT_ID = 'build-condition-root'

const modelValue = defineModel<boolean>()
const props = defineProps<{
	conditionTree?: OperatorNode | null
	preview?: string | null
}>()
const emit = defineEmits<{
	apply: [condition: { preview: string; tree: OperatorNode }]
}>()
const treeRef = ref<any>()
const pickerOpen = ref(false)
const pickerMode = ref<'field' | 'value' | null>(null)
const activeConditionId = ref<string | null>(null)
const dummyOperations = [
	'==',
	'!=',
	'СтрокиРавны',
	'СтрокиНеРавны',
	'ПустоеЗначение',
	'НеПустоеЗначение',
	'>',
	'>=',
	'<',
	'<=',
	'ОдинИз',
	'НеОдинИз',
]
const valueTypeOptions = ['Строка', 'Число', 'Дата']

const createEmptyTree = (): OperatorNode => ({
	id: ROOT_ID,
	kind: 'operator',
	type: 'AND',
	children: [],
})

const cloneTree = (tree: OperatorNode): OperatorNode => JSON.parse(JSON.stringify(tree))

const localTree = ref<OperatorNode>(createEmptyTree())

const treeData = computed<OperatorNode[]>({
	get: () => [localTree.value],
	set: (value) => {
		if (value[0]) localTree.value = value[0]
	},
})

const isEmpty = computed(() => localTree.value.children.length === 0)

const serializeCondition = (node: BuildConditionNode): string => {
	if (node.kind === 'condition') {
		return `${node.fieldLabel ?? '(поле не выбрано)'} ${node.operation ?? '—'} ${node.value ?? '—'}`
	}

	if (node.children.length === 0) return '[нет условий]'

	const operator = node.type === 'AND' ? ' И ' : ' ИЛИ '
	return node.children
		.map((child) => {
			const text = serializeCondition(child)
			return child.kind === 'operator' && child.children.length > 1 ? `(${text})` : text
		})
		.join(operator)
}

const conditionPreview = computed(() => serializeCondition(localTree.value))
const editablePreview = ref('')
const previewWasEdited = ref(false)

watch(conditionPreview, (preview) => {
	if (modelValue.value && !previewWasEdited.value) {
		editablePreview.value = preview
	}
})

const closePicker = () => {
	pickerOpen.value = false
	pickerMode.value = null
	activeConditionId.value = null
}

watch(modelValue, (isOpen) => {
	if (isOpen) {
		const tree = props.conditionTree ? cloneTree(props.conditionTree) : createEmptyTree()
		const generatedPreview = serializeCondition(tree)

		localTree.value = tree
		editablePreview.value = props.preview ?? generatedPreview
		previewWasEdited.value =
			props.preview !== null && props.preview !== undefined && props.preview !== generatedPreview
	} else {
		closePicker()
		localTree.value = createEmptyTree()
		editablePreview.value = ''
		previewWasEdited.value = false
	}
})

const handleDocumentClick = (event: MouseEvent) => {
	if (!pickerOpen.value) return

	const target = event.target as HTMLElement
	if (target.closest('.field-picker, .field-selector, .q-menu')) return

	closePicker()
}

onMounted(() => document.addEventListener('click', handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', handleDocumentClick))

const addCondition = (kind: BuildConditionNode['kind']) => {
	const item: BuildConditionNode =
		kind === 'condition'
			? {
					id: crypto.randomUUID(),
					kind: 'condition',
					fieldLabel: null,
					operation: null,
					value: null,
					valueType: null,
					valueSource: null,
				}
			: { id: crypto.randomUUID(), kind: 'operator', type: 'AND', children: [] }

	const root = treeRef.value?.rootChildren?.[0]
	if (root) treeRef.value.add(item, root, root.children.length)
}

const toggleOperator = (node: OperatorNode) => {
	node.type = node.type === 'AND' ? 'OR' : 'AND'
}

const toggleOpen = (stat: any) => {
	stat.open = !stat.open
}

const removeNode = (stat: any) => {
	treeRef.value?.remove(stat)
}

const isDroppable = (stat: any) => stat.data.kind === 'operator'
const isDraggable = (stat: any) => stat.data.id !== ROOT_ID

const openPicker = (node: ConditionNode) => {
	activeConditionId.value = node.id
	pickerMode.value = 'field'
	pickerOpen.value = true
}

const openValuePanel = (node: ConditionNode) => {
	activeConditionId.value = node.id
	pickerMode.value = 'value'
	pickerOpen.value = true
}

const findCondition = (node: BuildConditionNode, id: string): ConditionNode | null => {
	if (node.kind === 'condition') return node.id === id ? node : null

	for (const child of node.children) {
		const found = findCondition(child, id)
		if (found) return found
	}

	return null
}

const activeCondition = computed(() =>
	activeConditionId.value ? findCondition(localTree.value, activeConditionId.value) : null
)

const selectField = (nodes: Array<{ text: string; parents?: string[] }>) => {
	const field = nodes.at(-1)
	if (!field) return
	const fieldPath = [...(field.parents ?? []), field.text].join(' > ')

	if (activeConditionId.value) {
		const condition = findCondition(localTree.value, activeConditionId.value)
		if (condition) condition.fieldLabel = fieldPath
	}

	closePicker()
}

const selectValueField = (nodes: Array<{ text: string; parents?: string[] }>) => {
	const field = nodes.at(-1)
	if (!field) return
	const fieldPath = [...(field.parents ?? []), field.text].join(' > ')

	if (activeConditionId.value) {
		const condition = findCondition(localTree.value, activeConditionId.value)
		if (condition) condition.value = fieldPath
	}

	closePicker()
}

const apply = () => {
	emit('apply', {
		preview: editablePreview.value,
		tree: cloneTree(localTree.value),
	})
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card.dialog-card
		q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
		q-card-section
			.text-h6 Задать условие

		q-card-section.dialog-content

			Draggable.condition-tree(
				ref="treeRef"
				v-model="treeData"
				treeLine
				:indent="30"
				:each-draggable="isDraggable"
				:each-droppable="isDroppable"
				:root-droppable="false"
			)
				template(#default="{ node, stat }")
					.zero(v-if="node.kind === 'operator'")
						q-icon.trig(
							v-if="stat.children.length"
							name="mdi-chevron-down"
							:class="{ closed: !stat.open }"
							@click.stop="toggleOpen(stat)"
						)
						.root(@click.stop="toggleOperator(node)")
							.icon(:class="{ or: node.type === 'OR' }")
							.q-ml-md Оператор
							.text-weight-bold.q-ml-sm {{ node.type === 'AND' ? 'И' : 'ИЛИ' }}
						q-btn.closing(
							v-if="node.id !== ROOT_ID"
							flat round dense color="secondary" icon="mdi-close" size="sm"
							@click.stop="removeNode(stat)"
						)

					.node(v-else)
						q-icon.drag-handle(name="mdi-drag-vertical" color="grey-6" size="sm")
						.condition-fields
							q-input.field-selector(
								:model-value="node.fieldLabel"
								label="Раздел / Поле"
								placeholder="Выберите поле"
								outlined dense readonly
								@click.stop="openPicker(node)"
							)
								template(#append)
									q-icon(name="mdi-dots-horizontal" class="selector-icon")
							q-select(
								v-model="node.operation"
								:options="dummyOperations"
								optionsDense
								bgColor="primary"
								label="Условие"
								outlined dense
							)
							q-input(
								v-model="node.value"
								label="Значение"
								outlined dense readonly
								@click.stop="openValuePanel(node)"
							)
								template(#append)
									q-icon(name="mdi-dots-horizontal" class="selector-icon")
						q-btn.closing(
							flat round dense color="secondary" icon="mdi-close" size="sm"
							@click.stop="removeNode(stat)"
						)

			.text-center.text-grey-6(v-if="isEmpty")
				q-icon(name="mdi-source-branch-plus" size="28px")
				div.q-mt-sm Добавьте условие или оператор, чтобы собрать логику проверки.

		.field-picker(v-if="pickerOpen")
			q-btn.picker-close(flat round dense size='sm' icon="mdi-close" color="primary" @click="closePicker")
			q-scroll-area.field-picker-scroll
				template(v-if="pickerMode === 'field'")
					.text-h6.q-mb-md.text-center Аргумент 1
					FieldPicker(@update:selected="selectField")
				template(v-else-if="pickerMode === 'value' && activeCondition")
					.text-h6.q-mb-md.text-center Аргумент 2
					q-select(
						v-model="activeCondition.valueType"
						:options="valueTypeOptions"
						label="Тип значения"
						outlined dense
					)
					.column.q-gutter-y-sm.q-mt-md
						q-radio(dense v-model="activeCondition.valueSource" val="value" label="Значение")
						q-radio(dense v-model="activeCondition.valueSource" val="field" label="Раздел/поле")
						q-radio(dense v-model="activeCondition.valueSource" val="search" label="Поисковое слово")
					q-separator(spaced)
					q-input(
						v-if="activeCondition.valueSource === 'value'"
						v-model="activeCondition.value"
						outlined dense
						label="Значение"
						class="q-mt-md"
					)
					q-input(
						v-else-if="activeCondition.valueSource === 'search'"
						v-model="activeCondition.value"
						label="Поисковое слово"
						outlined dense
						class="q-mt-md"
					)
					FieldPicker(
						v-else-if="activeCondition.valueSource === 'field'"
						@update:selected="selectValueField"
					)
					.row.justify-end.q-gutter-sm.q-mt-md
						q-btn(outline size="sm" color="primary" label="Отмена" @click="closePicker")
						q-btn(outline size="sm" color="primary" label="OK" @click="closePicker")

		q-card-section.condition-preview
			.text-caption Превью условия
			q-input.condition-preview__input(
				v-model="editablePreview"
				type="textarea"
				autogrow
				filled dense
				input-style="font-family: monospace; font-size: 12px;"
				@update:model-value="previewWasEdited = true"
			)

		q-card-actions(align="right")
			q-btn(flat color="primary" icon="mdi-plus-circle-outline" label="Добавить условие" @click="addCondition('condition')")
			q-btn(flat color="primary" icon="mdi-plus-circle-outline" label="Добавить оператор" @click="addCondition('operator')")
			q-space
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(unelevated color="primary" label="Применить" @click="apply")
</template>

<style scoped lang="scss">
.dialog-card {
	min-width: 1000px;
	height: 75vh;
	position: relative;
	display: flex;
	flex-direction: column;
}

.close {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	z-index: 3;
}

.dialog-content {
	position: relative;
	min-height: 180px;
	flex: 1 1 auto;
	overflow-y: auto;
}

.condition-tree {
	min-height: 100px;
}

.node {
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 150px 1fr;
	gap: 0.5rem;
	align-items: center;
	background: var(--bgLight);
	position: relative;
	padding: 2px 2rem 2px 2rem;
	border-radius: 0.25rem;
	border: var(--border);
	margin: 2px 0;
	padding-top: 2px;
	padding-bottom: 2px;
	.closing {
		position: absolute;
		right: 0.5rem;
		display: none;
	}
	&:hover {
		border-color: $secondary;
		.closing {
			display: block;
		}
	}
}

.root {
	display: flex;
	justify-content: start;
	align-items: center;
}

.zero {
	width: 100%;
	display: flex;
	justify-content: start;
	align-items: center;
	margin-bottom: 4px;
	margin-top: 4px;
	position: relative;
	.closing {
		position: absolute;
		right: 0.5rem;
		display: none;
	}
	&:hover {
		.closing {
			display: block;
		}
	}
}

.trig {
	font-size: 1.3rem;
	transition: 0.2s ease all;
	margin-right: 0.25rem;
	cursor: pointer;
}

.trig.closed {
	transform: rotate(-90deg);
}

.icon {
	width: 49px;
	height: 36px;
	background-image: url('@/assets/img/andor.svg');
	transition: 0.2s ease-out all;
	background-position: top left;
	cursor: pointer;
	&.or {
		background-position: bottom left;
	}
}

.condition-fields {
	display: contents;
}

.condition-fields :deep(.q-field) {
	width: 100%;
}

.condition-fields :deep(.q-field__control) {
	cursor: pointer;
}

.selector-icon {
	cursor: pointer;
}

.drag-handle {
	position: absolute;
	left: 0.5rem;
	z-index: 1;
	font-size: 1.3rem;
	cursor: grab;
	user-select: none;
	margin-right: 0.5rem;

	&:active {
		cursor: grabbing;
	}
}

.field-picker {
	position: absolute;
	top: 0;
	right: 0;
	width: 400px;
	height: 100%;
	box-sizing: border-box;
	padding: 1rem;
	background: white;
	border: 1px solid #cfdbec;
	border-radius: 0.25rem;
	box-shadow: var(--shad0) !important;
	z-index: 2;
}

.field-picker-scroll {
	height: 100%;
}

.picker-close {
	position: absolute;
	top: 0.25rem;
	left: 0.25rem;
	z-index: 1;
}

.condition-preview {
	padding-top: 0;
}

.condition-preview__input {
	margin-top: 0.25rem;

	:deep(textarea) {
		word-break: break-word;
	}
}

:deep(.drag-placeholder) {
	height: 44px;
	border-radius: 0.25rem;
}

:deep(.tree-hline) {
	width: 30px;
}

:deep(.tree-line) {
	background-color: #a8bbd1;
}
:deep(.q-field__control:before) {
	background: white;
}
</style>
