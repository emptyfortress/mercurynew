import { computed, ref, watch } from 'vue'
import { MarkerType } from '@vue-flow/core'
import type { Connection, Edge, EdgeMouseEvent, NodeMouseEvent } from '@vue-flow/core'
import type {
	EdgeType,
	NodePropertyChanges,
	OperationDefinition,
	StateConstructorContext,
	StateEdge,
	StateEdgeData,
	StateNode,
	StateTarget,
} from './types'

export function useStateConstructor(): StateConstructorContext {

const edgeTypeOptions = [
	{ label: 'Кривая Безье', value: 'default' },
	{ label: 'Простая кривая', value: 'simplebezier' },
	{ label: 'Прямая', value: 'straight' },
	{ label: 'Ступенчатая', value: 'step' },
	{ label: 'Ступенчатая со скруглением', value: 'smoothstep' },
] as const
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

const isInteractive = ref(true)
const selectedEdgeType = ref<EdgeType>(getSavedEdgeType())
let nextOperationId = 1
let nextNodeId = 1
let nextEdgeId = 1
let nextStateNameNumber = 1
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
	{ id: 'arch', data: { label: 'Архив' }, position: { x: 300, y: 0 } },
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

const edges = ref<StateEdge[]>([
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

const selectedNodes = computed(() => nodes.value.filter((node) => node.selected))
const selectedNode = computed(() =>
	selectedNodes.value.length === 1 ? selectedNodes.value[0]! : null
)
const selectedEdge = computed(() => edges.value.find((edge) => edge.selected) ?? null)

const selectNodeById = (nodeId: string) => {
	if (!nodes.value.some((node) => node.id === nodeId)) return
	nodes.value = nodes.value.map((node) => ({ ...node, selected: node.id === nodeId }))
	edges.value = edges.value.map((edge) => ({ ...edge, selected: false }))
}
const selectNode = ({ node }: NodeMouseEvent) => selectNodeById(node.id)

const selectEdgeById = (edgeId: string) => {
	if (!edges.value.some((edge) => edge.id === edgeId)) return
	nodes.value = nodes.value.map((node) => ({ ...node, selected: false }))
	edges.value = edges.value.map((edge) => ({ ...edge, selected: edge.id === edgeId }))
}
const selectEdge = ({ edge }: EdgeMouseEvent) => selectEdgeById(edge.id)

const clearSelection = () => {
	nodes.value = nodes.value.map((node) => ({ ...node, selected: false }))
	edges.value = edges.value.map((edge) => ({ ...edge, selected: false }))
}

const updateNodeProperties = (id: string, changes: NodePropertyChanges) => {
	if (!nodes.value.some((node) => node.id === id)) return
	nodes.value = nodes.value.map((node) => {
		if (node.id === id) {
			const data = { ...node.data, ...changes }
			return { ...node, class: data.isInitial ? 'is-initial' : undefined, data }
		}
		return changes.isInitial && node.data.isInitial
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

const assignOperationsToNodes = (nodeIds: string[], operationIds: string[]) => {
	const targetIds = new Set(nodeIds)
	if (targetIds.size === 0 || operationIds.length === 0) return
	const idsToAssign = new Set(operationIds)
	nodes.value = nodes.value.map((node) => {
		if (!targetIds.has(node.id)) return node
		const assignedIds = new Set(node.data.operationIds ?? [])
		idsToAssign.forEach((id) => assignedIds.add(id))
		return { ...node, data: { ...node.data, operationIds: [...assignedIds] } }
	})
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

const createOperationForNodes = (
	nodeIds: string[],
	operation: Omit<OperationDefinition, 'id'>
): string => {
	const newOperation = { ...operation, id: `custom-operation-${nextOperationId++}` }
	operations.value.push(newOperation)
	assignOperationsToNodes(nodeIds, [newOperation.id])
	return newOperation.id
}

const createOperationForConnection = (operation: Omit<OperationDefinition, 'id'>) => {
	const sourceId = pendingConnection.value?.source
	if (!sourceId) return
	selectedConnectionOperationId.value = createOperationForNodes([sourceId], operation)
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

const transitionTargets = computed<StateTarget[]>(() =>
	nodes.value.map((node) => ({ id: node.id, label: node.data.label }))
)

	return {
		isInteractive, selectedEdgeType, edgeTypeOptions,
		nodes, edges, operations, selectedNodes, selectedNode, selectedEdge, transitionTargets,
		selectedConnectionOperationId, isConnectionDialogOpen,
		pendingConnectionSource, pendingConnectionTarget, pendingConnectionOperationOptions,
		selectNode, selectNodeById, selectEdge, selectEdgeById, clearSelection,
		updateNodeProperties, setEdgeOperation, renameOperation, assignOperations,
		unassignOperation, assignOperationsToNodes, createOperationForNodes, createOperationForConnection, deleteOperation, addTransition, deleteTransition,
		addNode, deleteNode, requestConnection, confirmConnection,
	}
}
