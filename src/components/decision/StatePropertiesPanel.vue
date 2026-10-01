<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Edge, Node } from '@vue-flow/core'
import { translationLocales, type NameTranslations } from '@/constants/locales'
import type { OperationDefinition } from '@/components/decision/operationTypes'
import StateOperationsDialog from '@/components/decision/StateOperationsDialog.vue'
import StateTransitionsDialog from '@/components/decision/StateTransitionsDialog.vue'

type StateNode = Pick<
	Node<{
		label?: string
		nameTranslations?: NameTranslations
		operationIds?: string[]
		isInitial?: boolean
	}>,
	'id' | 'data'
>
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
	(event: 'rename-operation', operationId: string, name: string): void
	(event: 'assign-operation', id: string, operationIds: string[]): void
	(event: 'unassign-operation', id: string, operationId: string): void
	(event: 'create-operation', id: string | null, operation: Omit<OperationDefinition, 'id'>): void
	(event: 'delete-operation', operationId: string): void
	(event: 'set-operation-transition', operationId: string, targetNodeId: string | null): void
	(event: 'add-node'): void
	(event: 'delete-node', nodeId: string): void
	(event: 'select-node', nodeId: string): void
	(event: 'select-edge', edgeId: string): void
}>()

const draftLabel = ref('')
const draftEdgeLabel = ref('')
const draftTranslations = ref<NameTranslations>({})
const draftIsInitial = ref(false)
const showNameTranslations = ref(false)
const operationFilter = ref<'all' | 'assigned' | 'transitions'>('all')
const isOperationDialogOpen = ref(false)
const isTransitionDialogOpen = ref(false)
const pendingTransitionOperationId = ref<string | null>(null)
const operationDialogNodeId = computed(() => props.node?.id ?? null)
const assignedOperationIds = computed(() => props.node?.data?.operationIds ?? [])
const panelTitle = computed(() => (props.node ? 'Состояние' : props.edge ? 'Переход' : 'Свойства'))
const savedTranslations = computed(() => props.node?.data?.nameTranslations ?? {})
const selectedEdgeOperation = computed(
	() => props.operations.find((operation) => operation.id === props.edge?.data?.operationId) ?? null
)

const operationsWithUsage = computed(() =>
	props.operations.map((operation) => ({
		...operation,
		assignedCount: props.nodes.filter((node) => node.data?.operationIds?.includes(operation.id))
			.length,
	}))
)
const filteredOperations = computed(() => {
	if (operationFilter.value === 'assigned' && props.node) {
		return operationsWithUsage.value.filter((operation) =>
			assignedOperationIds.value.includes(operation.id)
		)
	}
	if (operationFilter.value === 'transitions') {
		return operationsWithUsage.value.filter((operation) => operation.isTransition)
	}
	return operationsWithUsage.value
})
const operationColumns = computed(() => [
	{ name: 'name', label: 'Название', field: 'name', align: 'left' as const },
	{
		name: 'allowed',
		label: props.node ? 'Разрешена' : 'Состояний',
		field: 'assignedCount',
		align: 'center' as const,
	},
	{ name: 'transition', label: 'Переход', field: 'isTransition', align: 'center' as const },
	{ name: 'actions', label: '', field: 'id', align: 'right' as const },
])

const getTargetLabel = (targetNodeId?: string) =>
	props.transitionTargets.find((target) => target.id === targetNodeId)?.label ?? 'Цель не выбрана'
const getNodeLabel = (nodeId: string) =>
	props.nodes.find((item) => item.id === nodeId)?.data?.label ?? nodeId

const setOperationAllowed = (operation: OperationDefinition, allowed: boolean) => {
	if (!props.node) return
	if (allowed) emit('assign-operation', props.node.id, [operation.id])
	else emit('unassign-operation', props.node.id, operation.id)
}

const removeOperationRow = (operationId: string) => {
	if (props.node) emit('unassign-operation', props.node.id, operationId)
	else emit('delete-operation', operationId)
}

const setTransitionFlag = (operation: OperationDefinition, enabled: boolean) => {
	if (!enabled) {
		emit('set-operation-transition', operation.id, null)
		return
	}
	pendingTransitionOperationId.value = operation.id
	isTransitionDialogOpen.value = true
}

const confirmTransitionTarget = (targetNodeId: string) => {
	if (!pendingTransitionOperationId.value) return
	emit('set-operation-transition', pendingTransitionOperationId.value, targetNodeId)
	pendingTransitionOperationId.value = null
}

const selectedEdgeSourceLabel = computed(() =>
	props.edge ? `${getNodeLabel(props.edge.source)} → ${getNodeLabel(props.edge.target)}` : ''
)

const collectTranslations = (translations: NameTranslations): NameTranslations =>
	Object.fromEntries(
		translationLocales
			.map(({ code }) => [code, translations[code]?.trim() ?? ''] as const)
			.filter(([, value]) => value.length > 0)
	) as NameTranslations

const hasChanges = computed(() => {
	if (props.node) {
		return (
			draftLabel.value !== (props.node.data?.label ?? '') ||
			translationLocales.some(
				({ code }) =>
					(draftTranslations.value[code] ?? '') !== (savedTranslations.value[code] ?? '')
			) ||
			draftIsInitial.value !== (props.node.data?.isInitial ?? false)
		)
	}
	return Boolean(
		props.edge &&
		selectedEdgeOperation.value &&
		draftEdgeLabel.value.trim().length > 0 &&
		draftEdgeLabel.value.trim() !== selectedEdgeOperation.value.name
	)
})

const save = () => {
	if (!hasChanges.value) return
	if (props.node) {
		emit(
			'save:node-properties',
			props.node.id,
			draftLabel.value,
			collectTranslations(draftTranslations.value),
			draftIsInitial.value
		)
	} else if (props.edge && selectedEdgeOperation.value) {
		emit('rename-operation', selectedEdgeOperation.value.id, draftEdgeLabel.value.trim())
	}
}

watch(
	[
		() => props.node?.id,
		() => props.node?.data?.label,
		() => props.node?.data?.nameTranslations,
		() => props.node?.data?.isInitial,
	],
	([, label, translations, isInitial]) => {
		draftLabel.value = label ?? ''
		draftTranslations.value = { ...(translations ?? {}) }
		draftIsInitial.value = isInitial ?? false
	},
	{ immediate: true }
)

watch(
	[() => props.edge?.id, () => selectedEdgeOperation.value?.name],
	([, name]) => {
		draftEdgeLabel.value = name ?? (typeof props.edge?.label === 'string' ? props.edge.label : '')
	},
	{ immediate: true }
)

watch([() => props.node?.id, () => props.edge?.id], () => {
	showNameTranslations.value = false
	isOperationDialogOpen.value = false
	isTransitionDialogOpen.value = false
	pendingTransitionOperationId.value = null
})
</script>

<template lang="pug">
.properties-panel
	.text-bold.text-center.q-mb-md.text-uppercase {{ panelTitle }}
	.panel-content
		template(v-if="!node && !edge")
			.row.items-center.justify-between.q-mb-xs
				.text-subtitle2 Состояния
				q-btn(flat round dense color="primary" icon="mdi-plus-circle" aria-label="Добавить состояние" @click="emit('add-node')")
			q-list.operation-list(separator bordered)
				q-item(v-for="item in nodes" :key="item.id" clickable dense @click="emit('select-node', item.id)")
					q-item-section
						q-item-label {{ item.data?.label ?? item.id }}
					q-item-section(side)
						q-btn.delete-action(flat round dense size='sm' color="secondary" icon="mdi-close" aria-label="Удалить состояние" @click.stop="emit('delete-node', item.id)")
				.text-body2.text-grey-7.q-pa-sm(v-if="!nodes.length") Нет состояний.
			.row.items-center.justify-between.q-mt-md.q-mb-xs
				.text-subtitle2 Доступные операции
				q-btn(flat round dense color="primary" icon="mdi-plus-circle" aria-label="Добавить операцию" @click="isOperationDialogOpen = true")
			q-table.operation-table(
				:rows="operationsWithUsage"
				:columns="operationColumns"
				row-key="id"
				flat
				dense
				bordered
				hide-bottom
				:pagination="{ rowsPerPage: 0 }"
				no-data-label="Нет доступных операций"
			)
				template(v-slot:body-cell-name="slotProps")
					q-td(:props="slotProps")
						.operation-name {{ slotProps.row.name }}
						.operation-target(v-if="slotProps.row.isTransition") → {{ getTargetLabel(slotProps.row.targetNodeId) }}
				template(v-slot:body-cell-allowed="slotProps")
					q-td(:props="slotProps") {{ slotProps.row.assignedCount }}
				template(v-slot:body-cell-transition="slotProps")
					q-td(:props="slotProps")
						q-checkbox(:model-value="Boolean(slotProps.row.isTransition)" dense @update:model-value="setTransitionFlag(slotProps.row, Boolean($event))")
				template(v-slot:body-cell-actions="slotProps")
					q-td(:props="slotProps")
						q-btn.delete-action(flat round dense size='sm' color="secondary" icon="mdi-close" :aria-label="node ? 'Убрать операцию из состояния' : 'Удалить операцию'" @click="removeOperationRow(slotProps.row.id)")
			StateOperationsDialog(
				v-model="isOperationDialogOpen"
				:node-id="operationDialogNodeId"
				:operations="operations"
				:assigned-operation-ids="assignedOperationIds"
				@assign-operations="(id, ids) => emit('assign-operation', id, ids)"
				@create-operation="(id, operation) => emit('create-operation', id, operation)"
			)
		template(v-else-if="node")
			label Название
			q-input(v-model="draftLabel" outlined dense)
				template(v-slot:append)
					q-btn(flat round dense icon="mdi-translate" color="secondary" type="button" aria-label="Переводы названия" @click="showNameTranslations = !showNameTranslations")
						q-tooltip Переводы названия
			q-checkbox(v-model="draftIsInitial" label="Исходное состояние" class="q-mt-sm" dense)
			.q-pl-sm.q-mt-md(v-if="showNameTranslations")
				.text-caption.q-mb-xs Локализации
				q-input(v-for="locale in translationLocales" :key="locale.code" v-model="draftTranslations[locale.code]" :label="locale.label" outlined dense class="q-mb-sm")
			.row.items-center.justify-between.q-mt-md.q-mb-xs
				.text-subtitle2 Операции состояния
				q-btn(flat round dense color="primary" icon="mdi-plus-circle" aria-label="Добавить операцию" @click="isOperationDialogOpen = true")
			.row.q-gutter-xs.q-mb-sm
				q-chip(:selected="operationFilter === 'all'" clickable size="sm" @click="operationFilter = 'all'") Все
				q-chip(:selected="operationFilter === 'assigned'" clickable size="sm" @click="operationFilter = 'assigned'") Разрешённые
				q-chip(:selected="operationFilter === 'transitions'" clickable size="sm" @click="operationFilter = 'transitions'") Переходы
			q-table.operation-table(
				:rows="filteredOperations"
				:columns="operationColumns"
				row-key="id"
				flat
				dense
				bordered
				hide-bottom
				:pagination="{ rowsPerPage: 0 }"
				no-data-label="Операций нет"
			)
				template(v-slot:body-cell-name="slotProps")
					q-td(:props="slotProps")
						.operation-name {{ slotProps.row.name }}
						.operation-target(v-if="slotProps.row.isTransition") → {{ getTargetLabel(slotProps.row.targetNodeId) }}
				template(v-slot:body-cell-allowed="slotProps")
					q-td(:props="slotProps")
						q-checkbox(:model-value="assignedOperationIds.includes(slotProps.row.id)" dense @update:model-value="setOperationAllowed(slotProps.row, Boolean($event))")
				template(v-slot:body-cell-transition="slotProps")
					q-td(:props="slotProps")
						q-checkbox(:model-value="Boolean(slotProps.row.isTransition)" dense @update:model-value="setTransitionFlag(slotProps.row, Boolean($event))")
				template(v-slot:body-cell-actions="slotProps")
					q-td(:props="slotProps")
						q-btn.delete-action(flat round dense size='sm' color="secondary" icon="mdi-close" aria-label="Убрать операцию из состояния" @click="removeOperationRow(slotProps.row.id)")
			StateOperationsDialog(
				v-model="isOperationDialogOpen"
				:node-id="node.id"
				:operations="operations"
				:assigned-operation-ids="assignedOperationIds"
				@assign-operations="(id, ids) => emit('assign-operation', id, ids)"
				@create-operation="(id, operation) => emit('create-operation', id, operation)"
			)
		template(v-else)
			.text-subtitle2.q-mb-sm Связь
			label Название связи
			q-input(v-model="draftEdgeLabel" outlined dense)
			.text-caption.text-grey-7.q-mt-sm Название связи совпадает с названием операции.
			.text-caption.q-mt-xs {{ selectedEdgeSourceLabel }}
			.text-caption.text-negative.q-mt-sm(v-if="!selectedEdgeOperation") У связи не найдена операция.
		StateTransitionsDialog(
			v-model="isTransitionDialogOpen"
			:operation-name="operations.find((operation) => operation.id === pendingTransitionOperationId)?.name ?? ''"
			:targets="transitionTargets"
			@confirm="confirmTransitionTarget"
		)
	q-btn(v-if="node || edge" class="save-button" label="Сохранить" color="primary" unelevated :disable="!hasChanges" @click="save")
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
	overflow-y: auto;
}
.save-button {
	flex-shrink: 0;
	margin-top: auto;
}
.operation-list {
	border-color: var(--my-border-color);
	border-radius: 0.35rem;
	background: var(--bgLight);
	font-size: 0.8rem;
}
.operation-table {
	border-color: var(--my-border-color);
	border-radius: 0.35rem;
	background: var(--bgLight);
	font-size: 0.78rem;
}
.operation-name {
	display: block;
}
.operation-target {
	display: block;
	color: var(--q-secondary);
	font-size: 0.7rem;
}
:deep(.q-table th),
:deep(.q-table td) {
	padding: 0.25rem 0.35rem;
}
:deep(.delete-action) {
	opacity: 0;
	pointer-events: none;
	// transition: opacity 120ms ease;
}
:deep(.q-item:hover .delete-action),
:deep(.q-item:focus-within .delete-action),
:deep(.q-table tbody tr:hover .delete-action),
:deep(.q-table tbody tr:focus-within .delete-action),
:deep(.delete-action:focus-visible) {
	opacity: 1;
	pointer-events: auto;
}
</style>
