<script setup lang="ts">
import { computed, markRaw, onBeforeUnmount, ref, watch } from 'vue'
import { DockviewVue, themeLight } from 'dockview-vue'
import type { DockviewApi, DockviewReadyEvent } from 'dockview-vue'
import { useRoute, useRouter } from 'vue-router'
import { processHomePath } from '@/composables/useProcessExplorer'
import ProcessSettingsPanel from './ConstructorProcessSettingsPanel.vue'
import LibraryPanel from './ConstructorLibraryPanel.vue'
import EditorPanel from './ConstructorEditorPanel.vue'
import EditorTab from './ConstructorEditorTab.vue'
import NodeSettingsPanel from './ConstructorNodeSettingsPanel.vue'
import {
	cancelInstanceEditing,
	instance,
	isInstanceEditing,
	saveProcessDiagram,
	setActiveInstance,
} from './singleMonitorLayoutState'
import ProcessLogPanel from './ProcessLogPanel.vue'
import ProcessLogTab from './ProcessLogTab.vue'
import { processStatusColor } from './processStatusColor'
import DockviewPanelControls from '@/components/common/DockviewPanelControls.vue'

const route = useRoute()
const router = useRouter()
const homePath = computed(() => processHomePath(route.query.from))
const statusColor = computed(() => processStatusColor(instance.value.status))
const visiblePanelIds = ref<string[]>([])
const isDockviewReady = ref(false)
const LAYOUT_STORAGE_KEY = 'dv-layout-single-monitor-v3'
const LEGACY_LAYOUT_STORAGE_KEY = 'dv-layout-single-monitor-v2'
let dockviewApi: DockviewApi | null = null
let layoutSubscription: ReturnType<DockviewApi['onDidLayoutChange']> | null = null

onBeforeUnmount(() => {
	cancelInstanceEditing()
	saveLayout()
	layoutSubscription?.dispose()
	dockviewApi = null
})

watch(
	() => String(route.query.instance ?? ''),
	(instanceId) => {
		setActiveInstance(instanceId || instance.value.id)
	},
	{ immediate: true }
)

const panelComponents = markRaw({
	constructorProcessSettings: ProcessSettingsPanel,
	constructorLibrary: LibraryPanel,
	constructorEditor: EditorPanel,
	constructorNodeSettings: NodeSettingsPanel,
	processLog: ProcessLogPanel,
}) as any
const tabComponents = markRaw({
	constructorEditorHeader: EditorTab,
	processLogHeader: ProcessLogTab,
}) as any

const panelDefinitions: Parameters<DockviewApi['addPanel']>[0][] = [
	{
		id: 'editor',
		component: 'constructorEditor',
		tabComponent: 'constructorEditorHeader',
		title: 'Редактор',
	},
	{
		id: 'library',
		component: 'constructorLibrary',
		title: 'Библиотека',
		position: { referencePanel: 'editor', direction: 'left' },
		initialWidth: 260,
	},
	{
		id: 'node',
		component: 'constructorNodeSettings',
		title: 'Свойства',
		position: { referencePanel: 'editor', direction: 'right' },
		initialWidth: 280,
	},
	{
		id: 'process',
		component: 'constructorProcessSettings',
		title: 'Процесс',
		position: { referencePanel: 'editor', direction: 'right' },
		initialWidth: 280,
	},
	{
		id: 'log',
		component: 'processLog',
		tabComponent: 'processLogHeader',
		title: 'Журнал процесса',
		position: { referencePanel: 'editor', direction: 'below' },
		initialHeight: 260,
	},
]

const panelOptions = panelDefinitions.map((panel) => ({
	id: panel.id,
	title: panel.title ?? panel.id,
}))

function loadDefault(api: DockviewApi) {
	for (const panel of panelDefinitions) {
		if (panel.id === 'editor' || panel.id === 'process' || panel.id === 'log') api.addPanel(panel)
	}
}

function syncVisiblePanels() {
	visiblePanelIds.value = dockviewApi?.panels.map((panel) => panel.id) ?? []
}

function togglePanel(id: string) {
	if (!dockviewApi) return
	const existingPanel = dockviewApi.getPanel(id)
	if (existingPanel) {
		dockviewApi.removePanel(existingPanel)
	} else {
		const definition = panelDefinitions.find((panel) => panel.id === id)
		if (!definition) return
		const position = definition.position
		const referencePanel =
			position && 'referencePanel' in position ? position.referencePanel : undefined
		const fallbackPanel = dockviewApi.getPanel('editor') ?? dockviewApi.panels[0]
		dockviewApi.addPanel({
			...definition,
			floating: false,
			position:
				typeof referencePanel === 'string' && dockviewApi.getPanel(referencePanel)
					? position
					: fallbackPanel
						? { referencePanel: fallbackPanel.id, direction: id === 'editor' || id === 'library' ? 'left' : 'right' }
						: undefined,
		})
	}
	saveLayout()
}

function onReady(event: DockviewReadyEvent) {
	dockviewApi = event.api
	let restored = false
	try {
		const currentLayout = localStorage.getItem(LAYOUT_STORAGE_KEY)
		const saved = currentLayout ?? localStorage.getItem(LEGACY_LAYOUT_STORAGE_KEY)
		if (saved) {
			const layout = JSON.parse(saved) as ReturnType<DockviewApi['toJSON']>
			if (layout.panels.log) layout.panels.log.tabComponent = 'processLogHeader'
			dockviewApi.fromJSON(layout)
			dockviewApi.getPanel('node')?.api.setTitle('Свойства')
			if (!currentLayout && !dockviewApi.getPanel('log')) togglePanel('log')
			restored = true
		}
	} catch (error) {
		console.warn('Не удалось восстановить расположение панелей', error)
	}
	if (!restored) {
		dockviewApi.clear()
		loadDefault(dockviewApi)
	}
	layoutSubscription = dockviewApi.onDidLayoutChange(saveLayout)
	saveLayout()
	isDockviewReady.value = true
}

function saveLayout() {
	if (!dockviewApi) return
	syncVisiblePanels()
	try {
		localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(dockviewApi.toJSON()))
	} catch (error) {
		console.warn('Не удалось сохранить расположение панелей', error)
	}
}

function restoreDefaultLayout() {
	if (!dockviewApi) return
	dockviewApi.clear()
	loadDefault(dockviewApi)
	saveLayout()
}

function openTemplate() {
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
			.myblock
				q-icon.fold(name="mdi-source-branch")
				div
					.text-overline
						| экземпляр
						span.num {{ instance.id }}
					.zg {{ instance.templateName }}
		.single-monitor-toolbar
			.btngroup
				template(v-if="isInstanceEditing")
					q-btn(unelevated color="primary" label="Сохранить" size="sm" @click="saveProcessDiagram")
					q-btn(outline color="primary" label="Отмена" size="sm" @click="cancelInstanceEditing")
					q-btn(round flat color="primary" icon="mdi-sync" size="sm")
					q-chip(size="sm" color="amber") Есть изменения
					q-chip(size="sm" color="blue-grey-3" icon="mdi-lock") Заблокировано вами
					q-btn(flat round color="negative" icon="mdi-delete-outline" size="sm")
						q-menu
							q-list
								q-item.pink(clickable)
									q-item-section Удалить

	.single-monitor-actions
		q-chip(:color="statusColor" rounded text-color="white") {{ instance.status }}
		q-btn(flat dense size="sm" color="primary" icon="mdi-arrow-left-top-bold" label="К мониторингу" :to="{ path: '/dvmain/process/monitor', query: { from: homePath } }")
		q-btn(flat dense size="sm" color="primary" icon="account_tree" label="Открыть шаблон" @click="openTemplate")
		q-btn(flat dense size="sm" color="primary" icon="mdi-card-account-details-outline" label="Открыть родительскую карточку")
		DockviewPanelControls(
			:panels="panelOptions"
			:visible-panel-ids="visiblePanelIds"
			:disabled="!isDockviewReady"
			@toggle="togglePanel"
			@reset="restoreDefaultLayout"
		)

	.single-monitor-layout
		DockviewVue.dockview-area(:components="panelComponents" :tab-components="tabComponents" :theme="themeLight" single-tab-mode="fullwidth" @ready="onReady")
</template>

<style lang="scss">
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
	margin-top: 0.3rem;
	font-size: 1rem;
	font-weight: 600;
	text-transform: uppercase;
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
	align-items: center;
	gap: 0.5rem 1rem;
	margin: 0.5rem 0 0;

	> .q-chip {
		margin: 0;
	}

	> .action-divider {
		margin: 0 0.5rem;
	}
}
.single-monitor-layout {
	display: flex;
	flex-direction: column;
	height: calc(100vh - 220px);
	min-height: 360px;
	border: 1px solid var(--my-border-color);
}
.dockview-area {
	flex: 1;
	min-height: 0;
}
.dockview-area .dv-tabs-and-actions-container .dv-tabs-container .dv-tab {
	padding-right: 0.5rem;
	padding-left: 0.5rem;
}
.num {
	margin-left: 1rem;
	padding: 2px 0.5rem;
	background: var(--bgLight);
	border-top: 1px solid var(--nodeborder);
	border-bottom: 1px solid var(--nodeborder);
}
.action-divider {
	margin-right: 2rem;
	margin-left: 2rem;
	background: var(--my-border-color);
}

.dv-tab .dv-default-tab {
	padding: 0 0.5rem;
	background: #c1d0e7;
	border-bottom: 1px solid var(--my-border-color);
}
.dv-default-tab-content {
	font-weight: 600;
}
.dv-vue-part {
	background: #c1d0e7;
}
</style>
