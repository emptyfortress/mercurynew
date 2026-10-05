<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBreadcrumbLabel } from '@/composable/useBreadcrumbLabel'
import StatePropertiesPanel from './StatePropertiesPanel.vue'
import StateGraph from './StateGraph.vue'
import StateConnectionDialog from './StateConnectionDialog.vue'
import { useStateConstructor } from './useStateConstructor'

const route = useRoute()
const { resolveLabel } = useBreadcrumbLabel()
const title = computed(() => {
	const viewId = route.params.viewId
	return typeof viewId === 'string' && viewId ? resolveLabel(viewId) : ''
})

const splitterModel = ref(70)
const hei = computed(() => `height: ${window.innerHeight - 180}px;`)
const {
	isInteractive,
	selectedEdgeType,
	edgeTypeOptions,
	nodes,
	edges,
	operations,
	selectedNodes,
	selectedNode,
	selectedEdge,
	transitionTargets,
	selectedConnectionOperationId,
	isConnectionDialogOpen,
	pendingConnectionSource,
	pendingConnectionTarget,
	pendingConnectionOperationOptions,
	selectNode,
	selectNodeById,
	selectEdge,
	selectEdgeById,
	clearSelection,
	updateNodeProperties,
	setEdgeOperation,
	updateOperationColor,
	renameOperation,
	assignOperations,
	assignOperationsToNodes,
	unassignOperation,
	createOperationForNodes,
	createOperationForConnection,
	deleteOperation,
	addTransition,
	deleteTransition,
	addNode,
	deleteNode,
	requestConnection,
	confirmConnection,
} = useStateConstructor()
</script>

<template lang="pug">
q-page(padding)
	.container
		.row.items-center.justify-between.q-mb-sm
			.text-h6 {{ title }}
			.btngroup
				q-btn(unelevated color="primary" label="Сохранить" size="sm")
				q-btn(outline color="primary" label="Отмена" size="sm")
				q-btn(round flat color="primary" icon="mdi-sync" size="sm")
				q-chip(size="sm" color="amber") Есть изменения
				q-chip(size="sm" color="blue-grey-3" icon="mdi-lock") Заблокировано вами
				q-btn(flat round color="negative" icon="mdi-delete-outline" size="sm")
		q-splitter(v-model="splitterModel" :limits="[0, 100]" :style="hei")
			template(v-slot:before="")
				.main
					StateGraph(
						v-model:nodes="nodes"
						v-model:edges="edges"
						v-model:interactive="isInteractive"
						v-model:edge-type="selectedEdgeType"
						:edge-type-options="edgeTypeOptions"
						@node-click="selectNode"
						@pane-click="clearSelection"
						@edge-click="selectEdge"
						@connect="requestConnection"
						@add-node="addNode"
					)
			template(v-slot:after="")
				.properties
					StatePropertiesPanel(
						:node="selectedNode"
						:edge="selectedEdge"
						:selected-nodes="selectedNodes"
						:nodes="nodes"
						:edges="edges"
						:operations="operations"
						:transition-targets="transitionTargets"
						@update:node-properties="updateNodeProperties"
						@update:edge-operation="setEdgeOperation"
						@update:operation-color="updateOperationColor"
						@rename-operation="renameOperation"
						@assign-operation="assignOperations"
						@unassign-operation="unassignOperation"
						@create-operation="createOperationForNodes"
						@assign-operations="assignOperationsToNodes"
						@delete-operation="deleteOperation"
						@add-transition="addTransition"
						@delete-transition="deleteTransition"
						@add-node="addNode"
						@delete-node="deleteNode"
						@select-node="selectNodeById"
						@select-edge="selectEdgeById"
					)
	StateConnectionDialog(
		v-model="isConnectionDialogOpen"
		v-model:operation-id="selectedConnectionOperationId"
		:source-label="pendingConnectionSource?.data.label"
		:target-label="pendingConnectionTarget?.data.label"
		:options="pendingConnectionOperationOptions"
		@confirm="confirmConnection"
		@create-operation="createOperationForConnection"
	)

// TODO: Добавить пунктир на развилку

</template>

<style scoped lang="scss">
.btngroup > * {
	margin-right: 0.25rem;
}
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
	border-color: #0c471a;
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
