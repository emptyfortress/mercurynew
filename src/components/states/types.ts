import type { NameTranslations } from '@/constants/locales'
import type { ComputedRef, Ref } from 'vue'
import type { Connection, Edge, EdgeMouseEvent, Node, NodeMouseEvent } from '@vue-flow/core'

export type EdgeType = 'default' | 'simplebezier' | 'straight' | 'step' | 'smoothstep'
export type EdgeTypeOption = { label: string; value: EdgeType }

export type StateNodeData = {
	label: string
	nameTranslations?: NameTranslations
	operationIds?: string[]
	isInitial?: boolean
}
export type NodePropertyChanges = Partial<Pick<StateNodeData, 'label' | 'nameTranslations' | 'isInitial'>>
export type StateNode = Omit<Node<StateNodeData>, 'data'> & {
	data: StateNodeData
	selected?: boolean
}
export type StateEdgeData = { operationId: string }
export type StateEdge = Edge<StateEdgeData> & { selected?: boolean }
export type StateTarget = { id: string; label: string }

export type OperationDefinition = {
	id: string
	name: string
	description?: string
	nameTranslations?: NameTranslations
	descriptionTranslations?: NameTranslations
}

export type StateConstructorContext = {
	isInteractive: Ref<boolean>
	selectedEdgeType: Ref<EdgeType>
	edgeTypeOptions: ReadonlyArray<EdgeTypeOption>
	nodes: Ref<StateNode[]>
	edges: Ref<StateEdge[]>
	operations: Ref<OperationDefinition[]>
	selectedNodes: ComputedRef<StateNode[]>
	selectedNode: ComputedRef<StateNode | null>
	selectedEdge: ComputedRef<StateEdge | null>
	transitionTargets: ComputedRef<StateTarget[]>
	selectedConnectionOperationId: Ref<string | null>
	isConnectionDialogOpen: Ref<boolean>
	pendingConnectionSource: ComputedRef<StateNode | null>
	pendingConnectionTarget: ComputedRef<StateNode | null>
	pendingConnectionOperationOptions: ComputedRef<Array<{ label: string; value: string }>>
	selectNode(event: NodeMouseEvent): void
	selectNodeById(nodeId: string): void
	selectEdge(event: EdgeMouseEvent): void
	selectEdgeById(edgeId: string): void
	clearSelection(): void
	updateNodeProperties(id: string, changes: NodePropertyChanges): void
	setEdgeOperation(edgeId: string, operationId: string): void
	renameOperation(operationId: string, name: string): void
	assignOperations(nodeId: string, operationIds: string[]): void
	assignOperationsToNodes(nodeIds: string[], operationIds: string[]): void
	unassignOperation(nodeId: string, operationId: string): void
	createOperationForNodes(nodeIds: string[], operation: Omit<OperationDefinition, 'id'>): string
	createOperationForConnection(operation: Omit<OperationDefinition, 'id'>): void
	deleteOperation(operationId: string): void
	addTransition(sourceNodeId: string, targetNodeId: string, operationId: string): void
	deleteTransition(edgeId: string): void
	addNode(): void
	deleteNode(nodeId: string): void
	requestConnection(connection: Connection): void
	confirmConnection(): void
}
