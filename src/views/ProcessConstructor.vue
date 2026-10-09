<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MarkerType, VueFlow, addEdge } from '@vue-flow/core'
import type { Connection, Edge, Node } from '@vue-flow/core'
import { Background, Controls } from '@vue-flow/additional-components'
import {
	createTemplate,
	makeEdgeId,
	startWorkflow,
	workflowPrototype,
	type WorkflowTemplate,
} from '@/composables/useWorkflowPrototype'

const route = useRoute()
const router = useRouter()
const selectedId = ref(String(route.query.template ?? workflowPrototype.templates[0]?.id ?? ''))
const selectedTemplate = computed(() =>
	workflowPrototype.templates.find((template) => template.id === selectedId.value)
)
const draft = ref<WorkflowTemplate | null>(null)
const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])
const selectedNodeId = ref<string | null>(null)
const isDirty = ref(false)
const confirmDelete = ref(false)
const cloneData = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const linkedTemplateOptions = computed(() =>
	workflowPrototype.templates
		.filter((template) => template.id !== selectedTemplate.value?.id)
		.map((template) => ({ label: template.name, value: template.id }))
)
const selectedNode = computed(() => nodes.value.find((node) => node.id === selectedNodeId.value))

function loadTemplate(template: WorkflowTemplate | undefined) {
	draft.value = template ? cloneData(template) : null
	nodes.value = template ? cloneData(template.nodes) : []
	edges.value = template ? cloneData(template.edges) : []
	selectedNodeId.value = null
	isDirty.value = false
}

watch(selectedId, (id) => {
	void router.replace({ query: { ...route.query, template: id } })
	loadTemplate(selectedTemplate.value)
})
watch(
	() => route.query.template,
	(id) => {
		if (typeof id === 'string' && id !== selectedId.value) {
			selectedId.value = id
		} else if (!id && selectedId.value !== workflowPrototype.templates[0]?.id) {
			selectedId.value = workflowPrototype.templates[0]?.id ?? ''
		}
	},
	{ immediate: true }
)
watch(
	[nodes, edges],
	() => {
		if (!draft.value) return
		draft.value.nodes = cloneData(nodes.value)
		draft.value.edges = cloneData(edges.value)
		isDirty.value = true
	},
	{ deep: true }
)

function chooseTemplate(id: string) {
	selectedId.value = id
}

function addStep() {
	const id = `step-${Date.now()}`
	nodes.value.push({ id, position: { x: 300, y: 300 }, data: { label: 'Новый шаг' } })
	selectedNodeId.value = id
}

function connectNodes(connection: Connection) {
	if (!connection.source || !connection.target) return
	edges.value = addEdge(
		{ ...connection, id: makeEdgeId(), markerEnd: MarkerType.ArrowClosed },
		edges.value
	) as Edge[]
}

function saveTemplate() {
	if (!selectedTemplate.value || !draft.value) return
	selectedTemplate.value.name = draft.value.name
	selectedTemplate.value.category = draft.value.category
	selectedTemplate.value.enabled = draft.value.enabled
	selectedTemplate.value.linkedTemplateIds = [...draft.value.linkedTemplateIds]
	selectedTemplate.value.nodes = cloneData(nodes.value)
	selectedTemplate.value.edges = cloneData(edges.value)
	selectedTemplate.value.version += 1
	selectedTemplate.value.updatedAt = 'Только что'
	draft.value.version = selectedTemplate.value.version
	draft.value.updatedAt = selectedTemplate.value.updatedAt
	isDirty.value = false
}

function removeTemplate() {
	if (!selectedTemplate.value || workflowPrototype.templates.length === 1) return
	const index = workflowPrototype.templates.findIndex(
		(template) => template.id === selectedId.value
	)
	workflowPrototype.templates.splice(index, 1)
	selectedId.value = workflowPrototype.templates[Math.max(0, index - 1)]?.id ?? ''
	confirmDelete.value = false
}

function runTemplate() {
	if (!selectedTemplate.value) return
	const instanceId = startWorkflow(selectedTemplate.value)
	if (instanceId) void router.push('/dvmain/process/monitor')
}

loadTemplate(selectedTemplate.value)
</script>

<template lang="pug">
q-page(padding)
	.workflow-page
		.row.items-center.justify-between.q-mb-md
			div
				.text-h5 Конструктор процессов
				.text-caption.text-grey-7 Шаблоны определяют маршрут будущих экземпляров
			.row.items-center.q-gutter-sm
				q-btn(flat color="primary" icon="mdi-glasses" label="Single monitor" to="/dvmain/process/monitorsingle")
				q-btn(flat color="primary" icon="monitor_heart" label="Мониторинг" to="/dvmain/process/monitor")
				q-btn(unelevated color="primary" icon="add" label="Новый процесс" @click="chooseTemplate(createTemplate())")

		.row.q-col-gutter-md.constructor-layout
			.col-12.col-md-3
				q-card.flat.bordered.full-height
					q-card-section.row.items-center.justify-between
						.text-subtitle1 Шаблоны
						q-badge(color="grey-3" text-color="dark") {{ workflowPrototype.templates.length }}
					q-separator
					q-list(separator)
						q-item(v-for="template in workflowPrototype.templates" :key="template.id" clickable :active="template.id === selectedId" active-class="bg-blue-1" @click="chooseTemplate(template.id)")
							q-item-section
								q-item-label {{ template.name }}
								q-item-label(caption) {{ template.category }} · v{{ template.version }}
							q-item-section(side)
								q-badge(v-if="!template.enabled" color="grey-5") Отключён
					q-card-section.text-caption.text-grey-7
						q-icon(name="folder_open" size="16px").q-mr-xs
						| Каталог шаблонов · {{ workflowPrototype.templates.length }} процессов

			.col-12.col-md-6
				q-card.flat.bordered.editor-card
					q-card-section.row.items-center.justify-between.q-gutter-sm
						q-input.template-name(v-if="draft" v-model="draft.name" dense borderless input-class="text-h6" @update:model-value="isDirty = true")
						.text-subtitle1(v-if="!draft") Выберите шаблон
						.row.items-center.q-gutter-xs
							q-chip(v-if="draft" dense color="blue-1" text-color="primary") Версия {{ draft.version }}
							q-chip(v-if="isDirty" dense color="amber-2" text-color="dark") Есть изменения
					q-separator
					.row.items-center.justify-between.q-px-md.q-pt-sm
						.text-caption.text-grey-7 Перетаскивайте шаги, чтобы настроить маршрут
						q-btn(flat dense color="primary" icon="add" label="Добавить шаг" :disable="!selectedTemplate" @click="addStep")
					.workflow-canvas
						VueFlow(v-model:nodes="nodes" v-model:edges="edges" fit-view-on-init :min-zoom="0.3" :max-zoom="1.5" @connect="connectNodes" @node-click="selectedNodeId = $event.node.id" @pane-click="selectedNodeId = null")
							Background(:gap="20" :size="1" pattern-color="#cbd5e1")
							Controls
				q-card.flat.bordered.q-mt-md(v-if="draft")
					q-card-section.row.items-center.justify-between
						div
							.text-subtitle2 Связанные процессы
							.text-caption.text-grey-7 Запускаются как отдельный шаблон внутри маршрута
						q-select(v-model="draft.linkedTemplateIds" dense outlined multiple use-chips emit-value map-options :options="linkedTemplateOptions" option-label="label" option-value="value" style="min-width: 220px" @update:model-value="isDirty = true")

			.col-12.col-md-3
				q-card.flat.bordered.full-height.property-card(v-if="draft")
					q-card-section
						.text-subtitle1 Настройки шаблона
						.text-caption.text-grey-7 {{ draft.category }} · Изменён {{ draft.updatedAt }}
					q-separator
					q-card-section
						.text-caption.text-grey-7 Название процесса
						q-input(v-model="draft.name" dense outlined @update:model-value="isDirty = true")
						.text-caption.text-grey-7.q-mt-md Группа
						q-input(v-model="draft.category" dense outlined @update:model-value="isDirty = true")
						q-toggle(v-model="draft.enabled" color="positive" label="Разрешить новые запуски" @update:model-value="isDirty = true")
						.text-caption.text-grey-7.q-mt-md Выбранный шаг
						q-input(v-if="selectedNode" v-model="selectedNode.data.label" dense outlined @update:model-value="isDirty = true")
						.text-caption.text-grey-6(v-if="!selectedNode") Выберите шаг на схеме, чтобы изменить его название.
						.row.q-gutter-sm.q-mt-sm(v-if="selectedNode && selectedNode.type !== 'input' && selectedNode.type !== 'output'")
							q-btn(flat dense color="negative" icon="delete_outline" label="Удалить шаг" @click="nodes = nodes.filter((node) => node.id !== selectedNodeId); edges = edges.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId); selectedNodeId = null")
						q-banner.bg-blue-1.text-blue-10.rounded-borders.q-mt-md(dense)
							| Запуски используют сохранённую версию шаблона. Существующие экземпляры остаются на прежней версии.
				.row.justify-between.items-center.q-mt-md
					q-btn(flat color="negative" icon="delete_outline" label="Удалить шаблон" :disable="workflowPrototype.templates.length < 2" @click="confirmDelete = true")
					.row.q-gutter-sm
						q-btn(outline color="primary" icon="save" label="Сохранить" :disable="!selectedTemplate || !isDirty" @click="saveTemplate")
						q-btn(unelevated color="positive" icon="play_arrow" label="Запустить экземпляр" :disable="!selectedTemplate || !selectedTemplate.enabled || isDirty" @click="runTemplate")

	q-dialog(v-model="confirmDelete")
		q-card
			q-card-section
				.text-h6 Удалить шаблон?
				.text-body2 Экземпляры процесса сохранят свои данные и версию шаблона.
			q-card-actions(align="right")
				q-btn(flat label="Отмена" color="primary" v-close-popup)
				q-btn(unelevated label="Удалить" color="negative" @click="removeTemplate")
</template>

<style scoped lang="scss">
.workflow-page {
	max-width: 1700px;
	margin: 0 auto;
}
.constructor-layout {
	align-items: stretch;
}
.constructor-layout > [class*='col-'] {
	display: flex;
	flex-direction: column;
}
.editor-card {
	flex: 1;
	min-height: 440px;
}
.template-name {
	min-width: 220px;
	flex: 1;
}
.workflow-canvas {
	height: 360px;
	background: #f8fafc;
}
.property-card {
	height: 100%;
}
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
@media (max-width: 1023px) {
	.property-card {
		min-height: auto;
	}
}
</style>
