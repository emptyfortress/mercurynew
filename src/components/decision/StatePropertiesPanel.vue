<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Edge, Node } from '@vue-flow/core'
import { translationLocales, type NameTranslations } from '@/constants/locales'
import type { OperationDefinition } from '@/components/decision/operationTypes'
import StateOperationsDialog from '@/components/decision/StateOperationsDialog.vue'
import StateTransitionsDialog from '@/components/decision/StateTransitionsDialog.vue'

type NodeData = {
	label?: string
	nameTranslations?: NameTranslations
	operationIds?: string[]
	isInitial?: boolean
}
type StateNode = Pick<Node<NodeData>, 'id' | 'data'>
type StateEdge = Pick<Edge<{ operationId: string }>, 'id' | 'label' | 'source' | 'target' | 'data'>
type TransitionTarget = { id: string; label: string }

const props = defineProps<{
	node: StateNode | null
	edge: StateEdge | null
	nodes: StateNode[]
	edges: StateEdge[]
	operations: OperationDefinition[]
	transitionTargets: TransitionTarget[]
}>()
const emit = defineEmits<{
	(
		event: 'save:node-properties',
		id: string,
		label: string,
		translations: NameTranslations,
		isInitial: boolean
	): void
	(event: 'save:edge-operation', edgeId: string, operationId: string): void
	(event: 'rename-operation', operationId: string, name: string): void
	(event: 'assign-operation', id: string, operationIds: string[]): void
	(event: 'unassign-operation', id: string, operationId: string): void
	(event: 'create-operation', id: string | null, operation: Omit<OperationDefinition, 'id'>): void
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
const draftLabel = ref('')
const draftTranslations = ref<NameTranslations>({})
const draftIsInitial = ref(false)
const draftEdgeOperationId = ref<string | null>(null)
const showNameTranslations = ref(false)
const savedTranslations = computed(() => props.node?.data?.nameTranslations ?? {})
const assignedOperationIds = computed(() => props.node?.data?.operationIds ?? [])
const allowedOperations = computed(() =>
	props.operations.filter((operation) => assignedOperationIds.value.includes(operation.id))
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
		label: props.node ? 'Разрешена' : 'Используется',
		field: 'assignedCount',
		align: 'center' as const,
		sortable: true,
	},
	{ name: 'actions', label: '', field: 'id', align: 'right' as const },
])
const panelTitle = computed(() => (props.node ? 'Состояние' : props.edge ? 'Переход' : 'Свойства'))
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
const collectTranslations = (translations: NameTranslations): NameTranslations =>
	Object.fromEntries(
		translationLocales
			.map(({ code }) => [code, translations[code]?.trim() ?? ''] as const)
			.filter(([, value]) => value.length > 0)
	) as NameTranslations
const hasNodeChanges = computed(() =>
	Boolean(
		props.node &&
		(draftLabel.value !== (props.node.data?.label ?? '') ||
			translationLocales.some(
				({ code }) =>
					(draftTranslations.value[code] ?? '') !== (savedTranslations.value[code] ?? '')
			) ||
			draftIsInitial.value !== (props.node.data?.isInitial ?? false))
	)
)
const hasEdgeChanges = computed(() =>
	Boolean(props.edge && draftEdgeOperationId.value !== (props.edge.data?.operationId ?? null))
)
const hasChanges = computed(() => hasNodeChanges.value || hasEdgeChanges.value)
const saveChanges = () => {
	if (props.node && hasNodeChanges.value) {
		emit(
			'save:node-properties',
			props.node.id,
			draftLabel.value,
			collectTranslations(draftTranslations.value),
			draftIsInitial.value
		)
	} else if (
		props.edge &&
		draftEdgeOperationId.value &&
		edgeAllowedOperations.value.some((operation) => operation.id === draftEdgeOperationId.value) &&
		hasEdgeChanges.value
	) {
		emit('save:edge-operation', props.edge.id, draftEdgeOperationId.value)
	}
}
const openAddTransition = () => {
	isTransitionDialogOpen.value = true
}
const confirmTransition = (sourceNodeId: string, targetNodeId: string, operationId: string) => {
	emit('add-transition', sourceNodeId, targetNodeId, operationId)
}
watch(
	() => [
		props.node?.id,
		props.node?.data?.label,
		props.node?.data?.nameTranslations,
		props.node?.data?.isInitial,
	],
	([, label, translations, isInitial]) => {
		draftLabel.value = (label as string | undefined) ?? ''
		draftTranslations.value = { ...((translations as NameTranslations | undefined) ?? {}) }
		draftIsInitial.value = (isInitial as boolean | undefined) ?? false
	},
	{ immediate: true }
)
watch(
	[() => props.edge?.id, () => props.edge?.data?.operationId],
	([, operationId]) => {
		draftEdgeOperationId.value = (operationId as string | undefined) ?? null
	},
	{ immediate: true }
)
watch([() => props.node?.id, () => props.edge?.id], () => {
	showNameTranslations.value = false
	isOperationDialogOpen.value = false
	isTransitionDialogOpen.value = false
})
</script>

<template lang="pug">
.properties-panel
	.text-bold.text-center.q-mb-md.text-uppercase {{ panelTitle }}
	q-scroll-area.panel-content
		template(v-if="!node && !edge")
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
						template(v-slot:prepend)
							q-icon(name="mdi-magnify" color="primary")
					q-list.operation-list(separator bordered)
						q-item(v-for="item in filteredStates" :key="item.id" clickable dense @click="emit('select-node', item.id)")
							q-item-section {{ item.data?.label ?? item.id }}
							q-item-section(side)
								q-btn.delete-action(flat round dense size="sm" color="secondary" icon="mdi-close" @click.stop="emit('delete-node', item.id)")
						.text-body2.text-grey-7.q-pa-sm(v-if="!filteredStates.length") {{ stateSearch ? 'Нет состояний по этому названию' : 'Нет состояний.' }}
				q-tab-panel(name="operations" class="q-pa-sm")
					.row.items-center.justify-between.q-mb-xs
						.text-subtitle2 Все операции
						q-btn(flat round dense color="primary" icon="mdi-plus-circle" @click="isOperationDialogOpen = true")
					q-input.q-mb-sm(v-model="operationSearch" filled dense clearable placeholder="Фильтр")
						template(v-slot:prepend)
							q-icon(name="mdi-magnify" color="primary")

					q-table.operation-table.operations-table(:rows="filteredGlobalOperations" :columns="operationColumns" row-key="id" flat dense bordered hide-bottom :pagination="{ rowsPerPage: 0 }" no-data-label="Нет операций по этому названию")
						template(v-slot:body-cell-actions="slotProps")
							q-td(:props="slotProps")
								q-btn.delete-action(flat round dense size="sm" color="secondary" icon="mdi-close" @click="emit('delete-operation', slotProps.row.id)")
				q-tab-panel(name="transitions" class="q-pa-sm")
					.row.items-center.justify-between.q-mb-xs
						.text-subtitle2 Все переходы
						q-btn(flat round dense color="primary" icon="mdi-plus-circle" :disable="!nodes.length || !operations.length" @click="isTransitionDialogOpen = true")
					q-input.q-mb-sm(v-model="transitionSearch" filled dense clearable placeholder="Фильтр")
						template(v-slot:prepend)
							q-icon(name="mdi-magnify" color="primary")
					q-table.operation-table(:rows="transitionRows" :columns="transitionColumns" row-key="id" flat dense bordered hide-bottom :pagination="{ rowsPerPage: 0 }" :no-data-label="transitionSearch ? 'Нет переходов по запросу' : 'Нет переходов'" @row-click="(_, row) => emit('select-edge', row.id)")
						template(v-slot:body-cell-transition="slotProps")
							q-td(:props="slotProps")
								span {{ slotProps.row.transitionLabel }}
						template(v-slot:body-cell-operation="slotProps")
							q-td(:props="slotProps") {{ slotProps.row.operationName }}
						template(v-slot:body-cell-actions="slotProps")
							q-td(:props="slotProps")
								.row.no-wrap
									q-btn.delete-action(flat round dense size="sm" color="secondary" icon="mdi-close" @click.stop="emit('delete-transition', slotProps.row.id)")
		template(v-else-if="node")
			label Название
			q-input(v-model="draftLabel" outlined dense)
				template(v-slot:append)
					q-btn(flat round dense icon="mdi-translate" color="secondary" type="button" @click="showNameTranslations = !showNameTranslations")
						q-tooltip Переводы названия
			q-checkbox(v-model="draftIsInitial" label="Исходное состояние" class="q-mt-sm" dense)
			.q-pl-sm.q-mt-md(v-if="showNameTranslations")
				.text-caption.q-mb-xs Локализации
				q-input(v-for="locale in translationLocales" :key="locale.code" v-model="draftTranslations[locale.code]" :label="locale.label" outlined dense class="q-mb-sm")
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
					q-table.operation-table.operations-table(:rows="filteredOperations" :columns="operationColumns" row-key="id" flat dense bordered hide-bottom :pagination="{ rowsPerPage: 0 }" no-data-label="Операций нет")
						template(v-slot:body-cell-allowed="slotProps")
							q-td(:props="slotProps")
								q-checkbox(:model-value="assignedOperationIds.includes(slotProps.row.id)" dense @update:model-value="setOperationAllowed(slotProps.row, Boolean($event))")
						template(v-slot:body-cell-actions="slotProps")
							q-td(:props="slotProps")
								q-btn.delete-action(flat round dense size="sm" color="secondary" icon="mdi-close" @click="emit('unassign-operation', node.id, slotProps.row.id)")
				q-tab-panel(name="transitions" class="q-pa-sm")
					.row.items-center.justify-between.q-mb-xs
						.text-subtitle2 Переходы состояния
						q-btn(flat round dense color="primary" icon="mdi-plus-circle" :disable="!allowedOperations.length || nodes.length < 2" @click="openAddTransition")
					.row.q-gutter-xs.q-mb-sm
						q-chip(:selected="transitionFilter === 'outgoing'" clickable size="sm" @click="transitionFilter = 'outgoing'") Исходящие
						q-chip(:selected="transitionFilter === 'incoming'" clickable size="sm" @click="transitionFilter = 'incoming'") Входящие
						q-chip(:selected="transitionFilter === 'all'" clickable size="sm" @click="transitionFilter = 'all'") Все
					q-input.q-mb-sm(v-model="transitionSearch" filled dense clearable placeholder="Фильтр")
						template(v-slot:prepend)
							q-icon(name="mdi-magnify" color="primary")
					q-table.operation-table(:rows="transitionRows" :columns="transitionColumns" row-key="id" flat dense bordered hide-bottom :pagination="{ rowsPerPage: 0 }" :no-data-label="transitionSearch ? 'Нет переходов по запросу' : 'Переходов нет'" @row-click="(_, row) => emit('select-edge', row.id)")
						template(v-slot:body-cell-transition="slotProps")
							q-td(:props="slotProps")
								span {{ slotProps.row.transitionLabel }}
						template(v-slot:body-cell-operation="slotProps")
							q-td(:props="slotProps") {{ slotProps.row.operationName }}
						template(v-slot:body-cell-actions="slotProps")
							q-td(:props="slotProps")
								.row.no-wrap
									q-btn.delete-action(flat round dense size="sm" color="secondary" icon="mdi-close" @click.stop="emit('delete-transition', slotProps.row.id)")
			StateOperationsDialog(v-model="isOperationDialogOpen" :node-id="node.id" :operations="operations" :assigned-operation-ids="assignedOperationIds" @assign-operations="(id, ids) => emit('assign-operation', id, ids)" @create-operation="(id, operation) => emit('create-operation', id, operation)")
		template(v-else="")
			.text-subtitle2.q-mb-sm Переход
			.text-caption.q-mb-xs {{ edgeDescription }}
			.operation-field-label Операция
			q-select(v-model="draftEdgeOperationId" :options="edgeOperationOptions" outlined dense emit-value map-options :disable="!edgeAllowedOperations.length" :placeholder="edgeAllowedOperations.length ? 'Выберите операцию' : 'Нет разрешенных операций'")
			.text-caption.text-negative.q-mt-sm(v-if="!selectedEdgeOperation") У перехода не найдена операция.
		StateOperationsDialog(v-if="!node" v-model="isOperationDialogOpen" :node-id="null" :operations="operations" :assigned-operation-ids="[]" @create-operation="(id, operation) => emit('create-operation', id, operation)")
		StateTransitionsDialog(v-model="isTransitionDialogOpen" :source-node-id="node?.id ?? null" :sources="nodes.map((item) => ({ id: item.id, label: item.data?.label ?? item.id, operationIds: item.data?.operationIds ?? [] }))" :operations="node ? allowedOperations : operations" :targets="transitionTargets" @confirm="confirmTransition")
	q-btn(v-if="node || edge" class="save-button" label="Сохранить" color="primary" unelevated :disable="!hasChanges" @click="saveChanges")
</template>

<style scoped lang="scss">
.properties-panel {
	display: flex;
	flex-direction: column;
	height: 100%;
}
.panel-content {
	flex: 1;
	min-height: 0;
}
.save-button {
	flex-shrink: 0;
	margin-top: auto;
}
.operation-list,
.operation-table {
	border-color: var(--my-border-color);
	border-radius: 0.35rem;
	background: var(--bgLight);
	font-size: 0.78rem;
}
:deep(.q-table th),
:deep(.q-table td) {
	padding: 0.25rem 0.35rem;
}
:deep(.operations-table .q-table td) {
	white-space: normal;
	overflow-wrap: anywhere;
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
