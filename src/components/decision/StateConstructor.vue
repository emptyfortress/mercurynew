<script setup lang="ts">
import { computed, ref } from 'vue'
import { MarkerType, Panel, VueFlow } from '@vue-flow/core'
import type { NodeMouseEvent } from '@vue-flow/core'
import { Background, ControlButton, Controls, PanelPosition } from '@vue-flow/additional-components'
import StatePropertiesPanel from '@/components/decision/StatePropertiesPanel.vue'

const splitterModel = ref(75)
const isInteractive = ref(true)

const nodes = ref([
	{ id: 'start', type: 'input', data: { label: 'Начало' }, position: { x: 80, y: 80 } },
	{ id: 'state', data: { label: 'Новое состояние' }, position: { x: 300, y: 180 } },
	{ id: 'end', type: 'output', data: { label: 'Завершение' }, position: { x: 540, y: 80 } },
])

let nextNodeId = 1
const selectedNodeId = ref<string | null>(null)

const selectedNode = computed(
	() => nodes.value.find((node) => node.id === selectedNodeId.value) ?? null
)

const selectNode = ({ node }: NodeMouseEvent) => {
	selectedNodeId.value = node.id
}

const clearSelection = () => {
	selectedNodeId.value = null
}

const saveNodeLabel = (id: string, label: string) => {
	nodes.value = nodes.value.map((node) =>
		node.id === id ? { ...node, data: { ...node.data, label } } : node
	)
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

const defaultEdgeOptions = {
	style: { strokeWidth: 2 },
	markerEnd: MarkerType.ArrowClosed,
}

const edges = ref([
	{ ...defaultEdgeOptions, id: 'start-state', source: 'start', target: 'state' },
	{ ...defaultEdgeOptions, id: 'state-end', source: 'state', target: 'end' },
])

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
						@edge-click="clearSelection"
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
			template(v-slot:after)
				.properties
					StatePropertiesPanel(:node="selectedNode" @save:label="saveNodeLabel")
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
