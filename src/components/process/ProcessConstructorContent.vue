<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MarkerType, addEdge } from '@vue-flow/core'
import type { Connection, Edge, Node } from '@vue-flow/core'
import {
	createTemplate,
	makeEdgeId,
	startWorkflow,
	workflowPrototype,
	type WorkflowTemplate,
} from '@/composables/useWorkflowPrototype'
import ProcessTemplateList from './ProcessTemplateList.vue'
import ProcessConstructorToolbar from './ProcessConstructorToolbar.vue'
import ProcessCanvas from './ProcessCanvas.vue'
import ProcessPropertiesPanel from './ProcessPropertiesPanel.vue'
import DeleteProcessDialog from './DeleteProcessDialog.vue'

const route = useRoute()
const router = useRouter()
const listSize = ref(15)
const canvasSize = ref(80)
const selectedId = computed(() => typeof route.query.template === 'string'
	? route.query.template
	: workflowPrototype.templates[0]?.id ?? '')
const selectedTemplate = computed(() => workflowPrototype.templates.find((template) => template.id === selectedId.value))
const draft = ref<WorkflowTemplate | null>(null)
const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])
const selectedNodeId = ref<string | null>(null)
const selectedNode = computed(() => nodes.value.find((node) => node.id === selectedNodeId.value))
const confirmDelete = ref(false)
const cloneData = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T

// VueFlow adds selection and measured geometry to graph objects. Only editor data is saved and compared.
function templateNodes(items: Node[]): Node[] {
	return items.map((node) => ({
		id: node.id,
		type: node.type ?? 'default',
		position: { x: node.position.x, y: node.position.y },
		data: cloneData(node.data),
	}))
}

function templateEdges(items: Edge[]): Edge[] {
	return items.map((edge) => ({
		id: edge.id,
		source: edge.source,
		target: edge.target,
		sourceHandle: edge.sourceHandle ?? null,
		targetHandle: edge.targetHandle ?? null,
		type: edge.type ?? 'default',
		label: edge.label ?? '',
		animated: edge.animated ?? false,
		markerEnd: edge.markerEnd,
	}))
}

function snapshot(template: WorkflowTemplate, graphNodes: Node[], graphEdges: Edge[]) {
	return JSON.stringify({
		name: template.name,
		category: template.category,
		enabled: template.enabled,
		linkedTemplateIds: template.linkedTemplateIds,
		nodes: templateNodes(graphNodes),
		edges: templateEdges(graphEdges),
	})
}

const isDirty = computed(() => Boolean(draft.value && selectedTemplate.value
	&& snapshot(draft.value, nodes.value, edges.value) !== snapshot(selectedTemplate.value, selectedTemplate.value.nodes, selectedTemplate.value.edges)))
const canSave = computed(() => Boolean(selectedTemplate.value && draft.value && isDirty.value))
const canRun = computed(() => Boolean(selectedTemplate.value?.enabled && draft.value && !isDirty.value))
const canDelete = computed(() => Boolean(selectedTemplate.value && workflowPrototype.templates.length > 1))
const linkedTemplateOptions = computed(() => workflowPrototype.templates
	.filter((template) => template.id !== selectedId.value)
	.map((template) => ({ label: template.name, value: template.id })))

const draftName = computed({
	get: () => draft.value?.name ?? '',
	set: (value: string) => { if (draft.value) draft.value.name = value },
})
const draftCategory = computed({
	get: () => draft.value?.category ?? '',
	set: (value: string) => { if (draft.value) draft.value.category = value },
})
const draftEnabled = computed({
	get: () => draft.value?.enabled ?? false,
	set: (value: boolean) => { if (draft.value) draft.value.enabled = value },
})
const draftLinkedTemplateIds = computed({
	get: () => draft.value?.linkedTemplateIds ?? [],
	set: (value: string[]) => { if (draft.value) draft.value.linkedTemplateIds = value },
})
const nodeLabel = computed({
	get: () => String(selectedNode.value?.data.label ?? ''),
	set: (value: string) => { if (selectedNode.value) selectedNode.value.data.label = value },
})

watch(selectedTemplate, (template) => {
	draft.value = template ? cloneData(template) : null
	nodes.value = template ? templateNodes(template.nodes) : []
	edges.value = template ? templateEdges(template.edges) : []
	selectedNodeId.value = null
	confirmDelete.value = false
}, { immediate: true })

function chooseTemplate(id: string) {
	void router.replace({ query: { ...route.query, template: id } })
}

function addStep() {
	if (!draft.value) return
	const id = `step-${Date.now()}`
	nodes.value.push({ id, position: { x: 300, y: 300 }, data: { label: 'Новый шаг' } })
	selectedNodeId.value = id
}

function deleteStep() {
	if (!selectedNode.value || ['input', 'output'].includes(selectedNode.value.type ?? '')) return
	const id = selectedNode.value.id
	nodes.value = nodes.value.filter((node) => node.id !== id)
	edges.value = edges.value.filter((edge) => edge.source !== id && edge.target !== id)
	selectedNodeId.value = null
}

function connectNodes(connection: Connection) {
	if (!draft.value || !connection.source || !connection.target) return
	edges.value = addEdge({ ...connection, id: makeEdgeId(), markerEnd: MarkerType.ArrowClosed }, edges.value) as Edge[]
}

function saveTemplate() {
	if (!canSave.value || !selectedTemplate.value || !draft.value) return
	Object.assign(selectedTemplate.value, {
		name: draft.value.name,
		category: draft.value.category,
		enabled: draft.value.enabled,
		linkedTemplateIds: [...draft.value.linkedTemplateIds],
		nodes: templateNodes(nodes.value),
		edges: templateEdges(edges.value),
		version: selectedTemplate.value.version + 1,
		updatedAt: 'Только что',
	})
	draft.value.version = selectedTemplate.value.version
	draft.value.updatedAt = selectedTemplate.value.updatedAt
}

function removeTemplate() {
	if (!canDelete.value) return
	const index = workflowPrototype.templates.findIndex((template) => template.id === selectedId.value)
	if (index < 0) return
	workflowPrototype.templates.splice(index, 1)
	chooseTemplate(workflowPrototype.templates[Math.max(0, index - 1)]?.id ?? '')
	confirmDelete.value = false
}

function runTemplate() {
	if (!canRun.value || !selectedTemplate.value) return
	if (startWorkflow(selectedTemplate.value)) void router.push('/dvmain/process/monitor')
}
</script>

<template lang="pug">
div
	.text-h6.text-center Конструктор процессов
	q-splitter.constructor-layout(v-model="listSize" :limits="[10, 35]")
		template(v-slot:before)
			.template-list
				q-scroll-area.full-height
					ProcessTemplateList(:templates="workflowPrototype.templates" :selected-id="selectedId" @select="chooseTemplate" @create="chooseTemplate(createTemplate())")
		template(v-slot:after)
			q-splitter.full-height(v-model="canvasSize" :limits="[45, 85]")
				template(v-slot:before)
					.editor-panel
						ProcessConstructorToolbar(:name="draftName" :version="draft?.version ?? null" :dirty="isDirty" :can-save="canSave" :can-run="canRun" :can-add-step="!!draft" @save="saveTemplate" @run="runTemplate" @add-step="addStep")
						ProcessCanvas(v-if="draft" :key="selectedId" v-model:nodes="nodes" v-model:edges="edges" v-model:selected-node-id="selectedNodeId" @connect="connectNodes")
						.empty-canvas(v-else)
							.text-grey-7 Выберите шаблон слева или создайте новый процесс.
				template(v-slot:after)
					q-scroll-area.properties-panel
						ProcessPropertiesPanel(v-model:name="draftName" v-model:category="draftCategory" v-model:enabled="draftEnabled" v-model:linked-template-ids="draftLinkedTemplateIds" v-model:node-label="nodeLabel" :draft="draft" :selected-node="selectedNode" :linked-template-options="linkedTemplateOptions" :can-delete="canDelete" @delete-step="deleteStep" @delete-template="confirmDelete = true")
	DeleteProcessDialog(v-model="confirmDelete" :can-delete="canDelete" @confirm="removeTemplate")
</template>

<style scoped>
.constructor-layout { height: calc(100vh - 180px); }
:deep(.q-splitter__separator) { background-color: transparent; }
.template-list { height: 100%; margin-right: 0.5rem; }
.editor-panel {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: 0;
	margin: 0 0.5rem;
	padding: 1rem;
	border: 1px solid var(--my-border-color);
	background: var(--bg-panel);
}
.properties-panel {
	height: 100%;
	padding: 0.5rem;
	border: 1px solid var(--my-border-color);
	background: var(--bg-panel);
}
.empty-canvas { display: grid; flex: 1; place-items: center; text-align: center; }
</style>
