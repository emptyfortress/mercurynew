<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Edge, Node } from '@vue-flow/core'
import { translationLocales, type NameTranslations } from '@/constants/locales'
import StateOperationsDialog from '@/components/decision/StateOperationsDialog.vue'
import type { OperationDefinition } from '@/components/decision/operationTypes'
import StateTransitionsDialog from '@/components/decision/StateTransitionsDialog.vue'
import type {
	StateTransitionItem,
	TransitionDefinition,
	TransitionTarget,
} from '@/components/decision/transitionTypes'

export type { OperationDefinition } from '@/components/decision/operationTypes'

type StateNode = Pick<
	Node<{
		label?: string
		nameTranslations?: NameTranslations
		operationIds?: string[]
		isInitial?: boolean
	}>,
	'id' | 'data'
>
type StateEdge = Pick<
	Edge<{ nameTranslations?: NameTranslations }>,
	'id' | 'label' | 'source' | 'target' | 'data'
>

const props = defineProps<{
	node: StateNode | null
	edge: StateEdge | null
	nodes: StateNode[]
	edges: StateEdge[]
	operations: OperationDefinition[]
	transitions: TransitionDefinition[]
	transitionTargets: TransitionTarget[]
	outgoingTransitions: StateTransitionItem[]
}>()

const emit = defineEmits<{
	(
		event: 'save:node-properties',
		id: string,
		label: string,
		translations: NameTranslations,
		isInitial: boolean
	): void
	(event: 'save:edge-label', id: string, label: string, translations: NameTranslations): void
	(event: 'assign-operations', id: string, operationIds: string[]): void
	(event: 'remove-operation', id: string, operationId: string): void
	(event: 'create-operation', id: string, operation: Omit<OperationDefinition, 'id'>): void
	(event: 'assign-transitions', id: string, transitionIds: string[]): void
	(event: 'create-transition', id: string, transition: Omit<TransitionDefinition, 'id'>): void
	(event: 'remove-transition', edgeId: string): void
	(event: 'set-default-transition', edgeId: string, isDefault: boolean): void
	(event: 'select-node', nodeId: string): void
	(event: 'select-edge', edgeId: string): void
}>()

const draftLabel = ref('')
const draftTranslations = ref<NameTranslations>({})
const draftIsInitial = ref(false)
const showNameTranslations = ref(false)
const activeNodeTab = ref('operations')
const isOperationDialogOpen = ref(false)
const isTransitionDialogOpen = ref(false)
const panelTitle = computed(() => (props.node ? 'Состояние' : props.edge ? 'Переход' : 'Свойства'))
const assignedOperations = computed(() => {
	const assignedIds = props.node?.data?.operationIds ?? []
	return assignedIds
		.map((id) => props.operations.find((operation) => operation.id === id))
		.filter((operation): operation is OperationDefinition => Boolean(operation))
})
const openOperationDialog = () => {
	isOperationDialogOpen.value = true
}

const openTransitionDialog = () => {
	isTransitionDialogOpen.value = true
}

const assignedTransitionIds = computed(() => {
	const assignedIds = new Set(
		props.outgoingTransitions
			.map((transition) => transition.transitionDefinitionId)
			.filter((id): id is string => Boolean(id))
	)
	const assignedTargetIds = new Set(
		props.outgoingTransitions.map((transition) => transition.targetNodeId)
	)

	return props.transitions
		.filter(
			(transition) =>
				assignedIds.has(transition.id) || assignedTargetIds.has(transition.targetNodeId)
		)
		.map((transition) => transition.id)
})

const availableTransitionTargets = computed(() => {
	const assignedTargetIds = new Set(
		props.outgoingTransitions.map((transition) => transition.targetNodeId)
	)
	return props.transitionTargets.filter(
		(target) => target.id !== props.node?.id && !assignedTargetIds.has(target.id)
	)
})

const forwardAssignedOperations = (id: string, operationIds: string[]) =>
	emit('assign-operations', id, operationIds)

const forwardCreatedOperation = (id: string, operation: Omit<OperationDefinition, 'id'>) =>
	emit('create-operation', id, operation)

const forwardAssignedTransitions = (id: string, transitionIds: string[]) =>
	emit('assign-transitions', id, transitionIds)

const forwardCreatedTransition = (id: string, transition: Omit<TransitionDefinition, 'id'>) =>
	emit('create-transition', id, transition)

const updateDefaultTransition = (edgeId: string, isDefault: boolean | null) =>
	emit('set-default-transition', edgeId, Boolean(isDefault))

const getNodeLabel = (nodeId: string) =>
	props.nodes.find((node) => node.id === nodeId)?.data?.label ?? nodeId

const getEdgeLabel = (edge: StateEdge) =>
	typeof edge.label === 'string' && edge.label.trim()
		? edge.label
		: `${getNodeLabel(edge.source)} → ${getNodeLabel(edge.target)}`

watch(
	[
		() => props.node?.id,
		() => props.node?.data?.label,
		() => props.node?.data?.nameTranslations,
		() => props.node?.data?.isInitial,
		() => props.edge?.id,
		() => props.edge?.label,
		() => props.edge?.data?.nameTranslations,
	],
	([, nodeLabel, nodeTranslations, nodeIsInitial, , edgeLabel, edgeTranslations]) => {
		draftLabel.value = props.node
			? (nodeLabel ?? '')
			: typeof edgeLabel === 'string'
				? edgeLabel
				: ''
		draftTranslations.value = {
			...(props.node ? nodeTranslations : edgeTranslations),
		}
		draftIsInitial.value = props.node ? (nodeIsInitial ?? false) : false
	},
	{ immediate: true }
)

watch([() => props.node?.id, () => props.edge?.id], () => {
	showNameTranslations.value = false
	isOperationDialogOpen.value = false
	isTransitionDialogOpen.value = false
})

const savedTranslations = computed(
	() => props.node?.data?.nameTranslations ?? props.edge?.data?.nameTranslations ?? {}
)

const hasChanges = computed(() => {
	const labelChanged = props.node
		? draftLabel.value !== (props.node.data?.label ?? '')
		: props.edge
			? draftLabel.value !== (typeof props.edge.label === 'string' ? props.edge.label : '')
			: false
	const translationsChanged = translationLocales.some(
		({ code }) => (draftTranslations.value[code] ?? '') !== (savedTranslations.value[code] ?? '')
	)
	const initialStateChanged = props.node
		? draftIsInitial.value !== (props.node.data?.isInitial ?? false)
		: false

	return labelChanged || translationsChanged || initialStateChanged
})

const save = () => {
	if (!hasChanges.value) return
	const translations = Object.fromEntries(
		translationLocales
			.map(({ code }) => [code, draftTranslations.value[code]?.trim() ?? ''] as const)
			.filter(([, value]) => value.length > 0)
	) as NameTranslations

	if (props.node) {
		emit(
			'save:node-properties',
			props.node.id,
			draftLabel.value,
			translations,
			draftIsInitial.value
		)
	} else if (props.edge) emit('save:edge-label', props.edge.id, draftLabel.value, translations)
}
</script>

<template lang="pug">
.properties-panel
	.text-bold.text-center.q-mb-md.text-uppercase {{ panelTitle }}
	.panel-content
		template(v-if="!node && !edge")
			.text-subtitle2.q-mb-xs Состояния
			q-list.operation-list(separator bordered)
				q-item(v-for="item in nodes" :key="item.id" clickable dense @click="emit('select-node', item.id)")
					q-item-section
						q-item-label {{ item.data?.label ?? item.id }}
				.text-body2.text-grey-7.q-pa-sm(v-if="!nodes.length") Нет состояний.
			.text-subtitle2.q-mt-md.q-mb-xs Переходы
			q-list.operation-list(separator bordered)
				q-item(v-for="item in edges" :key="item.id" clickable dense @click="emit('select-edge', item.id)")
					q-item-section
						q-item-label {{ getEdgeLabel(item) }}
						q-item-label(caption) {{ getNodeLabel(item.source) }} → {{ getNodeLabel(item.target) }}
				.text-body2.text-grey-7.q-pa-sm(v-if="!edges.length") Нет связей.
		template(v-else)
			label Название
			q-input(
				v-model="draftLabel"
				outlined
				dense
			)
				template(v-slot:append)
					q-btn(
						flat
						round
						dense
						icon="mdi-translate"
						color="secondary"
						type="button"
						aria-label="Переводы названия"
						@click="showNameTranslations = !showNameTranslations"
					)
						q-tooltip Переводы названия
			q-checkbox(
				v-if="node"
				v-model="draftIsInitial"
				label="Исходное состояние"
				class="q-mt-sm"
				dense
			)
			.q-pl-sm.q-mt-md(v-if="showNameTranslations")
				.text-caption.q-mb-xs Локализации
				q-input(
					v-for="locale in translationLocales"
					:key="locale.code"
					v-model="draftTranslations[locale.code]"
					:label="locale.label"
					outlined
					dense
					class="q-mb-sm"
				)
			q-tabs(
				v-if="node"
				v-model="activeNodeTab"
				dense
				align="left"
				class="q-mt-md"
				indicator-color="primary"
				active-color="primary"
			)
				q-tab(name="operations" label="Операции")
				q-tab(name="transitions" label="Переходы")
			q-tab-panels(v-if="node" v-model="activeNodeTab" animated)
				q-tab-panel(name="operations")
					.row.items-center.justify-between.q-mb-sm
						.text-subtitle2 Операции редактирования
						q-btn(
							v-if="assignedOperations.length"
							flat, round,
							dense,
							color="primary",
							icon="mdi-plus-circle",
							@click="openOperationDialog"
						)
					.empty-operations(v-if="!assignedOperations.length")
						.text-body2.text-secondary.q-mb-sm Для этого состояния операции не добавлены.
						q-btn(color="primary" flat icon="mdi-plus-circle" label="Добавить операцию" @click="openOperationDialog")
					q-list.operation-list(v-else separator bordered)
						q-item(v-for="operation in assignedOperations" :key="operation.id" dense)
							q-item-section
								q-item-label {{ operation.name }}
								q-item-label(v-if="operation.description" caption) {{ operation.description }}
							q-item-section(side)
								q-btn(flat round dense color="secondary" icon="mdi-close" size='sm' @click="emit('remove-operation', node.id, operation.id)")
									q-tooltip Удалить операцию
				q-tab-panel(name="transitions")
					.row.items-center.justify-between.q-mb-sm
						.text-subtitle2 Исходящие переходы
						q-btn(
							v-if="outgoingTransitions.length"
							flat
							round
							dense
							color="primary"
							icon="mdi-plus-circle"
							aria-label="Добавить переход"
							@click="openTransitionDialog"
						)
					.empty-operations(v-if="!outgoingTransitions.length")
						.text-body2.text-secondary.q-mb-sm Для этого состояния переходы не добавлены.
						q-btn(color="primary" flat icon="mdi-plus-circle" label="Добавить переход" @click="openTransitionDialog")
					q-list.operation-list(v-else separator bordered)
						q-item(v-for="transition in outgoingTransitions" :key="transition.id" dense)
							q-item-section
								q-item-label(:class="{ 'text-weight-bold': transition.isDefault }") {{ transition.label || transition.targetLabel }}
								q-item-label(caption) Цель: {{ transition.targetLabel }}
							q-item-section(side)
								.row.items-center.no-wrap
									q-checkbox(
										:model-value="transition.isDefault"
										label="По умолчанию"
										dense
										@update:model-value="updateDefaultTransition(transition.id, $event)"
									)
									q-btn(flat round dense color="secondary" icon="mdi-close" size="sm" aria-label="Удалить переход" @click="emit('remove-transition', transition.id)")
										q-tooltip Удалить переход

			StateOperationsDialog(
				v-if="node"
				v-model="isOperationDialogOpen"
				:node-id="node.id"
				:operations="operations"
				:assigned-operation-ids="node.data?.operationIds ?? []"
				@assign-operations="forwardAssignedOperations"
				@create-operation="forwardCreatedOperation"
			)
			StateTransitionsDialog(
				v-if="node"
				v-model="isTransitionDialogOpen"
				:node-id="node.id"
				:transitions="transitions"
				:assigned-transition-ids="assignedTransitionIds"
				:targets="availableTransitionTargets"
				@assign-transitions="forwardAssignedTransitions"
				@create-transition="forwardCreatedTransition"
			)
	q-btn(
		v-if="node || edge"
		class="save-button"
		label="Сохранить"
		color="primary"
		unelevated
		:disable="!hasChanges"
		@click="save"
	)
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
.empty-operations {
	padding: 1rem 0.5rem;
	text-align: center;
}

.operation-list {
	border-color: var(--my-border-color);
	border-radius: 0.35rem;
	background: var(--bgLight);
	font-size: 0.8rem;
	.q-item {
		padding-right: 0.2rem;
	}
}

:deep(.q-tab-panels) {
	background: transparent;
	border-top: 1px solid var(--my-border-color);
}
:deep(.q-tab-panel) {
	padding: 0.5rem 0.25rem;
}
</style>
