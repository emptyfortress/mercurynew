<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
	MarkerType,
	VueFlow,
	useVueFlow,
	type Connection,
	type Edge,
	type EdgeChange,
	type Node,
	type NodeChange,
	type NodeDragEvent,
} from '@vue-flow/core'
import { Background, Controls, PanelPosition } from '@vue-flow/additional-components'
import type { WorkflowTemplate } from '@/composables/useWorkflowPrototype'
import LucideWorkflow from '@/components/icons/LucideWorkflow.vue'
import WordHighlighter from 'vue-word-highlighter'
import ProcessDiagramNode from './ProcessDiagramNode.vue'
import type { EdgeType } from '../states/types'
import { selectedNode } from './templateConstructorState'

const props = defineProps<{
	template: WorkflowTemplate
	edgeType: EdgeType
}>()
const emit = defineEmits<{
	'selection-change': [node: Node | null]
	'edge-type-change': [edgeType: EdgeType]
}>()
const flowNodes = ref<Node[]>([])
const flowEdges = ref<Edge[]>([])
const nodeSearch = ref<string | null>('')
const {
	addSelectedNodes,
	findNode,
	getSelectedNodes,
	getSelectedEdges,
	removeSelectedElements,
	screenToFlowCoordinate,
} = useVueFlow()
const hasSelection = computed(
	() => getSelectedNodes.value.length > 0 || getSelectedEdges.value.length > 0
)

onBeforeUnmount(() => emit('selection-change', null))

// The canvas is keyed by template ID. Graph edits belong to this template throughout its lifetime.
flowNodes.value = JSON.parse(JSON.stringify(props.template.nodes)) as Node[]
flowEdges.value = JSON.parse(JSON.stringify(props.template.edges)) as Edge[]
watch(
	[flowNodes, flowEdges],
	() => {
		props.template.nodes = flowNodes.value.map((node) => ({
			id: node.id,
			type: node.type,
			position: { ...node.position },
			data: JSON.parse(JSON.stringify(node.data)),
			...(node.width ? { width: node.width } : {}),
			...(node.height ? { height: node.height } : {}),
		}))
		props.template.edges = JSON.parse(JSON.stringify(flowEdges.value)) as Edge[]
		props.template.updatedAt = 'Только что'
	},
	{ deep: true, flush: 'sync' }
)

const edgeTypeOptions: ReadonlyArray<{ label: string; value: EdgeType }> = [
	{ label: 'Кривая Безье', value: 'default' },
	{ label: 'Простая кривая', value: 'simplebezier' },
	{ label: 'Прямая', value: 'straight' },
	{ label: 'Ступенчатая', value: 'step' },
	{ label: 'Ступенчатая со скруглением', value: 'smoothstep' },
]
const defaultEdgeOptions = computed(() => ({
	style: { strokeWidth: 2 },
	markerEnd: MarkerType.ArrowClosed,
	type: props.edgeType,
}))
const filteredNodes = computed(() => {
	const query = (nodeSearch.value ?? '').trim().toLocaleLowerCase()
	return flowNodes.value.filter((node) =>
		String(node.data.label ?? '')
			.toLocaleLowerCase()
			.includes(query)
	)
})
const progress = computed(() => ({
	nodes: flowNodes.value,
	edges: flowEdges.value.map((edge) => ({ ...edge, type: props.edgeType })),
}))

function onDrop(event: DragEvent) {
	const serializedNode =
		event.dataTransfer?.getData('application/x-mercury-process-node') ||
		event.dataTransfer?.getData('text/plain')
	if (!serializedNode) return

	let droppedNode: { id?: unknown; label?: unknown; shape?: unknown }
	try {
		droppedNode = JSON.parse(serializedNode) as { id?: unknown; label?: unknown; shape?: unknown }
	} catch {
		return
	}
	const label = droppedNode.label
	if (typeof label !== 'string' || !label.trim()) return
	const libraryType = typeof droppedNode.id === 'string' ? droppedNode.id : undefined
	const shape =
		droppedNode.shape === 'gateway' ||
		droppedNode.shape === 'exchange' ||
		droppedNode.shape === 'diamond'
			? droppedNode.shape
			: 'standard'

	let sequence = flowNodes.value.length + 1
	while (flowNodes.value.some((node) => node.id === `library-node-${sequence}`)) sequence += 1

	const node: Node = {
		id: `library-node-${sequence}`,
		type: 'default',
		position: screenToFlowCoordinate({ x: event.clientX, y: event.clientY }),
		data: { label, libraryType, shape },
	}
	flowNodes.value = [...flowNodes.value, node]
	void nextTick(() => {
		selectNode(node.id)
	})
}

function selectNode(id: string) {
	const node = findNode(id)
	if (!node) return
	removeSelectedElements()
	addSelectedNodes([node])
	emit('selection-change', flowNodes.value.find((item) => item.id === node.id) ?? null)
}

function selectNodeFromSearch(id: string) {
	selectNode(id)
	nodeSearch.value = ''
}

function onNodesChange(changes: NodeChange[]) {
	const removedIds = new Set(
		changes.filter((change) => change.type === 'remove').map((change) => change.id)
	)
	if (!removedIds.size) return
	flowNodes.value = flowNodes.value.filter((node) => !removedIds.has(node.id))
	flowEdges.value = flowEdges.value.filter(
		(edge) => !removedIds.has(edge.source) && !removedIds.has(edge.target)
	)
	if (selectedNode.value && removedIds.has(selectedNode.value.id)) {
		emit('selection-change', null)
	}
}

function onEdgesChange(changes: EdgeChange[]) {
	const removedIds = new Set(
		changes.filter((change) => change.type === 'remove').map((change) => change.id)
	)
	if (!removedIds.size) return
	flowEdges.value = flowEdges.value.filter((edge) => !removedIds.has(edge.id))
}

function deleteSelection() {
	const nodeIds = getSelectedNodes.value.map((node) => node.id)
	const edgesToRemove: EdgeChange[] = getSelectedEdges.value.map((edge) => ({
		type: 'remove',
		id: edge.id,
		source: edge.source,
		target: edge.target,
		sourceHandle: edge.sourceHandle ?? null,
		targetHandle: edge.targetHandle ?? null,
	}))
	onNodesChange(nodeIds.map((id) => ({ type: 'remove', id })))
	onEdgesChange(edgesToRemove)
	removeSelectedElements()
	emit('selection-change', null)
}

function onNodeDragStop({ node, nodes }: NodeDragEvent) {
	const movedNodes = new Map(
		(nodes?.length ? nodes : [node]).map((item) => [item.id, item.position])
	)
	flowNodes.value = flowNodes.value.map((existing) => {
		const position = movedNodes.get(existing.id)
		return position ? { ...existing, position: { ...position } } : existing
	})
}

function onNodeResizeEnd(size: {
	id: string
	x: number
	y: number
	width: number
	height: number
}) {
	flowNodes.value = flowNodes.value.map((node) =>
		node.id === size.id
			? { ...node, position: { x: size.x, y: size.y }, width: size.width, height: size.height }
			: node
	)
}

function onConnect(connection: Connection) {
	if (!connection.source || !connection.target) return

	let sequence = flowEdges.value.length + 1
	while (flowEdges.value.some((edge) => edge.id === `canvas-edge-${sequence}`)) sequence += 1

	flowEdges.value = [
		...flowEdges.value,
		{
			...connection,
			id: `canvas-edge-${sequence}`,
			type: props.edgeType,
			style: { strokeWidth: 2 },
			markerEnd: MarkerType.ArrowClosed,
		},
	]
}
</script>

<template lang="pug">
.workflow-instance-canvas
	.flow-map(
		@dragover.prevent
		@drop.prevent="onDrop"
	)
		VueFlow(
			:nodes="progress.nodes"
			:edges="progress.edges"
			:default-edge-options="defaultEdgeOptions"
			fit-view-on-init
			:min-zoom="0.3"
			:max-zoom="1.5"
			:nodes-draggable="true"
			:nodes-connectable="true"
			:elements-selectable="true"
			:delete-key-code="['Backspace', 'Delete']"
			@nodes-change="onNodesChange"
			@edges-change="onEdgesChange"
			@node-click="selectNode($event.node.id)"
			@node-drag-stop="onNodeDragStop"
			@selection-drag-stop="onNodeDragStop"
			@edge-click="emit('selection-change', null)"
			@connect="onConnect"
			@pane-click="emit('selection-change', null)"
		)
			template(v-slot:node-default="{ id, data, type, selected }")
				ProcessDiagramNode(
					:id="id"
					:data="data"
					:type="type"
					:selected="selected"
					@resize-end="onNodeResizeEnd"
				)
			template(v-slot:node-input="{ id, data, type, selected }")
				ProcessDiagramNode(
					:id="id"
					:data="data"
					:type="type"
					:selected="selected"
					@resize-end="onNodeResizeEnd"
				)
			template(v-slot:node-output="{ id, data, type, selected }")
				ProcessDiagramNode(
					:id="id"
					:data="data"
					:type="type"
					:selected="selected"
					@resize-end="onNodeResizeEnd"
				)
			Background(
				:gap="16"
				:size="1"
				pattern-color="#9aa9b5"
			)
			Controls(:position="PanelPosition.BottomRight")
				template(v-slot:top)
					q-btn.vue-flow__controls-button(
						flat
						dense
						color="primary"
						icon="mdi-magnify"
					)
						q-tooltip(
							anchor="top middle"
							self="bottom middle"
						) Найти узел
						q-menu(
							anchor="bottom right"
							self="top right"
							:offset="[0, 8]"
						)
							.node-search-menu
								q-input.q-mb-sm(
									v-model="nodeSearch"
									dense
									filled
									clearable
									autofocus
									placeholder="Найти узел"
								)
								q-list.node-search-menu__list(dense)
									q-item(
										v-for="node in filteredNodes"
										:key="node.id"
										clickable
										:class="{ 'is-selected': selectedNode?.id === node.id }"
										v-close-popup
										@click="selectNodeFromSearch(node.id)"
									)
										q-item-section(side)
											LucideWorkflow.node-search-menu__icon
										q-item-section
											WordHighlighter(:query="nodeSearch ?? ''")
												| {{ node.data.label ?? 'Без названия' }}
									.text-caption.text-grey-7.q-pa-sm(v-if="filteredNodes.length === 0")
										| Ничего не найдено
				template(v-slot:default)
					q-btn.vue-flow__controls-button(
						flat
						dense
						color="negative"
						icon="mdi-delete-outline"
						:disable="!hasSelection"
						@click="deleteSelection"
					)
						q-tooltip Удалить выделенные элементы
					q-btn.vue-flow__controls-button(
						flat
						dense
						color="primary"
						icon="mdi-cog"
					)
						q-tooltip(
							anchor="top middle"
							self="bottom middle"
							:offset="[0, 0]"
						) Настройки типа связей
						q-menu(
							anchor="top left"
							self="bottom left"
						)
							.text-bold.text-center Тип связи
							q-list(dense)
								q-item(
									v-for="option in edgeTypeOptions"
									:key="option.value"
									clickable
									v-close-popup
									@click="emit('edge-type-change', option.value)"
								)
									q-item-section {{ option.label }}
									q-item-section(side)
										q-icon(
											v-if="props.edgeType === option.value"
											name="mdi-check"
											color="primary"
										)
</template>

<style scoped src="./TemplateCanvas.scss" lang="scss"></style>
