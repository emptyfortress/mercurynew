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

const splitterModel = ref(75)
const isInteractive = ref(true)
const selectedEdgeType = ref<EdgeType>(getSavedEdgeType())
let nextOperationId = 1
let nextNodeId = 1
let nextEdgeId = 1
const selectedNodeId = ref<string | null>(null)
const selectedEdgeId = ref<string | null>(null)

const operations = ref<OperationDefinition[]>([
	{
		id: 'initial-transition-start-state',
		name: 'В работу',
		isTransition: true,
		targetNodeId: 'state',
	},
	{
		id: 'initial-transition-state-end',
		name: 'Завершить',
		isTransition: true,
		targetNodeId: 'end',
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
	{ id: 'arch', type: 'state', data: { label: 'Архив' }, position: { x: 540, y: 180 } },
])

const defaultEdgeOptions = computed(() => ({
	style: { strokeWidth: 2 },
	markerEnd: MarkerType.ArrowClosed,
	type: selectedEdgeType.value,
}))

const makeOperationEdge = (
	source: string,
	operation: OperationDefinition
): Edge<StateEdgeData> => ({
	...defaultEdgeOptions.value,
	id: `edge-${nextEdgeId++}`,
	source,
	target: operation.targetNodeId!,
	label: operation.name,
	data: { operationId: operation.id },
})

const edges = ref<Edge<StateEdgeData>[]>([
	makeOperationEdge('start', operations.value[0]!),
	makeOperationEdge('state', operations.value[1]!),
])

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
	for (const operationId of operationIds) {
		const operation = operations.value.find((item) => item.id === operationId)
		if (operation?.isTransition) syncOperationEdges(operation)
	}
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

function syncOperationEdges(operation: OperationDefinition) {
	edges.value = edges.value.filter((edge) => edge.data?.operationId !== operation.id)
	if (!operation.isTransition || !operation.targetNodeId) return
	const sources = nodes.value.filter((node) => node.data.operationIds?.includes(operation.id))
	edges.value = [...edges.value, ...sources.map((node) => makeOperationEdge(node.id, operation))]
}

const setOperationTransition = (operationId: string, targetNodeId: string | null) => {
	const operation = operations.value.find((item) => item.id === operationId)
	if (!operation) return
	operation.isTransition = Boolean(targetNodeId)
	operation.targetNodeId = targetNodeId ?? undefined
	syncOperationEdges(operation)
}

const addNode = () => {
	const addedNodesCount = nodes.value.filter((node) => node.id.startsWith('node-')).length
	const id = `node-${nextNodeId++}`
	nodes.value.push({
		id,
		data: { label: 'Новое состояние' },
		position: {
			x: 80 + (addedNodesCount % 3) * 220,
			y: 320 + Math.floor(addedNodesCount / 3) * 140,
		},
	})
}

const deleteNode = (nodeId: string) => {
	nodes.value = nodes.value.filter((node) => node.id !== nodeId)
	edges.value = edges.value.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
	operations.value = operations.value.map((operation) =>
		operation.targetNodeId === nodeId
			? { ...operation, isTransition: false, targetNodeId: undefined }
			: operation
	)
	if (selectedNodeId.value === nodeId) selectedNodeId.value = null
	if (selectedEdgeId.value && !edges.value.some((edge) => edge.id === selectedEdgeId.value))
		selectedEdgeId.value = null
}

const addConnection = (connection: Connection) => {
	if (!connection.source || !connection.target) return
	const existing = edges.value.find(
		(edge) => edge.source === connection.source && edge.target === connection.target
	)
	if (existing) return
	const operation = {
		id: `custom-operation-${nextOperationId++}`,
		name: nodes.value.find((node) => node.id === connection.target)?.data.label ?? 'Новый переход',
		isTransition: true,
		targetNodeId: connection.target,
	}
	operations.value.push(operation)
	assignOperations(connection.source, [operation.id])
}

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
						@connect="addConnection"
					)
						Background(:gap="16" :size="1" pattern-color="#9aa9b5")
						Controls(:position="PanelPosition.TopRight" :show-interactive="false")
							template(v-slot:top)
								ControlButton(
									:title="isInteractive ? 'Отключить редактирование' : 'Включить редактирование'"
									:aria-label="isInteractive ? 'Отключить редактирование' : 'Включить редактирование'"
									@click="isInteractive = !isInteractive"
								)
									q-icon(:name="isInteractive ? 'lock_open' : 'lock'")
						Panel(position="bottom-right")
							q-btn(fab color="primary" icon="add" aria-label="Добавить состояние" title="Добавить состояние" :disable="!isInteractive" @click="addNode")
						Panel(position="bottom-left")
							q-btn(flat round color="primary" icon="mdi-cog" aria-label="Настройки типа связей" title="Настройки типа связей")
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
						@rename-operation="renameOperation"
						@assign-operation="assignOperations"
						@unassign-operation="unassignOperation"
						@create-operation="createOperation"
						@delete-operation="deleteOperation"
						@set-operation-transition="setOperationTransition"
						@add-node="addNode"
						@delete-node="deleteNode"
						@select-node="selectNodeById"
						@select-edge="selectEdgeById"
					)
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
