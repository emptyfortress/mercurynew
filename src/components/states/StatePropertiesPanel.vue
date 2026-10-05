<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Edge, Node } from '@vue-flow/core'
import { translationLocales, type NameTranslations } from '@/constants/locales'
import type { NodePropertyChanges, OperationDefinition } from './types'
import StateOperationsDialog from './StateOperationsDialog.vue'
import StateTransitionsDialog from './StateTransitionsDialog.vue'
import StateList from './StateList.vue'
import StateOperationsList from './StateOperationsList.vue'
import StateTransitionsList from './StateTransitionsList.vue'
import StateOperationEditDialog from './StateOperationEditDialog.vue'

type NodeData = {
	label?: string
	nameTranslations?: NameTranslations
	operationIds?: string[]
	isInitial?: boolean
}
type StateNode = Pick<Node<NodeData>, 'id' | 'data'>
type StateEdge = Pick<Edge<{ operationId: string }>, 'id' | 'label' | 'source' | 'target' | 'data'>
type TransitionTarget = { id: string; label: string }
type PanelNode = Pick<Node<NodeData>, 'id' | 'data'> & { selected?: boolean }

const props = defineProps<{
	node: StateNode | null
	edge: StateEdge | null
	selectedNodes: PanelNode[]
	nodes: StateNode[]
	edges: StateEdge[]
	operations: OperationDefinition[]
	transitionTargets: TransitionTarget[]
}>()
const emit = defineEmits<{
	(event: 'update:node-properties', id: string, changes: NodePropertyChanges): void
	(event: 'update:edge-operation', edgeId: string, operationId: string): void
	(event: 'rename-operation', operationId: string, name: string, nameTranslations: NameTranslations): void
	(event: 'assign-operation', id: string, operationIds: string[]): void
	(event: 'unassign-operation', id: string, operationId: string): void
	(event: 'create-operation', nodeIds: string[], operation: Omit<OperationDefinition, 'id'>): void
	(event: 'assign-operations', nodeIds: string[], operationIds: string[]): void
	(event: 'delete-operation', operationId: string): void
	(event: 'add-transition', sourceNodeId: string, targetNodeId: string, operationId: string): void
	(event: 'delete-transition', edgeId: string): void
	(event: 'add-node'): void
	(event: 'delete-node', nodeId: string): void
	(event: 'select-node', nodeId: string): void
	(event: 'select-edge', edgeId: string): void
}>()

const blankTab = ref<'states' | 'operations' | 'transitions'>('states')
const nodeTab = ref<'operations' | 'transitions'>('operations')
const transitionFilter = ref<'all' | 'outgoing' | 'incoming'>('outgoing')
const operationFilter = ref<'all' | 'assigned'>('assigned')
const operationSearch = ref('')
const stateSearch = ref('')
const transitionSearch = ref('')
const isOperationDialogOpen = ref(false)
const isTransitionDialogOpen = ref(false)
const isOperationEditDialogOpen = ref(false)
const operationBeingEdited = ref<OperationDefinition | null>(null)
const showNameTranslations = ref(false)
const nodeLabel = computed({
	get: () => props.node?.data?.label ?? '',
	set: (label: string) => updateNodeProperties({ label }),
})
const nodeIsInitial = computed({
	get: () => props.node?.data?.isInitial ?? false,
	set: (isInitial: boolean) => updateNodeProperties({ isInitial }),
})
const nameTranslations = computed(() => props.node?.data?.nameTranslations ?? {})
const edgeOperationId = computed({
	get: () => props.edge?.data?.operationId ?? null,
	set: (operationId: string | null) => {
		if (props.edge && operationId) {
			emit('update:edge-operation', props.edge.id, operationId)
		}
	},
})

function updateNodeProperties(changes: NodePropertyChanges) {
	if (props.node) emit('update:node-properties', props.node.id, changes)
}
function updateTranslation(code: keyof NameTranslations, value: string | number | null) {
	const translations = { ...nameTranslations.value }
	if (value === null || value === '') delete translations[code]
	else translations[code] = String(value)
	updateNodeProperties({ nameTranslations: translations })
}
const assignedOperationIds = computed(() => props.node?.data?.operationIds ?? [])
const selectedNodeIds = computed(() => props.selectedNodes.map((node) => node.id))
const dialogAssignedOperationIds = computed(() => {
	if (props.selectedNodes.length < 2) return assignedOperationIds.value
	const [firstNode, ...otherNodes] = props.selectedNodes
	return (firstNode?.data?.operationIds ?? []).filter((operationId) =>
		otherNodes.every((node) => node.data?.operationIds?.includes(operationId))
	)
})
const commonOperations = computed(() => {
	if (props.selectedNodes.length < 2) return []
	const [firstNode, ...otherNodes] = props.selectedNodes
	const commonIds = new Set(
		(firstNode?.data?.operationIds ?? []).filter((operationId) =>
			otherNodes.every((node) => node.data?.operationIds?.includes(operationId))
		)
	)
	return props.operations.filter((operation) => commonIds.has(operation.id))
})
const filteredCommonOperations = computed(() => {
	const query = operationSearch.value.trim().toLocaleLowerCase()
	return query
		? commonOperations.value.filter((operation) =>
				operation.name.toLocaleLowerCase().includes(query)
			)
		: commonOperations.value
})
const multiSelectionColumns = [
	{ name: 'name', label: 'Общие операции', field: 'name', align: 'left' as const },
]
const operationTargetNodeIds = computed(() => {
	if (props.selectedNodes.length > 1) return selectedNodeIds.value
	return props.node ? [props.node.id] : []
})
const allowedOperations = computed(() =>
	props.operations.filter((operation) => assignedOperationIds.value.includes(operation.id))
)
const allOperationsAllowed = computed(
	() =>
		props.operations.length > 0 &&
		props.operations.every((operation) => assignedOperationIds.value.includes(operation.id))
)
const someOperationsAllowed = computed(
	() =>
		props.operations.some((operation) => assignedOperationIds.value.includes(operation.id)) &&
		!allOperationsAllowed.value
)
const operationsWithUsage = computed(() =>
	props.operations.map((operation) => ({
		...operation,
		assignedCount: props.nodes.filter((node) => node.data?.operationIds?.includes(operation.id))
			.length,
	}))
)
const filteredGlobalOperations = computed(() => {
	const query = operationSearch.value.trim().toLocaleLowerCase()
	return query
		? operationsWithUsage.value.filter((operation) =>
				operation.name.toLocaleLowerCase().includes(query)
			)
		: operationsWithUsage.value
})
const filteredStates = computed(() => {
	const query = stateSearch.value.trim().toLocaleLowerCase()
	return query
		? props.nodes.filter((node) =>
				(node.data?.label ?? node.id).toLocaleLowerCase().includes(query)
			)
		: props.nodes
})
const filteredOperations = computed(() =>
	props.node && operationFilter.value === 'assigned'
		? operationsWithUsage.value.filter((operation) =>
				assignedOperationIds.value.includes(operation.id)
			)
		: operationsWithUsage.value
)
const visibleTransitions = computed(() =>
	props.edges.filter((edge) => {
		if (!props.node || transitionFilter.value === 'all') return true
		return transitionFilter.value === 'outgoing'
			? edge.source === props.node.id
			: edge.target === props.node.id
	})
)
const transitionColumns = [
	{ name: 'transition', label: 'Переход', field: 'transitionLabel', align: 'left' as const },
	{
		name: 'operation',
		label: 'Операция',
		field: 'operationName',
		align: 'left' as const,
		sortable: true,
	},
	{
		name: 'actions',
		label: '',
		field: 'id',
		align: 'right' as const,
		style: 'width: 1%; white-space: nowrap',
		headerStyle: 'width: 1%',
	},
]
const transitionRows = computed(() => {
	const query = transitionSearch.value.trim().toLocaleLowerCase()
	return visibleTransitions.value
		.map((edge) => ({
			...edge,
			sourceLabel: getNodeLabel(edge.source),
			targetLabel: getNodeLabel(edge.target),
			transitionLabel: `${getNodeLabel(edge.source)} → ${getNodeLabel(edge.target)}`,
			operationName:
				props.operations.find((operation) => operation.id === edge.data?.operationId)?.name ??
				'Операция не найдена',
		}))
		.filter(
			(row) =>
				!query ||
				[row.transitionLabel, row.operationName].some((value) =>
					value.toLocaleLowerCase().includes(query)
				)
		)
})
const operationColumns = computed(() => [
	{
		name: 'name',
		label: 'Название операции',
		field: 'name',
		align: 'left' as const,
		sortable: true,
	},
	{
		name: 'allowed',
		label: props.node ? 'Разрешена' : 'Переходы',
		field: 'assignedCount',
		align: 'center' as const,
		sortable: true,
	},
	{ name: 'actions', label: '', field: 'id', align: 'right' as const },
])
const panelTitle = computed(() =>
	props.selectedNodes.length > 1
		? `Выбрано состояний: ${props.selectedNodes.length}`
		: props.node
			? 'Состояние'
			: props.edge
				? 'Переход'
				: 'Свойства'
)
const selectedEdgeOperation = computed(
	() => props.operations.find((item) => item.id === props.edge?.data?.operationId) ?? null
)
const edgeAllowedOperations = computed(() => {
	const source = props.nodes.find((item) => item.id === props.edge?.source)
	const allowedIds = new Set(source?.data?.operationIds ?? [])
	return props.operations.filter((operation) => allowedIds.has(operation.id))
})
const edgeOperationOptions = computed(() =>
	edgeAllowedOperations.value.map((operation) => ({ label: operation.name, value: operation.id }))
)
const edgeDescription = computed(() =>
	props.edge ? `${getNodeLabel(props.edge.source)} → ${getNodeLabel(props.edge.target)}` : ''
)

function getNodeLabel(id: string) {
	return props.nodes.find((node) => node.id === id)?.data?.label ?? id
}
const setOperationAllowed = (operation: OperationDefinition, allowed: boolean) => {
	if (!props.node) return
	if (allowed) emit('assign-operation', props.node.id, [operation.id])
	else emit('unassign-operation', props.node.id, operation.id)
}
const setOperationAllowedById = (operationId: string, allowed: boolean) => {
	const operation = props.operations.find((item) => item.id === operationId)
	if (operation) setOperationAllowed(operation, allowed)
}
const setAllOperationsAllowed = (allowed: boolean) => {
	if (!props.node) return
	const nodeId = props.node.id
	if (allowed) {
		emit(
			'assign-operations',
			[nodeId],
			props.operations.map((operation) => operation.id)
		)
		return
	}
	props.operations.forEach((operation) => emit('unassign-operation', nodeId, operation.id))
}
const transitionSources = computed(() =>
	props.nodes.map((item) => ({
		id: item.id,
		label: item.data?.label ?? item.id,
		operationIds: item.data?.operationIds ?? [],
	}))
)
const selectNode = (id: string) => emit('select-node', id)
const deleteNode = (id: string) => emit('delete-node', id)
const deleteOperation = (id: string) => emit('delete-operation', id)
const editOperation = (id: string) => {
	operationBeingEdited.value = props.operations.find((operation) => operation.id === id) ?? null
	if (operationBeingEdited.value) isOperationEditDialogOpen.value = true
}
const saveOperation = (id: string, name: string, nameTranslations: NameTranslations) =>
	emit('rename-operation', id, name, nameTranslations)
const unassignOperation = (id: string) => {
	if (props.node) emit('unassign-operation', props.node.id, id)
}
const selectEdge = (id: string) => emit('select-edge', id)
const deleteTransition = (id: string) => emit('delete-transition', id)
const assignOperations = (nodeIds: string[], operationIds: string[]) =>
	emit('assign-operations', nodeIds, operationIds)
const createOperation = (nodeIds: string[], operation: Omit<OperationDefinition, 'id'>) =>
	emit('create-operation', nodeIds, operation)
const openAddTransition = () => {
	isTransitionDialogOpen.value = true
}
const confirmTransition = (sourceNodeId: string, targetNodeId: string, operationId: string) => {
	emit('add-transition', sourceNodeId, targetNodeId, operationId)
}
watch([() => props.node?.id, () => props.edge?.id, () => selectedNodeIds.value.join(',')], () => {
	showNameTranslations.value = false
	isOperationDialogOpen.value = false
	isTransitionDialogOpen.value = false
})
</script>

<template lang="pug">
.properties-panel
	.text-bold.text-center.q-mb-md.text-uppercase {{ panelTitle }}
	q-scroll-area.panel-content
		template(v-if="selectedNodes.length > 1")
			.row.items-center.justify-between.q-mb-xs
				.text-subtitle2 Операции для всех состояний
				q-btn(flat round dense color="primary" icon="mdi-plus-circle" @click="isOperationDialogOpen = true")
			q-input.q-mb-sm(v-model="operationSearch" filled dense clearable placeholder="Фильтр общих операций")
				template(v-slot:prepend="")
					q-icon(name="mdi-magnify" color="primary")
			StateOperationsList(:rows="filteredCommonOperations" :columns="multiSelectionColumns" no-data-label="Нет общих операций")
		template(v-else-if="!node && !edge")
			q-tabs(v-model="blankTab" dense align="left" active-color="primary" indicator-color="primary")
				q-tab(name="states" label="Состояния")
				q-tab(name="operations" label="Операции")
				q-tab(name="transitions" label="Переходы")
			q-tab-panels(v-model="blankTab" animated)
				q-tab-panel(name="states" class="q-pa-sm")
					.row.items-center.justify-between.q-mb-xs
						.text-subtitle2 Все состояния
						q-btn(flat round dense color="primary" icon="mdi-plus-circle" @click="emit('add-node')")
					q-input.q-mb-sm(v-model="stateSearch" filled dense clearable placeholder="Фильтр")
						template(v-slot:prepend="")
							q-icon(name="mdi-magnify" color="primary")
					StateList(:states="filteredStates" :empty-message="stateSearch ? 'Нет состояний по этому названию' : 'Нет состояний.'" @select="selectNode" @delete="deleteNode")
				q-tab-panel(name="operations" class="q-pa-sm")
					.row.items-center.justify-between.q-mb-xs
						.text-subtitle2 Все операции
						q-btn(flat round dense color="primary" icon="mdi-plus-circle" @click="isOperationDialogOpen = true")
					q-input.q-mb-sm(v-model="operationSearch" filled dense clearable placeholder="Фильтр")
						template(v-slot:prepend)
							q-icon(name="mdi-magnify" color="primary")
					StateOperationsList(:rows="filteredGlobalOperations" :columns="operationColumns" no-data-label="Нет операций по этому названию" @edit="editOperation" @delete="deleteOperation")

				q-tab-panel(name="transitions" class="q-pa-sm")
					.row.items-center.justify-between.q-mb-xs
						.text-subtitle2 Все переходы
						q-btn(flat round dense color="primary" icon="mdi-plus-circle" :disable="!nodes.length || !operations.length" @click="isTransitionDialogOpen = true")
					q-input.q-mb-sm(v-model="transitionSearch" filled dense clearable placeholder="Фильтр")
						template(v-slot:prepend="")
							q-icon(name="mdi-magnify" color="primary")
					StateTransitionsList(:rows="transitionRows" :columns="transitionColumns" :no-data-label="transitionSearch ? 'Нет переходов по запросу' : 'Нет переходов'" @select="selectEdge" @delete="deleteTransition")
		template(v-else-if="node")
			label Название
			q-input(v-model="nodeLabel" outlined dense)
					template(v-slot:append="")
						q-btn(flat round dense icon="mdi-translate" color="secondary" type="button" @click="showNameTranslations = !showNameTranslations")
							q-tooltip Переводы названия
			q-checkbox(v-model="nodeIsInitial" label="Исходное состояние" class="q-mt-sm" dense)
			.q-pl-sm.q-mt-md(v-if="showNameTranslations")
				.text-caption.q-mb-xs Локализации
				q-input(v-for="locale in translationLocales" :key="locale.code" :model-value="nameTranslations[locale.code] ?? ''" @update:model-value="updateTranslation(locale.code, $event)" :label="locale.label" outlined dense class="q-mb-sm")
			q-tabs.q-mt-md(v-model="nodeTab" dense align="left" active-color="primary" indicator-color="primary")
				q-tab(name="operations" label="Операции")
				q-tab(name="transitions" label="Переходы")
			q-tab-panels(v-model="nodeTab" animated)
				q-tab-panel(name="operations" class="q-pa-sm")
					.row.items-center.justify-between.q-mb-xs
						.text-subtitle2 Операции редактирования
						q-btn(flat round dense color="primary" icon="mdi-plus-circle" @click="isOperationDialogOpen = true")
					.row.q-gutter-xs.q-mb-sm
						q-chip(:selected="operationFilter === 'assigned'" clickable size="sm" @click="operationFilter = 'assigned'") Разрешённые
						q-chip(:selected="operationFilter === 'all'" clickable size="sm" @click="operationFilter = 'all'") Все
					.row.justify-end(v-if="operationFilter === 'all'")
						q-checkbox.q-mb-sm(:model-value="allOperationsAllowed ? true : someOperationsAllowed ? null : false" :disable="!operations.length" label="Выбрать все" dense @update:model-value="setAllOperationsAllowed(Boolean($event))")
					StateOperationsList(:rows="filteredOperations" :columns="operationColumns" show-allowed no-data-label="Операций нет" @toggle-allowed="setOperationAllowedById" @edit="editOperation" @delete="unassignOperation")
				q-tab-panel(name="transitions" class="q-pa-sm")
					.row.items-center.justify-between.q-mb-xs
						.text-subtitle2 Переходы состояния
						q-btn(flat round dense color="primary" icon="mdi-plus-circle" :disable="!allowedOperations.length || nodes.length < 2" @click="openAddTransition")
					.row.q-gutter-xs.q-mb-sm
						q-chip(:selected="transitionFilter === 'outgoing'" clickable size="sm" @click="transitionFilter = 'outgoing'") Исходящие
						q-chip(:selected="transitionFilter === 'incoming'" clickable size="sm" @click="transitionFilter = 'incoming'") Входящие
						q-chip(:selected="transitionFilter === 'all'" clickable size="sm" @click="transitionFilter = 'all'") Все
					q-input.q-mb-sm(v-model="transitionSearch" filled dense clearable placeholder="Фильтр")
						template(v-slot:prepend="")
							q-icon(name="mdi-magnify" color="primary")
					StateTransitionsList(:rows="transitionRows" :columns="transitionColumns" :no-data-label="transitionSearch ? 'Нет переходов по запросу' : 'Переходов нет'" @select="selectEdge" @delete="deleteTransition")
		template(v-else="")
			.text-subtitle2.q-mb-sm Переход
			.text-caption.q-mb-xs {{ edgeDescription }}
			.operation-field-label Операция
			q-select(v-model="edgeOperationId" :options="edgeOperationOptions" outlined dense emit-value map-options :disable="!edgeAllowedOperations.length" :placeholder="edgeAllowedOperations.length ? 'Выберите операцию' : 'Нет разрешенных операций'")
			.text-caption.text-negative.q-mt-sm(v-if="!selectedEdgeOperation") У перехода не найдена операция.
		StateTransitionsDialog(v-model="isTransitionDialogOpen" :source-node-id="node?.id ?? null" :sources="transitionSources" :operations="node ? allowedOperations : operations" :targets="transitionTargets" @confirm="confirmTransition")
	StateOperationsDialog(v-model="isOperationDialogOpen" :node-ids="operationTargetNodeIds" :operations="operations" :assigned-operation-ids="dialogAssignedOperationIds" @assign-operations="assignOperations" @create-operation="createOperation")
	StateOperationEditDialog(v-model="isOperationEditDialogOpen" :operation="operationBeingEdited" @save="saveOperation")
</template>

<style scoped lang="scss">
.properties-panel {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
}
.panel-content {
	flex: 1 1 0;
	min-height: 0;
}
:deep(.delete-action) {
	opacity: 0;
	pointer-events: none;
}
:deep(.q-item:hover .delete-action),
:deep(.q-item:focus-within .delete-action),
:deep(.q-table tbody tr:hover .delete-action),
:deep(.q-table tbody tr:focus-within .delete-action),
:deep(.delete-action:focus-visible) {
	opacity: 1;
	pointer-events: auto;
}
:deep(.q-tab-panels) {
	background: transparent;
	border-top: 1px solid var(--my-border-color);
}
.q-chip {
	background: white;
}
.q-chip--selected {
	background: $primary;
}
</style>
