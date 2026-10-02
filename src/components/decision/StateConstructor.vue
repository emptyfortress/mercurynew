<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MarkerType, Panel, VueFlow } from '@vue-flow/core'
import type { Connection, Edge, EdgeMouseEvent, Node, NodeMouseEvent } from '@vue-flow/core'
import { Background, ControlButton, Controls, PanelPosition } from '@vue-flow/additional-components'
import type { NameTranslations } from '@/constants/locales'
import StatePropertiesPanel from '@/components/decision/StatePropertiesPanel.vue'
import type { OperationDefinition } from '@/components/decision/operationTypes'

type StateNodeData = {
	label: string
	nameTranslations?: NameTranslations
	operationIds?: string[]
	isInitial?: boolean
}
type StateNode = Omit<Node<StateNodeData>, 'data'> & { data: StateNodeData }
type StateEdgeData = { operationId: string }

const edgeTypeOptions = [
	{ label: 'Кривая Безье', value: 'default' },
	{ label: 'Простая кривая', value: 'simplebezier' },
	{ label: 'Прямая', value: 'straight' },
	{ label: 'Ступенчатая', value: 'step' },
	{ label: 'Ступенчатая со скруглением', value: 'smoothstep' },
] as const
type EdgeType = (typeof edgeTypeOptions)[number]['value']
const edgeTypeStorageKey = 'state-constructor-edge-type'
const isEdgeType = (value: string | null): value is EdgeType =>
	edgeTypeOptions.some((option) => option.value === value)

const getSavedEdgeType = (): EdgeType => {
	try {
		const savedType = window.localStorage.getItem(edgeTypeStorageKey)
		return isEdgeType(savedType) ? savedType : 'smoothstep'
	} catch {
		return 'smoothstep'
	}
}

const splitterModel = ref(70)
const isInteractive = ref(true)
const selectedEdgeType = ref<EdgeType>(getSavedEdgeType())
let nextOperationId = 1
let nextNodeId = 1
let nextEdgeId = 1
let nextStateNameNumber = 1
const selectedNodeId = ref<string | null>(null)
const selectedEdgeId = ref<string | null>(null)
const pendingConnection = ref<Connection | null>(null)
const isConnectionDialogOpen = ref(false)
const selectedConnectionOperationId = ref<string | null>(null)

const operations = ref<OperationDefinition[]>([
	{
		id: 'initial-transition-start-state',
		name: 'В работу',
	},
	{
		id: 'initial-transition-state-end',
		name: 'Завершить',
	},
	{ id: 'contract-concluded', name: 'Договор заключен' },
	{ id: 'additional-agreement', name: 'Дополнительное соглашение' },
	{ id: 'change', name: 'Изменение' },
	{ id: 'barcode-change', name: 'Изменение штрих-кода' },
	{ id: 'counterparty-contact', name: 'Контактное лицо контрагента' },
	{ id: 'category-assignment', name: 'Назначение категории' },
	{ id: 'original-signed', name: 'Оригинал подписан' },
	{ id: 'responsible', name: 'Ответственный' },
	{ id: 'open-approval', name: 'Открыть согласование' },
	{ id: 'email-document', name: 'Отправка документа по электронной почте' },
	{ id: 'send-for-review', name: 'Отправка на ознакомление' },
	{ id: 'rename-files', name: 'Переименование файлов' },
	{ id: 'print-document', name: 'Печать документа' },
	{ id: 'print-barcode', name: 'Печать штрих-кода' },
	{ id: 'prepared-by', name: 'Подготовил' },
	{ id: 'sign-document', name: 'Подписание документа' },
	{ id: 'extend-contract', name: 'Продление срока договора' },
	{ id: 'signature-log', name: 'Просмотр журнала подписей' },
	{ id: 'approval-log', name: 'Просмотр журнала согласования' },
	{ id: 'history', name: 'Просмотр истории' },
	{ id: 'approval-sheet', name: 'Просмотр листа согласования' },
])

const nodes = ref<StateNode[]>([
	{
		id: 'start',
		type: 'input',
		class: 'is-initial',
		data: {
			label: 'Подготовка',
			isInitial: true,
			operationIds: ['initial-transition-start-state'],
		},
		position: { x: 80, y: 80 },
	},
	{
		id: 'state',
		data: { label: 'В работе', operationIds: ['initial-transition-state-end'] },
		position: { x: 300, y: 180 },
	},
	{ id: 'end', type: 'output', data: { label: 'Завершено' }, position: { x: 540, y: 80 } },
	{ id: 'arch', type: 'state', data: { label: 'Архив' }, position: { x: 300, y: 0 } },
])

const defaultEdgeOptions = computed(() => ({
	style: { strokeWidth: 2 },
	markerEnd: MarkerType.ArrowClosed,
	type: selectedEdgeType.value,
}))

const makeOperationEdge = (
	source: string,
	target: string,
	operation: OperationDefinition
): Edge<StateEdgeData> => ({
	...defaultEdgeOptions.value,
	id: `edge-${nextEdgeId++}`,
	source,
	target,
	label: operation.name,
	data: { operationId: operation.id },
})

const edges = ref<Edge<StateEdgeData>[]>([
	makeOperationEdge('start', 'state', operations.value[0]!),
	makeOperationEdge('state', 'end', operations.value[1]!),
])

const pendingConnectionSource = computed(
	() => nodes.value.find((node) => node.id === pendingConnection.value?.source) ?? null
)
const pendingConnectionTarget = computed(
	() => nodes.value.find((node) => node.id === pendingConnection.value?.target) ?? null
)
const pendingConnectionOperations = computed(() => {
	const allowedIds = new Set(pendingConnectionSource.value?.data.operationIds ?? [])
	return operations.value.filter((operation) => allowedIds.has(operation.id))
})
const pendingConnectionOperationOptions = computed(() =>
	pendingConnectionOperations.value.map((operation) => ({
		label: operation.name,
		value: operation.id,
	}))
)

const selectedNode = computed(
	() => nodes.value.find((node) => node.id === selectedNodeId.value) ?? null
)
const selectedEdge = computed(
	() => edges.value.find((edge) => edge.id === selectedEdgeId.value) ?? null
)

const selectNodeById = (nodeId: string) => {
	if (!nodes.value.some((node) => node.id === nodeId)) return
	nodes.value = nodes.value.map((node) => ({ ...node, selected: node.id === nodeId }))
	edges.value = edges.value.map((edge) => ({ ...edge, selected: false }))
	selectedNodeId.value = nodeId
	selectedEdgeId.value = null
}
const selectNode = ({ node }: NodeMouseEvent) => selectNodeById(node.id)

const selectEdgeById = (edgeId: string) => {
	if (!edges.value.some((edge) => edge.id === edgeId)) return
	nodes.value = nodes.value.map((node) => ({ ...node, selected: false }))
	edges.value = edges.value.map((edge) => ({ ...edge, selected: edge.id === edgeId }))
	selectedEdgeId.value = edgeId
	selectedNodeId.value = null
}
const selectEdge = ({ edge }: EdgeMouseEvent) => selectEdgeById(edge.id)

const clearSelection = () => {
	nodes.value = nodes.value.map((node) => ({ ...node, selected: false }))
	edges.value = edges.value.map((edge) => ({ ...edge, selected: false }))
	selectedNodeId.value = null
	selectedEdgeId.value = null
}

const saveNodeProperties = (
	id: string,
	label: string,
	translations: NameTranslations,
	isInitial: boolean
) => {
	nodes.value = nodes.value.map((node) => {
		if (node.id === id) {
			return {
				...node,
				class: isInitial ? 'is-initial' : undefined,
				data: { ...node.data, label, nameTranslations: translations, isInitial },
			}
		}
		return isInitial && node.data.isInitial
			? { ...node, class: undefined, data: { ...node.data, isInitial: false } }
			: node
	})
}

const assignOperations = (nodeId: string, operationIds: string[]) => {
	nodes.value = nodes.value.map((node) =>
		node.id === nodeId
			? {
					...node,
					data: {
						...node.data,
						operationIds: [...new Set([...(node.data.operationIds ?? []), ...operationIds])],
					},
				}
			: node
	)
}

const unassignOperation = (nodeId: string, operationId: string) => {
	nodes.value = nodes.value.map((node) =>
		node.id === nodeId
			? {
					...node,
					data: {
						...node.data,
						operationIds: (node.data.operationIds ?? []).filter((id) => id !== operationId),
					},
				}
			: node
	)
	edges.value = edges.value.filter(
		(edge) => !(edge.source === nodeId && edge.data?.operationId === operationId)
	)
}

const createOperation = (nodeId: string | null, operation: Omit<OperationDefinition, 'id'>) => {
	const newOperation = { ...operation, id: `custom-operation-${nextOperationId++}` }
	operations.value.push(newOperation)
	if (nodeId) assignOperations(nodeId, [newOperation.id])
}

const deleteOperation = (operationId: string) => {
	operations.value = operations.value.filter((operation) => operation.id !== operationId)
	nodes.value = nodes.value.map((node) => ({
		...node,
		data: {
			...node.data,
			operationIds: (node.data.operationIds ?? []).filter((id) => id !== operationId),
		},
	}))
	edges.value = edges.value.filter((edge) => edge.data?.operationId !== operationId)
}

const renameOperation = (operationId: string, name: string) => {
	const operation = operations.value.find((item) => item.id === operationId)
	if (!operation || !name.trim()) return
	operation.name = name.trim()
	edges.value = edges.value.map((edge) =>
		edge.data?.operationId === operationId ? { ...edge, label: operation.name } : edge
	)
}

const setEdgeOperation = (edgeId: string, operationId: string) => {
	const edge = edges.value.find((item) => item.id === edgeId)
	const source = edge ? nodes.value.find((node) => node.id === edge.source) : null
	const operation = operations.value.find((item) => item.id === operationId)
	if (!edge || !source?.data.operationIds?.includes(operationId) || !operation) return
	edges.value = edges.value.map((item) =>
		item.id === edgeId
			? { ...item, label: operation.name, data: { ...item.data, operationId } }
			: item
	)
}

const addTransition = (sourceNodeId: string, targetNodeId: string, operationId: string) => {
	const operation = operations.value.find((item) => item.id === operationId)
	const source = nodes.value.find((node) => node.id === sourceNodeId)
	if (!operation || !source?.data.operationIds?.includes(operationId)) return
	const duplicate = edges.value.some(
		(edge) =>
			edge.source === sourceNodeId &&
			edge.target === targetNodeId &&
			edge.data?.operationId === operationId
	)
	if (duplicate) return
	edges.value.push(makeOperationEdge(sourceNodeId, targetNodeId, operation))
}

const deleteTransition = (edgeId: string) => {
	edges.value = edges.value.filter((edge) => edge.id !== edgeId)
	if (selectedEdgeId.value === edgeId) selectedEdgeId.value = null
}

const addNode = () => {
	const addedNodesCount = nodes.value.filter((node) => node.id.startsWith('node-')).length
	const id = `node-${nextNodeId++}`
	nodes.value.push({
		id,
		data: { label: `Состояние ${nextStateNameNumber++}` },
		position: {
			x: 80 + (addedNodesCount % 3) * 220,
			y: 320 + Math.floor(addedNodesCount / 3) * 140,
		},
	})
}

const deleteNode = (nodeId: string) => {
	nodes.value = nodes.value.filter((node) => node.id !== nodeId)
	edges.value = edges.value.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
	if (selectedNodeId.value === nodeId) selectedNodeId.value = null
	if (selectedEdgeId.value && !edges.value.some((edge) => edge.id === selectedEdgeId.value))
		selectedEdgeId.value = null
}

const requestConnection = (connection: Connection) => {
	if (!connection.source || !connection.target) return
	const existing = edges.value.find(
		(edge) => edge.source === connection.source && edge.target === connection.target
	)
	if (existing) return
	const source = nodes.value.find((node) => node.id === connection.source)
	const target = nodes.value.find((node) => node.id === connection.target)
	if (!source || !target) return
	const incomingTransition = edges.value.find((edge) => edge.target === target.id)
	const incomingOperation = operations.value.find(
		(operation) => operation.id === incomingTransition?.data?.operationId
	)
	if (incomingOperation) {
		if (!source.data.operationIds?.includes(incomingOperation.id)) {
			assignOperations(source.id, [incomingOperation.id])
		}
		edges.value.push(makeOperationEdge(source.id, target.id, incomingOperation))
		return
	}

	pendingConnection.value = connection
	selectedConnectionOperationId.value = null
	isConnectionDialogOpen.value = true
}

const confirmConnection = () => {
	const connection = pendingConnection.value
	const operationId = selectedConnectionOperationId.value
	if (!connection?.source || !connection.target || !operationId || !isInteractive.value) return
	const source = nodes.value.find((node) => node.id === connection.source)
	const operation = operations.value.find((item) => item.id === operationId)
	if (!source?.data.operationIds?.includes(operationId) || !operation) return
	if (
		edges.value.some(
			(edge) => edge.source === connection.source && edge.target === connection.target
		)
	)
		return
	edges.value.push(makeOperationEdge(connection.source, connection.target, operation))
	isConnectionDialogOpen.value = false
}

watch(isConnectionDialogOpen, (isOpen) => {
	if (!isOpen) {
		pendingConnection.value = null
		selectedConnectionOperationId.value = null
	}
})

watch(selectedEdgeType, (type) => {
	edges.value = edges.value.map((edge) => ({ ...edge, type }))
	try {
		window.localStorage.setItem(edgeTypeStorageKey, type)
	} catch {
		// Keep the selected style active for this session when storage is unavailable.
	}
})

const transitionTargets = computed(() =>
	nodes.value.map((node) => ({ id: node.id, label: node.data.label }))
)
const hei = computed(() => `height: ${window.innerHeight - 180}px;`)
</script>

<template lang="pug">
q-page(padding)
	.container
		.text-h6 Конструктор состояний
		q-splitter(v-model="splitterModel" :limits="[0, 100]" :style="hei")
			template(v-slot:before)
				.main
					VueFlow(
						v-model:nodes="nodes"
						v-model:edges="edges"
						:default-edge-options="defaultEdgeOptions"
						fit-view-on-init
						:nodes-draggable="isInteractive"
						:nodes-connectable="isInteractive"
						:elements-selectable="isInteractive"
						@node-click="selectNode"
						@pane-click="clearSelection"
						@edge-click="selectEdge"
						@connect="requestConnection"
					)
						Background(:gap="16" :size="1" pattern-color="#9aa9b5")
						Controls(:position="PanelPosition.TopRight" :show-interactive="false")
							template(v-slot:top)
								ControlButton(
									:title="isInteractive ? 'Отключить редактирование' : 'Включить редактирование'"
									@click="isInteractive = !isInteractive"
								)
									q-icon(:name="isInteractive ? 'lock_open' : 'lock'")
						Panel(position="bottom-right")
							q-btn(fab color="primary" icon="add" title="Добавить состояние" :disable="!isInteractive" @click="addNode")
						Panel(position="bottom-left")
							q-btn(flat round color="primary" icon="mdi-cog" title="Настройки типа связей")
								q-menu(anchor="top left" self="bottom left")
									.text-bold.text-center Тип связи
									q-list(dense)
										q-item(v-for="option in edgeTypeOptions" :key="option.value" clickable v-close-popup @click="selectedEdgeType = option.value")
											q-item-section {{ option.label }}
											q-item-section(side)
												q-icon(v-if="selectedEdgeType === option.value" name="mdi-check" color="primary")
			template(v-slot:after)
				.properties
					StatePropertiesPanel(
						:node="selectedNode"
						:edge="selectedEdge"
						:nodes="nodes"
						:edges="edges"
						:operations="operations"
						:transition-targets="transitionTargets"
						@save:node-properties="saveNodeProperties"
						@save:edge-operation="setEdgeOperation"
						@rename-operation="renameOperation"
						@assign-operation="assignOperations"
						@unassign-operation="unassignOperation"
						@create-operation="createOperation"
						@delete-operation="deleteOperation"
						@add-transition="addTransition"
						@delete-transition="deleteTransition"
						@add-node="addNode"
						@delete-node="deleteNode"
						@select-node="selectNodeById"
						@select-edge="selectEdgeById"
					)
	q-dialog(v-model="isConnectionDialogOpen" backdrop-filter="blur(4px) saturate(150%)")
		q-card.connection-dialog
			q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
			q-card-section
				.text-h6 Выберите операцию
				.caption Связь {{ pendingConnectionSource?.data.label ?? 'исходного состояния' }} → {{ pendingConnectionTarget?.data.label ?? 'целевого состояния' }} будет создана после подтверждения.
			q-card-section.q-pt-none
				.operation-field-label Разрешенная операция
				q-select(v-model="selectedConnectionOperationId" :options="pendingConnectionOperationOptions" outlined dense emit-value map-options :disable="!pendingConnectionOperations.length" :placeholder="pendingConnectionOperations.length ? 'Выберите операцию' : 'Нет разрешенных операций'")
			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup)
				q-btn(color="primary" unelevated label="Создать связь" :disable="!selectedConnectionOperationId || !pendingConnectionOperations.some((operation) => operation.id === selectedConnectionOperationId)" @click="confirmConnection")
</template>

<style scoped lang="scss">
:deep(.q-splitter__separator) {
	background-color: transparent;
}
.main {
	border: 1px solid var(--my-border-color);
	background: var(--bg-panel);
	height: 100%;
	margin-right: 0.5rem;
	padding: 0;
}
.properties {
	height: 100%;
	background: var(--bg-panel);
	border: 1px solid var(--my-border-color);
	padding: 0.5rem;
}
.connection-dialog {
	width: 480px;
	max-width: calc(100vw - 2rem);
}
.operation-field-label {
	margin-bottom: 0.25rem;
}
:deep(.vue-flow__node.selected) {
	outline: 2px solid var(--q-primary);
	outline-offset: 2px;
	box-shadow: 0 4px 6px rgb(0 0 0 / 52%);
}
:deep(.vue-flow__node.is-initial) {
	background-color: #c3e7c6;
}
:deep(.vue-flow__controls) {
	display: flex;
	gap: 0.25rem;
	padding: 0.25rem;
	border: 1px solid var(--my-border-color);
	border-radius: 0.4rem;
	background: var(--bg-panel);
}
:deep(.vue-flow__controls-button) {
	display: grid;
	width: 2rem;
	height: 2rem;
	place-items: center;
	border: 0;
	border-radius: 0.25rem;
	background: transparent;
	color: var(--q-primary);
	cursor: pointer;
	&:hover {
		background: rgb(0 0 0 / 6%);
	}
}
:deep(.vue-flow__controls-button svg) {
	width: 1rem;
	height: 1rem;
}
</style>
