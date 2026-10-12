<script setup lang="ts">
import { computed, ref } from 'vue'
import { MarkerType, Panel, VueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'
import { Background, Controls, PanelPosition } from '@vue-flow/additional-components'
import type { WorkflowInstance, WorkflowTemplate } from '@/composables/useWorkflowPrototype'
import type { EdgeType } from '../states/types'

const props = defineProps<{ instance: WorkflowInstance; template: WorkflowTemplate }>()
const emit = defineEmits<{ 'selection-change': [node: Node | null] }>()
const edgeType = ref<EdgeType>('smoothstep')
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
	type: edgeType.value,
}))
const legendItems = [
	{ color: 'not-started', description: 'Исполнение функции не началось.' },
	{
		color: 'executing',
		description: 'Функция исполняется в момент просмотра карточки бизнес-процесса.',
	},
	{ color: 'completed', description: 'Функция успешно завершена.' },
	{ color: 'passed', description: 'Функция успешно выполнена, но не завершена.' },
	{ color: 'error', description: 'Функция остановлена по ошибке.' },
	{
		color: 'previous-error',
		description: 'При выполнении функции в предыдущем проходе произошла ошибка.',
	},
	{ color: 'warning', description: 'При выполнении функции было получено предупреждение.' },
	{ color: 'linked', description: 'Функция находится в состоянии «Завершена связанной функцией».' },
	{ color: 'interrupted', description: 'Функция находится в состоянии «Прервана».' },
]

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
	const edges: Edge[] = props.template.edges.map((edge) => ({ ...edge }))
	return { nodes, edges }
})
</script>

<template lang="pug">
.workflow-instance-canvas
	.row.items-center.justify-between.q-px-md.q-py-sm
		.text-subtitle2 Редактор экземпляра {{ instance.id }}
		.row.items-center.q-gutter-xs
			q-btn(flat dense size="sm" color="positive" icon="mdi-play" label="Старт")
			q-btn(flat dense size="sm" color="primary" icon="mdi-pause" label="Пауза")
			q-btn(flat dense size="sm" color="negative" icon="mdi-stop" label="Стоп")
		.row.items-center.q-gutter-md.text-caption.text-grey-7
			q-btn(flat dense color="primary" icon="mdi-shape-outline" label="Легенда" size='sm')
				q-menu(anchor="bottom right" self="top right")
					q-card.legend-menu
						q-card-section.q-py-sm.text-subtitle2 Легенда
						q-separator
						q-list(dense)
							q-item(v-for="item in legendItems" :key="item.color" dense)
								q-item-section(side)
									.legend-swatch(:class="`legend-swatch--${item.color}`")
								q-item-section {{ item.description }}
	.flow-map
		VueFlow(:nodes="progress.nodes" :edges="progress.edges" :default-edge-options="defaultEdgeOptions" fit-view-on-init :min-zoom="0.3" :max-zoom="1.5" :nodes-draggable="false" :nodes-connectable="false" :elements-selectable="true" @node-click="emit('selection-change', $event.node)" @pane-click="emit('selection-change', null)")
			Background(:gap="16" :size="1" pattern-color="#9aa9b5")
			Controls(:position="PanelPosition.TopRight")
			Panel(position="bottom-left")
				q-btn(flat round color="primary" icon="mdi-cog" title="Настройки типа связей")
					q-menu(anchor="top left" self="bottom left")
						.text-bold.text-center Тип связи
						q-list(dense)
							q-item(v-for="option in edgeTypeOptions" :key="option.value" clickable v-close-popup @click="edgeType = option.value")
								q-item-section {{ option.label }}
								q-item-section(side)
									q-icon(v-if="edgeType === option.value" name="mdi-check" color="primary")
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
.legend-menu {
	/* width: min(460px, calc(100vw - 32px)); */
	font-size: 0.7rem;
}
.legend-swatch {
	width: 1rem;
	height: 1rem;
	border: 1px solid #aab2ba;
	border-radius: 3px;
}
.legend-swatch--not-started {
	background: white;
}
.legend-swatch--executing {
	background: #ffe680;
	border-color: #d6aa00;
}
.legend-swatch--completed {
	background: #555b63;
	border-color: #555b63;
}
.legend-swatch--passed {
	background: #e2e5e9;
	border-color: #c4c9cf;
}
.legend-swatch--error {
	background: #840032;
	border-color: #840032;
}
.legend-swatch--previous-error {
	background: white;
	border: 2px solid #840032;
}
.legend-swatch--warning {
	background: white;
	border: 2px solid #e0ae00;
}
.legend-swatch--linked {
	background: #8660a8;
	border-color: #8660a8;
}
.legend-swatch--interrupted {
	background: #c9e3f8;
	border-color: #9ac8eb;
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
