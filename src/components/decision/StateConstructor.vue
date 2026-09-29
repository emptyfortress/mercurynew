<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MarkerType, Panel, VueFlow } from '@vue-flow/core'
import type { Connection, Edge, EdgeMouseEvent, Node, NodeMouseEvent } from '@vue-flow/core'
import { Background, ControlButton, Controls, PanelPosition } from '@vue-flow/additional-components'
import type { NameTranslations } from '@/constants/locales'
import StatePropertiesPanel from '@/components/decision/StatePropertiesPanel.vue'
import type { OperationDefinition } from '@/components/decision/StatePropertiesPanel.vue'

type StateNodeData = { label: string; nameTranslations?: NameTranslations; operationIds?: string[] }
type StateNode = Omit<Node<StateNodeData>, 'data'> & { data: StateNodeData }
type StateEdgeData = { nameTranslations?: NameTranslations }
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

const operations = ref<OperationDefinition[]>([
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
let nextOperationId = 1

const nodes = ref<StateNode[]>([
	{ id: 'start', type: 'input', data: { label: 'Начало' }, position: { x: 80, y: 80 } },
	{ id: 'state', data: { label: 'Новое состояние' }, position: { x: 300, y: 180 } },
	{ id: 'end', type: 'output', data: { label: 'Завершение' }, position: { x: 540, y: 80 } },
])

let nextNodeId = 1
let nextEdgeId = 1
const selectedNodeId = ref<string | null>(null)
const selectedEdgeId = ref<string | null>(null)

const selectedNode = computed(
	() => nodes.value.find((node) => node.id === selectedNodeId.value) ?? null
)

const selectNode = ({ node }: NodeMouseEvent) => {
	selectedNodeId.value = node.id
	selectedEdgeId.value = null
}

const selectEdge = ({ edge }: EdgeMouseEvent) => {
	selectedEdgeId.value = edge.id
	selectedNodeId.value = null
}

const clearSelection = () => {
	selectedNodeId.value = null
	selectedEdgeId.value = null
}

const saveNodeLabel = (id: string, label: string, translations: NameTranslations) => {
	nodes.value = nodes.value.map((node) =>
		node.id === id
			? { ...node, data: { ...node.data, label, nameTranslations: translations } }
			: node
	)
}

const assignOperations = (id: string, operationIds: string[]) => {
	nodes.value = nodes.value.map((node) =>
		node.id === id
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

const removeOperation = (id: string, operationId: string) => {
	nodes.value = nodes.value.map((node) =>
		node.id === id
			? {
					...node,
					data: {
						...node.data,
						operationIds: (node.data.operationIds ?? []).filter((item) => item !== operationId),
					},
				}
			: node
	)
}

const createOperation = (id: string, operation: Omit<OperationDefinition, 'id'>) => {
	const newOperation = { ...operation, id: `custom-operation-${nextOperationId++}` }
	operations.value.push(newOperation)
	assignOperations(id, [newOperation.id])
}

const addNode = () => {
	const addedNodesCount = nodes.value.length - 3
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

const defaultEdgeOptions = computed(() => ({
	style: { strokeWidth: 2 },
	markerEnd: MarkerType.ArrowClosed,
	type: selectedEdgeType.value,
}))

const edges = ref<Edge<StateEdgeData>[]>([
	{ ...defaultEdgeOptions.value, id: 'start-state', source: 'start', target: 'state' },
	{ ...defaultEdgeOptions.value, id: 'state-end', source: 'state', target: 'end' },
])

const addConnection = (connection: Connection) => {
	const exists = edges.value.some(
		(edge) =>
			edge.source === connection.source &&
			edge.target === connection.target &&
			edge.sourceHandle === connection.sourceHandle &&
			edge.targetHandle === connection.targetHandle
	)
	if (exists) return

	edges.value = [
		...edges.value,
		{ ...defaultEdgeOptions.value, ...connection, id: `edge-${nextEdgeId++}` },
	]
}

watch(selectedEdgeType, (type) => {
	edges.value = edges.value.map((edge) => ({ ...edge, type }))
	try {
		window.localStorage.setItem(edgeTypeStorageKey, type)
	} catch {
		// Keep the selected style active for this session when storage is unavailable.
	}
})

const selectedEdge = computed(
	() => edges.value.find((edge) => edge.id === selectedEdgeId.value) ?? null
)

const saveEdgeLabel = (id: string, label: string, translations: NameTranslations) => {
	edges.value = edges.value.map((edge) =>
		edge.id === id
			? { ...edge, label, data: { ...edge.data, nameTranslations: translations } }
			: edge
	)
}

const hei = computed(() => {
	return 'height: ' + (window.innerHeight - 180) + 'px;'
})
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
							q-btn(
								fab
								color="primary"
								icon="add"
								aria-label="Добавить узел"
								title="Добавить узел"
								:disable="!isInteractive"
								@click="addNode"
							)
						Panel(position="bottom-left")
							q-btn(
								flat
								round
								color="primary"
								icon="mdi-cog"
								aria-label="Настройки типа связей"
								title="Настройки типа связей"
							)
								q-menu(anchor="top left" self="bottom left")
									.text-bold.text-center Тип связи
									q-list(dense)
										q-item(
											v-for="option in edgeTypeOptions"
											:key="option.value"
											clickable
											v-close-popup
											@click="selectedEdgeType = option.value"
										)
											q-item-section {{ option.label }}
											q-item-section(side)
												q-icon(v-if="selectedEdgeType === option.value" name="mdi-check" color="primary")
			template(v-slot:after)
				.properties
					StatePropertiesPanel(
						:node="selectedNode"
						:edge="selectedEdge"
						:operations="operations"
						@save:node-label="saveNodeLabel"
						@save:edge-label="saveEdgeLabel"
						@assign-operations="assignOperations"
						@remove-operation="removeOperation"
						@create-operation="createOperation"
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
