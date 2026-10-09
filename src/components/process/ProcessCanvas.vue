<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import type { Connection, Edge, Node } from '@vue-flow/core'
import { Background, Controls } from '@vue-flow/additional-components'
const nodes = defineModel<Node[]>('nodes', { required: true })
const edges = defineModel<Edge[]>('edges', { required: true })
const selectedNodeId = defineModel<string | null>('selectedNodeId', { required: true })
const emit = defineEmits<{ connect: [connection: Connection] }>()
</script>

<template lang="pug">
.workflow-canvas
	VueFlow(v-model:nodes="nodes" v-model:edges="edges" fit-view-on-init :min-zoom="0.3" :max-zoom="1.5" @connect="emit('connect', $event)" @node-click="selectedNodeId = $event.node.id" @pane-click="selectedNodeId = null")
		Background(:gap="20" :size="1" pattern-color="#cbd5e1")
		Controls
</template>

<style scoped>
.workflow-canvas { flex: 1; min-height: 0; background: #f8fafc; }
.workflow-canvas :deep(.vue-flow__node) {
	min-width: 145px;
	padding: 12px 16px;
	border: 1px solid #93a4b5;
	border-radius: 10px;
	background: white;
	color: #263746;
	box-shadow: 0 3px 12px #1d354014;
}
.workflow-canvas :deep(.vue-flow__node-input) {
	border-color: #55a67a;
}
.workflow-canvas :deep(.vue-flow__node-output) {
	border-color: #5185be;
}
.workflow-canvas :deep(.vue-flow__controls) {
	display: flex;
	gap: 0.25rem;
	padding: 0.25rem;
	border: 1px solid var(--my-border-color);
	border-radius: 0.4rem;
	background: var(--bg-panel);
}
.workflow-canvas :deep(.vue-flow__controls-button) {
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
.workflow-canvas :deep(.vue-flow__controls-button:hover) {
	background: rgb(0 0 0 / 6%);
}
.workflow-canvas :deep(.vue-flow__controls-button svg) {
	width: 1rem;
	height: 1rem;
	fill: currentColor;
}
</style>
