import { computed, ref, watch } from 'vue'
import { MarkerType } from '@vue-flow/core'
import type { NameTranslations } from '@/constants/locales'
import type { Connection, EdgeMouseEvent, NodeMouseEvent } from '@vue-flow/core'
import type {
	EdgeType,
	DefaultTransitionOption,
	NodePropertyChanges,
	OperationDefinition,
	StateConstructorContext,
	StateEdge,
	StateNode,
	StateTarget,
} from './types'

type PendingDefaultTransitionAction =
	| { type: 'add'; sourceId: string; targetId: string; operationId: string }
	| {
			type: 'change-operation'
			edgeId: string
			sourceId: string
			previousOperationId: string
			operationId: string
	  }
const newTransitionOptionId = '__new-transition-candidate__'

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
	const isDefaultTransitionDialogOpen = ref(false)
	const defaultTransitionOptions = ref<DefaultTransitionOption[]>([])
	const selectedDefaultTransitionId = ref<string | null>(null)
	const pendingDefaultTransitionAction = ref<PendingDefaultTransitionAction | null>(null)

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
			// type: 'input',
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
		{
			id: 'end',
			// type: 'output',
			data: { label: 'Завершено' },
			position: { x: 540, y: 80 },
		},
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
		operation: OperationDefinition,
		isDefault = true
	): StateEdge => ({
		...defaultEdgeOptions.value,
		style: {
			...defaultEdgeOptions.value.style,
			...(operation.color ? { stroke: operation.color } : {}),
			...(!isDefault ? { strokeDasharray: '6 4' } : {}),
		},
		markerEnd: operation.color
			? { type: MarkerType.ArrowClosed, color: operation.color }
			: MarkerType.ArrowClosed,
		id: `edge-${nextEdgeId++}`,
		source,
		target,
		label: operation.name,
		data: { operationId: operation.id, isDefault },
	})

	const edges = ref<StateEdge[]>([
		makeOperationEdge('start', 'state', operations.value[0]!),
		makeOperationEdge('state', 'end', operations.value[1]!),
	])

	const getOperationTransitionGroup = (
		sourceId: string,
		operationId: string,
		excludeEdgeId?: string
	) =>
		edges.value.filter(
			(edge) =>
				edge.id !== excludeEdgeId &&
				edge.source === sourceId &&
				edge.data?.operationId === operationId
		)

	const setTransitionDefaultStyle = (edge: StateEdge, isDefault: boolean): StateEdge => {
		const style = { ...(typeof edge.style === 'object' && edge.style ? edge.style : {}) }
		if (isDefault) delete style.strokeDasharray
		else style.strokeDasharray = '6 4'
		return { ...edge, style, data: { ...edge.data, isDefault } }
	}

	const normalizeOperationTransitionGroup = (
		sourceId: string,
		operationId: string,
		preferredDefaultEdgeId?: string
	) => {
		const group = getOperationTransitionGroup(sourceId, operationId)
		if (!group.length) return
		const defaultEdgeId = group.some((edge) => edge.id === preferredDefaultEdgeId)
			? preferredDefaultEdgeId
			: (group.find((edge) => edge.data?.isDefault)?.id ?? group[0]!.id)
		const groupIds = new Set(group.map((edge) => edge.id))
		edges.value = edges.value.map((edge) =>
			groupIds.has(edge.id)
				? setTransitionDefaultStyle(edge, edge.id === defaultEdgeId)
				: edge
		)
	}

	const nodeLabel = (nodeId: string) =>
		nodes.value.find((node) => node.id === nodeId)?.data.label ?? nodeId

	const openDefaultTransitionDialog = (
		action: PendingDefaultTransitionAction,
		sourceId: string,
		operationId: string,
		candidateId: string,
		candidateTargetId: string,
		excludeEdgeId?: string
	) => {
		const group = getOperationTransitionGroup(sourceId, operationId, excludeEdgeId)
		defaultTransitionOptions.value = [
			...group.map((edge, index) => ({
				value: edge.id,
				label: `${nodeLabel(sourceId)} → ${nodeLabel(edge.target)}${edge.data?.isDefault || (!group.some((item) => item.data?.isDefault) && index === 0) ? ' (сейчас по умолчанию)' : ''}`,
			})),
			{
				value: candidateId,
				label: `${nodeLabel(sourceId)} → ${nodeLabel(candidateTargetId)} (${action.type === 'add' ? 'новый переход' : 'изменяемый переход'})`,
			},
		]
		selectedDefaultTransitionId.value =
			group.find((edge) => edge.data?.isDefault)?.id ?? group[0]?.id ?? candidateId
		pendingDefaultTransitionAction.value = action
		isDefaultTransitionDialogOpen.value = true
	}

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

	const renameOperation = (
		operationId: string,
		name: string,
		nameTranslations?: NameTranslations
	) => {
		const operation = operations.value.find((item) => item.id === operationId)
		if (!operation || !name.trim()) return
		operation.name = name.trim()
		if (nameTranslations) operation.nameTranslations = { ...nameTranslations }
		edges.value = edges.value.map((edge) =>
			edge.data?.operationId === operationId ? { ...edge, label: operation.name } : edge
		)
	}

	const updateOperationColor = (operationId: string, color?: string) => {
		const operation = operations.value.find((item) => item.id === operationId)
		if (!operation) return
		operation.color = color || undefined
		edges.value = edges.value.map((edge) => {
			if (edge.data?.operationId !== operationId) return edge
			const style = { ...(typeof edge.style === 'object' && edge.style ? edge.style : {}) }
			if (operation.color) style.stroke = operation.color
			else delete style.stroke
			return {
				...edge,
				style,
				markerEnd: operation.color
					? { type: MarkerType.ArrowClosed, color: operation.color }
					: MarkerType.ArrowClosed,
			}
		})
	}

	const applyOperationToTransition = (edgeId: string, operation: OperationDefinition) => {
		edges.value = edges.value.map((item) => {
			if (item.id !== edgeId) return item
			const style = { ...(typeof item.style === 'object' && item.style ? item.style : {}) }
			if (operation.color) style.stroke = operation.color
			else delete style.stroke
			return {
				...item,
				label: operation.name,
				style,
				markerEnd: operation.color
					? { type: MarkerType.ArrowClosed, color: operation.color }
					: MarkerType.ArrowClosed,
				data: { ...item.data, operationId: operation.id },
			}
		})
	}

	const setEdgeOperation = (edgeId: string, operationId: string) => {
		const edge = edges.value.find((item) => item.id === edgeId)
		const source = edge ? nodes.value.find((node) => node.id === edge.source) : null
		const operation = operations.value.find((item) => item.id === operationId)
		if (!edge || !source?.data.operationIds?.includes(operationId) || !operation) return
		const previousOperationId = edge.data.operationId
		if (previousOperationId === operationId) return
		const conflictingTransitions = getOperationTransitionGroup(edge.source, operationId, edgeId)
		if (conflictingTransitions.length) {
			openDefaultTransitionDialog(
				{
					type: 'change-operation',
					edgeId,
					sourceId: edge.source,
					previousOperationId,
					operationId,
				},
				edge.source,
				operationId,
				edgeId,
				edge.target,
				edgeId
			)
			return
		}
		applyOperationToTransition(edgeId, operation)
		normalizeOperationTransitionGroup(edge.source, previousOperationId)
		normalizeOperationTransitionGroup(edge.source, operationId, edgeId)
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
		const existingTransitions = getOperationTransitionGroup(sourceNodeId, operationId)
		if (existingTransitions.length) {
			openDefaultTransitionDialog(
				{ type: 'add', sourceId: sourceNodeId, targetId: targetNodeId, operationId },
				sourceNodeId,
				operationId,
				newTransitionOptionId,
				targetNodeId
			)
			return
		}
		edges.value.push(makeOperationEdge(sourceNodeId, targetNodeId, operation, true))
	}

	const confirmDefaultTransition = () => {
		const action = pendingDefaultTransitionAction.value
		const defaultTransitionId = selectedDefaultTransitionId.value
		if (!action || !defaultTransitionId) return

		if (action.type === 'add') {
			const source = nodes.value.find((node) => node.id === action.sourceId)
			const operation = operations.value.find((item) => item.id === action.operationId)
			const duplicate = edges.value.some(
				(edge) =>
					edge.source === action.sourceId &&
					edge.target === action.targetId &&
					edge.data?.operationId === action.operationId
			)
			if (source?.data.operationIds?.includes(action.operationId) && operation && !duplicate) {
				const newEdge = makeOperationEdge(
					action.sourceId,
					action.targetId,
					operation,
					defaultTransitionId === newTransitionOptionId
				)
				edges.value.push(newEdge)
				normalizeOperationTransitionGroup(
					action.sourceId,
					action.operationId,
					defaultTransitionId === newTransitionOptionId ? newEdge.id : defaultTransitionId
				)
			}
		} else {
			const edge = edges.value.find((item) => item.id === action.edgeId)
			const source = nodes.value.find((node) => node.id === action.sourceId)
			const operation = operations.value.find((item) => item.id === action.operationId)
			if (
				edge?.source === action.sourceId &&
				edge.data.operationId === action.previousOperationId &&
				source?.data.operationIds?.includes(action.operationId) &&
				operation
			) {
				applyOperationToTransition(action.edgeId, operation)
				normalizeOperationTransitionGroup(action.sourceId, action.previousOperationId)
				normalizeOperationTransitionGroup(
					action.sourceId,
					action.operationId,
					defaultTransitionId
				)
			}
		}

		isDefaultTransitionDialogOpen.value = false
		pendingDefaultTransitionAction.value = null
		defaultTransitionOptions.value = []
		selectedDefaultTransitionId.value = null
	}

	const setDefaultTransition = (edgeId: string) => {
		const edge = edges.value.find((item) => item.id === edgeId)
		if (!edge) return
		normalizeOperationTransitionGroup(edge.source, edge.data.operationId, edgeId)
	}

	const deleteTransition = (edgeId: string) => {
		const deleted = edges.value.find((edge) => edge.id === edgeId)
		edges.value = edges.value.filter((edge) => edge.id !== edgeId)
		if (deleted) normalizeOperationTransitionGroup(deleted.source, deleted.data.operationId)
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
		const affectedGroups = new Map<string, { sourceId: string; operationId: string }>()
		edges.value
			.filter((edge) => edge.source !== nodeId && edge.target === nodeId)
			.forEach((edge) => {
				const operationId = edge.data.operationId
				affectedGroups.set(`${edge.source}:${operationId}`, {
					sourceId: edge.source,
					operationId,
				})
			})
		nodes.value = nodes.value.filter((node) => node.id !== nodeId)
		edges.value = edges.value.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
		affectedGroups.forEach(({ sourceId, operationId }) =>
			normalizeOperationTransitionGroup(sourceId, operationId)
		)
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
			addTransition(source.id, target.id, incomingOperation.id)
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
		addTransition(connection.source, connection.target, operationId)
		isConnectionDialogOpen.value = false
	}

	watch(isConnectionDialogOpen, (isOpen) => {
		if (!isOpen) {
			pendingConnection.value = null
			selectedConnectionOperationId.value = null
		}
	})

	watch(isDefaultTransitionDialogOpen, (isOpen) => {
		if (!isOpen) {
			pendingDefaultTransitionAction.value = null
			defaultTransitionOptions.value = []
			selectedDefaultTransitionId.value = null
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
		isInteractive,
		selectedEdgeType,
		edgeTypeOptions,
		nodes,
		edges,
		operations,
		selectedNodes,
		selectedNode,
		selectedEdge,
		transitionTargets,
		selectedConnectionOperationId,
		isConnectionDialogOpen,
		isDefaultTransitionDialogOpen,
		defaultTransitionOptions,
		selectedDefaultTransitionId,
		pendingConnectionSource,
		pendingConnectionTarget,
		pendingConnectionOperationOptions,
		selectNode,
		selectNodeById,
		selectEdge,
		selectEdgeById,
		clearSelection,
		updateNodeProperties,
		setEdgeOperation,
		setDefaultTransition,
		updateOperationColor,
		renameOperation,
		assignOperations,
		unassignOperation,
		assignOperationsToNodes,
		createOperationForNodes,
		createOperationForConnection,
		deleteOperation,
		addTransition,
		deleteTransition,
		addNode,
		deleteNode,
		requestConnection,
		confirmConnection,
		confirmDefaultTransition,
	}
}
