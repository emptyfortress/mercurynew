<script setup lang="ts">
import { computed } from 'vue'
import { VueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'
import { Background, Controls } from '@vue-flow/additional-components'
import type { WorkflowInstance, WorkflowTemplate } from '@/composables/useWorkflowPrototype'

const props = defineProps<{ instance: WorkflowInstance; template: WorkflowTemplate }>()

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
		let state = ''
		if (props.instance.status === 'Завершён') state = 'process-step-completed'
		else if (props.instance.status === 'Ошибка' && node.id === currentNode?.id) state = 'process-step-error'
		else if (completedIds.has(node.id)) state = 'process-step-completed'
		else if (node.id === currentNode?.id) state = props.instance.status === 'Остановлен'
			? 'process-step-stopped'
			: 'process-step-current'
		return { ...node, class: [node.class, state].filter(Boolean).join(' ') }
	})
	const edges: Edge[] = props.template.edges.map((edge) => ({ ...edge }))
	return { nodes, edges }
})
</script>

<template lang="pug">
.workflow-instance-canvas
	.row.items-center.justify-between.q-px-md.q-py-sm
		.text-subtitle2 Редактор экземпляра
		.row.items-center.q-gutter-md.text-caption.text-grey-7
			.row.items-center.q-gutter-xs
				.legend-dot.completed
				span Завершён
			.row.items-center.q-gutter-xs
				.legend-dot.current
				span Текущий шаг
			.row.items-center.q-gutter-xs(v-if="instance.status === 'Ошибка'")
				.legend-dot.error
				span Ошибка
	.flow-map
		VueFlow(:nodes="progress.nodes" :edges="progress.edges" fit-view-on-init :min-zoom="0.3" :max-zoom="1.5" :nodes-draggable="false" :nodes-connectable="false" :elements-selectable="false")
			Background(:gap="20" :size="1" pattern-color="#cbd5e1")
			Controls
</template>

<style scoped>
.workflow-instance-canvas { display: flex; height: 100%; min-height: 0; flex-direction: column; }
.flow-map { flex: 1; min-height: 0; background: #f8fafc; }
.flow-map :deep(.vue-flow__node) {
	min-width: 145px;
	padding: 12px 16px;
	border: 1px solid #93a4b5;
	border-radius: 10px;
	background: white;
	color: #263746;
	box-shadow: 0 3px 12px #1d354014;
}
.flow-map :deep(.vue-flow__node-input) { border-color: #55a67a; }
.flow-map :deep(.vue-flow__node-output) { border-color: #5185be; }
.flow-map :deep(.vue-flow__node.process-step-completed) {
	border-color: #218c62;
	background: #e8f5ee;
	color: #1d6247;
}
.flow-map :deep(.vue-flow__node.process-step-current) {
	border: 2px solid #2879c7;
	background: #eaf3ff;
	color: #174e83;
	box-shadow: 0 0 0 3px rgb(40 121 199 / 16%), 0 3px 12px #1d354014;
}
.flow-map :deep(.vue-flow__node.process-step-error) {
	border: 2px solid #c43c48;
	background: #fdebed;
	color: #8b2630;
	box-shadow: 0 0 0 3px rgb(196 60 72 / 14%), 0 3px 12px #1d354014;
}
.flow-map :deep(.vue-flow__node.process-step-stopped) {
	border-color: #707981;
	background: #f0f1f2;
	color: #4b545b;
}
.legend-dot { width: 0.65rem; height: 0.65rem; border-radius: 50%; }
.legend-dot.completed { background: #218c62; }
.legend-dot.current { background: #2879c7; }
.legend-dot.error { background: #c43c48; }
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
.flow-map :deep(.vue-flow__controls-button:hover) { background: rgb(0 0 0 / 6%); }
.flow-map :deep(.vue-flow__controls-button svg) { width: 1rem; height: 1rem; fill: currentColor; }
</style>
