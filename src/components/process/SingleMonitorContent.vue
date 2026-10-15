<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Node } from '@vue-flow/core'
import { processHomePath } from '@/composables/useProcessExplorer'
import { workflowPrototype } from '@/composables/useWorkflowPrototype'
import type { EdgeType } from '../states/types'
import ProcessInstanceCanvas from './ProcessInstanceCanvas.vue'
import ProcessLogDialog from './ProcessLogDialog.vue'
import LucideWorkflow from '@/components/icons/LucideWorkflow.vue'
import { processStatusColor } from './processStatusColor'

const route = useRoute()
const router = useRouter()
const splitter = ref(72)
const homePath = computed(() => processHomePath(route.query.from))
const instanceId = computed(() =>
	String(route.query.instance ?? workflowPrototype.instances[0]?.id ?? '')
)
const instance = computed(
	() => workflowPrototype.instances.find((item) => item.id === instanceId.value) ?? null
)
const template = computed(
	() => workflowPrototype.templates.find((item) => item.id === instance.value?.templateId) ?? null
)
const statusColor = computed(() =>
	instance.value ? processStatusColor(instance.value.status) : 'blue-grey-5'
)
const selectedNode = ref<Node | null>(null)
const isProcessLogOpen = ref(false)
const edgeType = ref<EdgeType>('smoothstep')
const edgeTypeOptions: ReadonlyArray<{ label: string; value: EdgeType }> = [
	{ label: 'Кривая Безье', value: 'default' },
	{ label: 'Простая кривая', value: 'simplebezier' },
	{ label: 'Прямая', value: 'straight' },
	{ label: 'Ступенчатая', value: 'step' },
	{ label: 'Ступенчатая со скруглением', value: 'smoothstep' },
]

const editorToolGroups1 = [
	{ label: 'Базовые функции', icon: 'workflow' },
	{ label: 'Шлюз к DV', icon: 'DV' },
	{ label: 'Шлюз к файловой системе', icon: 'mdi-folder-outline' },
	{ label: 'Шлюз к почтовой системе', icon: 'mdi-email-outline' },
]
// const editorToolGroups = [
// 	[
// 		{ label: 'Начальная функция', icon: 'mdi-play-circle-outline' },
// 		{ label: 'Конечная функция', icon: 'mdi-stop-circle-outline' },
// 	],
// 	[
// 		{ label: 'Объединение И / ИЛИ', icon: 'mdi-call-merge' },
// 		{ label: 'Разветвление', icon: 'mdi-call-split' },
// 	],
// 	[
// 		{ label: 'Подпроцесс', icon: 'mdi-file-tree-outline' },
// 		{ label: 'Условие', icon: 'mdi-help-rhombus-outline' },
// 		{ label: 'Шлюзы', icon: 'mdi-gate' },
// 		{ label: 'Преднастроенные функции', icon: 'mdi-function-variant' },
// 	],
// ]

function openTemplate() {
	if (!instance.value || !template.value) return
	void router.push({
		path: '/dvmain/process/constructor',
		query: { template: instance.value.templateId, from: homePath.value },
	})
}
</script>

<template lang="pug">
.single-monitor
	.row.items-start.justify-between
		.single-monitor-heading
			.myblock(v-if="instance")
				q-icon.fold(name="mdi-source-branch")
				div
					.text-overline
						|экземпляр
						span.num {{ instance.id }}
					.zg {{ instance?.templateName ?? 'Экземпляр процесса' }}
		.single-monitor-toolbar
			.btngroup(v-if="template")
				q-btn(unelevated color="primary" label="Сохранить" size="sm")
				q-btn(outline color="primary" label="Отмена" size="sm")
				q-btn(round flat color="primary" icon="mdi-sync" size="sm")
				q-chip(size="sm" color="amber") Есть изменения
				q-chip(size="sm" color="blue-grey-3" icon="mdi-lock") Заблокировано вами
				q-btn(flat round color="negative" icon="mdi-delete-outline" size="sm")
					q-menu
						q-list
							q-item.pink(clickable)
								q-item-section Удалить

	.single-monitor-actions
		q-chip.q-mr-xl(v-if="instance" :color="statusColor" rounded textColor="white") {{ instance.status }}
		q-btn(flat dense size="sm" color="primary" icon="mdi-text-box-search-outline" label="Журнал процесса" @click="isProcessLogOpen = true")
		q-separator.action-divider(vertical)
		q-btn(flat dense size="sm" color="primary" icon="list" label="К мониторингу" :to="{ path: '/dvmain/process/monitor', query: { from: homePath } }")
		q-btn.q-mx-md(flat dense size="sm" color="primary" icon="account_tree" label="Открыть шаблон" :disable="!template" @click="openTemplate")
		q-btn(flat dense size="sm" color="primary" icon="mdi-card-account-details-outline" label="Открыть родительскую карточку")

	q-splitter.single-monitor-layout(v-model="splitter" :limits="[35, 85]")
		template(v-slot:before)
			q-card.editor-panel.flat.bordered
				.editor-toolbar
					q-btn(flat round dense color="primary" size="md" class="workflow-tool")
						LucideWorkflow
						q-tooltip(anchor="top middle" self="bottom middle" :offset="[0, 0]") Базовые функции
					q-btn(flat round dense size="md" class="dv-tool")
						span.dv-badge DV
						q-tooltip(anchor="top middle" self="bottom middle" :offset="[0, 0]") Шлюз к DV
					q-btn(v-for="tool in editorToolGroups1.slice(2)" :key="tool.label" flat round dense color="primary" size="md" :icon="tool.icon")
						q-tooltip(anchor="top middle" self="bottom middle" :offset="[0, 0]") {{ tool.label }}
					q-space
					q-btn(flat round dense color="primary" icon="mdi-cog")
						q-tooltip(anchor="bottom middle" self="top middle" :offset="[0, 0]") Настройки типа связей
						q-menu(anchor="top left" self="bottom left")
							.text-bold.text-center Тип связи
							q-list(dense)
								q-item(v-for="option in edgeTypeOptions" :key="option.value" clickable v-close-popup @click="edgeType = option.value")
									q-item-section {{ option.label }}
									q-item-section(side)
										q-icon(v-if="edgeType === option.value" name="mdi-check" color="primary")

				.editor-canvas
					ProcessInstanceCanvas(v-if="instance && template" :instance="instance" :template="template" :edge-type="edgeType" @selection-change="selectedNode = $event")
					q-card-section.text-center.text-grey-7(v-else) Шаблон процесса не найден.

		template(v-slot:after)
			q-card.properties-panel.flat.bordered
					q-card-section
						.text-subtitle2 Свойства
						.column.q-gutter-sm.q-mt-md(v-if="selectedNode")
							div ID: {{ selectedNode.id }}
							div Название: {{ selectedNode.data.label ?? 'Без названия' }}
						.q-mt-md.text-grey-7(v-else) Выберите узел на схеме.
		ProcessLogDialog(v-model="isProcessLogOpen")
</template>

<style scoped lang="scss">
.single-monitor {
	--panel-gap: 0.25rem;
}

.single-monitor-heading {
	min-width: 0;
	margin-right: 1rem;
}

.myblock {
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: stretch;
	column-gap: 0.7rem;
	.text-overline {
		color: $blue-grey-6;
		line-height: 1;
	}
	svg {
		width: 35px;
		height: 35px;
		color: $secondary;
	}
}

.zg {
	font-size: 1rem;
	text-transform: uppercase;
	font-weight: 600;
	margin-top: 0.3rem;
}

.fold {
	color: $secondary;
	font-size: 2.3rem;
}

.single-monitor-toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 0.5rem;
}
.btngroup {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}
.btngroup > * {
	margin-right: 0.25rem;
}
.single-monitor-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.125rem;
	margin: 0.5rem 0 0 0;
}

.single-monitor-layout {
	height: calc(100vh - 220px);
	min-height: 360px;
}
:deep(.q-splitter__separator) {
	background-color: transparent;
}

.editor-panel,
.properties-panel {
	height: 100%;
	box-shadow: none;
	border: 1px solid var(--my-border-color);
	background: var(--bg-panel);
}

.editor-panel {
	display: flex;
	overflow: hidden;
}
.editor-toolbar {
	display: flex;
	flex: 0 0 60px;
	flex-direction: column;
	align-items: center;
	gap: 0.35rem;
	padding: 0.5rem 0.25rem;
	border-right: 1px solid var(--my-border-color);
	background: rgba(25, 80, 130, 0.06);
	padding-top: 50px;
}
.editor-tool-group {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}
.editor-toolbar :deep(.q-btn:hover) {
	background: rgba(25, 80, 130, 0.12);
}
.workflow-tool :deep(svg) {
	width: 20px;
	height: 20px;
}
.dv-badge {
	display: grid;
	width: 22px;
	height: 22px;
	place-items: center;
	border-radius: 50%;
	border: 2px solid $primary;
	background: transparent;
	color: $primary;
	font-size: 0.62rem;
	line-height: 19px;
	font-weight: 700;
}
.editor-canvas {
	flex: 1;
	min-width: 0;
}

.editor-panel {
	margin-right: var(--panel-gap);
}
.properties-panel {
	margin-left: var(--panel-gap);
}
.num {
	// color: black;
	margin-left: 1rem;
	background: var(--bgLight);
	padding: 2px 0.5rem;
	border-top: 1px solid var(--nodeborder);
	border-bottom: 1px solid var(--nodeborder);
	// font-size: 1rem;
}
.action-divider {
	background: var(--my-border-color);
	margin-left: 2rem;
	margin-right: 2rem;
}
</style>
