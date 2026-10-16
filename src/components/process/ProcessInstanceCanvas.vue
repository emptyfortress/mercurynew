<script setup lang="ts">
import { computed } from 'vue'
import { MarkerType, Panel, VueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'
import { Background, Controls, PanelPosition } from '@vue-flow/additional-components'
import type { WorkflowInstance, WorkflowTemplate } from '@/composables/useWorkflowPrototype'
import type { EdgeType } from '../states/types'

const props = defineProps<{ instance: WorkflowInstance; template: WorkflowTemplate; edgeType: EdgeType }>()
const emit = defineEmits<{ 'selection-change': [node: Node | null] }>()
const defaultEdgeOptions = computed(() => ({
	style: { strokeWidth: 2 },
	markerEnd: MarkerType.ArrowClosed,
	type: props.edgeType,
}))
const progress = computed(() => {
	const currentNode = props.template.nodes.find(
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
			for (const edge of props.template.edges) {
				if (edge.target === target && edge.source !== currentNode.id) {
					completedIds.add(edge.source)
					pending.push(edge.source)
				}
			}
		}
	}
	const nodes: Node[] = props.template.nodes.map((node) => {
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
	const edges: Edge[] = props.template.edges.map((edge) => ({ ...edge, type: props.edgeType }))
	return { nodes, edges }
})
</script>

<template lang="pug">
.workflow-instance-canvas
	.flow-map
		VueFlow(:nodes="progress.nodes" :edges="progress.edges" :default-edge-options="defaultEdgeOptions" fit-view-on-init :min-zoom="0.3" :max-zoom="1.5" :nodes-draggable="false" :nodes-connectable="false" :elements-selectable="true" @node-click="emit('selection-change', $event.node)" @pane-click="emit('selection-change', null)")
			Background(:gap="16" :size="1" pattern-color="#9aa9b5")
			Controls(:position="PanelPosition.TopRight")
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
