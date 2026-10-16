<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { MarkerType, VueFlow, useVueFlow } from '@vue-flow/core'
import type { Connection, Edge, Node, NodeDragEvent } from '@vue-flow/core'
import { Background, Controls, PanelPosition } from '@vue-flow/additional-components'
import type { WorkflowInstance, WorkflowTemplate } from '@/composables/useWorkflowPrototype'
import LucideWorkflow from '@/components/icons/LucideWorkflow.vue'
import WordHighlighter from 'vue-word-highlighter'
import type { EdgeType } from '../states/types'
import { nodeSelectionRequest, selectedNode } from './singleMonitorLayoutState'

const props = defineProps<{
	instance: WorkflowInstance
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
const { addSelectedNodes, findNode, removeSelectedElements, screenToFlowCoordinate } = useVueFlow()

watch(
	() => [props.instance.id, props.template.id],
	() => {
		flowNodes.value = JSON.parse(JSON.stringify(props.template.nodes)) as Node[]
		flowEdges.value = JSON.parse(JSON.stringify(props.template.edges)) as Edge[]
	},
	{ immediate: true },
)

watch(nodeSelectionRequest, (request) => {
	if (request) selectNode(request.id)
})

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
	return flowNodes.value.filter((node) => String(node.data.label ?? '').toLocaleLowerCase().includes(query))
})
const progress = computed(() => {
	const currentNode = flowNodes.value.find(
		(node) => String(node.data.label ?? '') === props.instance.currentStep
	)
	const completedIds = new Set<string>()
	if (currentNode) {
		const pending = [currentNode.id]
		const visited = new Set<string>()
		while (pending.length) {
			const target = pending.pop()
			if (!target || visited.has(target)) continue
			visited.add(target)
			for (const edge of flowEdges.value) {
				if (edge.target === target && edge.source !== currentNode.id) {
					completedIds.add(edge.source)
					pending.push(edge.source)
				}
			}
		}
	}
	const nodes: Node[] = flowNodes.value.map((node) => {
		const states: string[] = []
		if (props.instance.status === 'Завершен успешно') states.push('process-step-completed')
		else if (props.instance.status === 'Приостановлен из-за ошибки' && node.id === currentNode?.id)
			states.push('process-step-error')
		else if (completedIds.has(node.id)) states.push('process-step-passed')
		else if (node.id === currentNode?.id) {
			if (props.instance.status === 'Активен') states.push('process-step-current')
			else if (props.instance.status === 'Остановлен' || props.instance.status === 'Приостановлен')
				states.push('process-step-interrupted')
		}
		if (node.data?.previousPassError === true) states.push('process-step-previous-error')
		if (node.data?.warning === true) states.push('process-step-warning')
		if (node.type === 'subprocess' || node.data?.linkedFunction === true)
			states.push('process-step-linked')
		return { ...node, class: [node.class, ...states].filter(Boolean).join(' ') }
	})
	const edges: Edge[] = flowEdges.value.map((edge) => ({ ...edge, type: props.edgeType }))
	return { nodes, edges }
})

function onDrop(event: DragEvent) {
	const serializedNode = event.dataTransfer?.getData('application/x-mercury-process-node')
		|| event.dataTransfer?.getData('text/plain')
	if (!serializedNode) return

	let label: unknown
	try {
		label = (JSON.parse(serializedNode) as { label?: unknown }).label
	} catch {
		return
	}
	if (typeof label !== 'string' || !label.trim()) return

	let sequence = flowNodes.value.length + 1
	while (flowNodes.value.some((node) => node.id === `library-node-${sequence}`)) sequence += 1

	const node: Node = {
		id: `library-node-${sequence}`,
		type: 'default',
		position: screenToFlowCoordinate({ x: event.clientX, y: event.clientY }),
		data: { label },
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
	emit('selection-change', node)
}

function selectNodeFromSearch(id: string) {
	selectNode(id)
	nodeSearch.value = ''
}

function onNodeDragStop({ node }: NodeDragEvent) {
	flowNodes.value = flowNodes.value.map((existing) => existing.id === node.id
		? { ...existing, position: { ...node.position } }
		: existing)
}

function onConnect(connection: Connection) {
	if (!connection.source || !connection.target) return

	let sequence = flowEdges.value.length + 1
	while (flowEdges.value.some((edge) => edge.id === `canvas-edge-${sequence}`)) sequence += 1

	flowEdges.value = [...flowEdges.value, {
		...connection,
		id: `canvas-edge-${sequence}`,
		type: props.edgeType,
		style: { strokeWidth: 2 },
		markerEnd: MarkerType.ArrowClosed,
	}]
}
</script>

<template lang="pug">
.workflow-instance-canvas
	.flow-map(@dragover.prevent @drop.prevent="onDrop")
		VueFlow(:nodes="progress.nodes" :edges="progress.edges" :default-edge-options="defaultEdgeOptions" fit-view-on-init :min-zoom="0.3" :max-zoom="1.5" :nodes-draggable="true" :nodes-connectable="true" :elements-selectable="true" @node-click="emit('selection-change', $event.node)" @node-drag-stop="onNodeDragStop" @connect="onConnect" @pane-click="emit('selection-change', null)")
			Background(:gap="16" :size="1" pattern-color="#9aa9b5")
			Controls(:position="PanelPosition.BottomRight")
				template(v-slot:top)
					q-btn.vue-flow__controls-button(flat dense color="primary" icon="mdi-magnify")
						q-tooltip(anchor="top middle" self="bottom middle") Найти узел
						q-menu(anchor="bottom right" self="top right" :offset="[0, 8]")
							.node-search-menu
								q-input.q-mb-sm(v-model="nodeSearch" dense filled clearable autofocus placeholder="Найти узел")
								q-list.node-search-menu__list(dense)
									q-item(v-for="node in filteredNodes" :key="node.id" clickable :class="{ 'is-selected': selectedNode?.id === node.id }" v-close-popup @click="selectNodeFromSearch(node.id)")
										q-item-section(side)
											LucideWorkflow.node-search-menu__icon
										q-item-section
											WordHighlighter(:query="nodeSearch ?? ''") {{ node.data.label ?? 'Без названия' }}
									.text-caption.text-grey-7.q-pa-sm(v-if="filteredNodes.length === 0") Ничего не найдено
				template(v-slot:default)
					q-btn.vue-flow__controls-button(flat dense color="primary" icon="mdi-cog")
						q-tooltip(anchor="top middle" self="bottom middle" :offset="[0, 0]") Настройки типа связей
						q-menu(anchor="top left" self="bottom left")
							.text-bold.text-center Тип связи
							q-list(dense)
								q-item(v-for="option in edgeTypeOptions" :key="option.value" clickable v-close-popup @click="emit('edge-type-change', option.value)")
									q-item-section {{ option.label }}
									q-item-section(side)
										q-icon(v-if="props.edgeType === option.value" name="mdi-check" color="primary")
</template>

<style scoped>
.workflow-instance-canvas {
	display: flex;
	height: 100%;
	min-height: 0;
	flex-direction: column;
}
.flow-map {
	flex: 1;
	min-height: 0;
	background: var(--bg-panel);
	border-top: 1px solid var(--my-border-color);
	border-left: 1px solid var(--my-border-color);
}
.node-search-menu {
	width: 17rem;
	max-width: calc(100vw - 2rem);
	padding: 0.5rem;
}
.node-search-menu__list { max-height: 16rem; overflow-y: auto; }
.node-search-menu__list :deep(.q-item.is-selected) { background: var(--selection); }
.node-search-menu__icon { color: var(--q-primary); }
.flow-map :deep(.vue-flow__node) {
	min-width: 145px;
	padding: 12px 16px;
	border: 1px solid #93a4b5;
	border-radius: 10px;
	background: white;
	color: #263746;
	box-shadow: 0 3px 12px #1d354014;
}
.flow-map :deep(.vue-flow__node.selected) {
	outline: 2px solid var(--q-primary);
	outline-offset: 2px;
	box-shadow: 0 4px 6px rgb(0 0 0 / 52%);
}
.flow-map :deep(.vue-flow__node.process-step-completed) {
	background: #555b63;
	color: white;
}
.flow-map :deep(.vue-flow__node.process-step-passed) {
	background: #e2e5e9;
	color: #374151;
}
.flow-map :deep(.vue-flow__node.process-step-current) {
	border-color: #d6aa00;
	background: #ffe680;
	color: #483b00;
}
.flow-map :deep(.vue-flow__node.process-step-error) {
	border-color: #840032;
	background: #840032;
	color: white;
}
.flow-map :deep(.vue-flow__node.process-step-previous-error) {
	border: 2px solid #840032;
}
.flow-map :deep(.vue-flow__node.process-step-warning) {
	border: 2px solid #e0ae00;
}
.flow-map :deep(.vue-flow__node.process-step-linked) {
	background: #8660a8;
	color: white;
}
.flow-map :deep(.vue-flow__node.process-step-interrupted) {
	background: #c9e3f8;
	color: #274967;
}
.flow-map :deep(.vue-flow__controls) {
	display: flex;
	gap: 0.25rem;
	padding: 0.25rem;
	border: 1px solid var(--my-border-color);
	border-radius: 0.4rem;
	background: var(--bg-panel);
}
.flow-map :deep(.vue-flow__controls-button) {
	display: grid;
	width: 2rem;
	height: 2rem;
	place-items: center;
	border: 0;
	border-radius: 0.25rem;
	background: transparent;
	color: var(--q-primary);
	cursor: pointer;
}
.flow-map :deep(.vue-flow__controls-button:hover) {
	background: rgb(0 0 0 / 6%);
}
.flow-map :deep(.vue-flow__controls-button svg) {
	width: 1rem;
	height: 1rem;
	fill: currentColor;
}
</style>
