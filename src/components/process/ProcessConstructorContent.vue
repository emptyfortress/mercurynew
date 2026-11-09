<script setup lang="ts">
import { markRaw, onBeforeUnmount, ref, watch } from 'vue'
import {
	DockviewVue,
	themeLight,
	type DockviewApi,
	type DockviewReadyEvent,
	type VueComponent,
} from 'dockview-vue'
import { useRoute } from 'vue-router'
import ProcessSettingsPanel from './TemplateProcessSettingsPanel.vue'
import LibraryPanel from './TemplateLibraryPanel.vue'
import EditorPanel from './TemplateEditorPanel.vue'
import EditorTab from './TemplateEditorTab.vue'
import NodeSettingsPanel from './TemplateNodeSettingsPanel.vue'
import { openTemplate, template, templateOpenRequest } from './templateConstructorState'
import TemplatesPanel from './TemplateTreePanel.vue'
import CharmNut from '@/components/icons/CharmNut.vue'

const route = useRoute()
const visiblePanelIds = ref<string[]>([])
const LAYOUT_STORAGE_KEY = 'dv-layout-template-constructor-v1'
let dockviewApi: DockviewApi | null = null
let layoutSubscription: ReturnType<DockviewApi['onDidLayoutChange']> | null = null
let highlightedProcessGroup: HTMLElement | null = null
let processHighlightTimeout: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => {
	clearProcessPanelHighlight()
	saveLayout()
	layoutSubscription?.dispose()
	dockviewApi = null
})

watch(
	() => route.query.template,
	(id) => {
		openTemplate(typeof id === 'string' ? id : '')
	},
	{ immediate: true }
)

watch(templateOpenRequest, openEditor)

// Dockview uses a broader component constructor type than Vue SFC inference.
const panelComponents = markRaw({
	constructorProcessSettings: ProcessSettingsPanel,
	constructorTemplates: TemplatesPanel,
	constructorLibrary: LibraryPanel,
	constructorEditor: EditorPanel,
	constructorNodeSettings: NodeSettingsPanel,
}) as unknown as Record<string, VueComponent>
const tabComponents = markRaw({ constructorEditorHeader: EditorTab }) as unknown as Record<
	string,
	VueComponent
>

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
		id: 'templates',
		component: 'constructorTemplates',
		title: 'Шаблоны',
		position: { referencePanel: 'library', direction: 'above' },
		initialHeight: 320,
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
		position: { referencePanel: 'node', direction: 'below' },
	},
]

function loadDefault(api: DockviewApi) {
	for (const panel of panelDefinitions) {
		if (panel.id !== 'process') api.addPanel(panel)
	}
}

function syncVisiblePanels() {
	visiblePanelIds.value = dockviewApi?.panels.map((panel) => panel.id) ?? []
}

function togglePanel(id: string) {
	if (!dockviewApi) return
	const existingPanel = dockviewApi.getPanel(id)
	if (existingPanel) {
		if (id === 'process') clearProcessPanelHighlight()
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
						? {
								referencePanel: fallbackPanel.id,
								direction:
									id === 'editor' || id === 'library' || id === 'templates' ? 'left' : 'right',
							}
						: undefined,
		})
	}
	saveLayout()
}

function openEditor() {
	if (!dockviewApi || !template.value) return
	if (!dockviewApi.getPanel('editor')) togglePanel('editor')
	dockviewApi.getPanel('editor')?.api.setActive()
}

function clearProcessPanelHighlight() {
	clearTimeout(processHighlightTimeout)
	processHighlightTimeout = undefined
	highlightedProcessGroup?.classList.remove('process-properties-highlight')
	highlightedProcessGroup = null
}

function openProcessProperties() {
	if (!dockviewApi) return
	if (!dockviewApi.getPanel('process')) togglePanel('process')
	const panel = dockviewApi.getPanel('process')
	if (!panel) return
	panel.api.setActive()
	clearProcessPanelHighlight()
	highlightedProcessGroup = panel.group.element
	// Повторное нажатие запускает подсветку заново.
	void highlightedProcessGroup.offsetWidth
	highlightedProcessGroup.classList.add('process-properties-highlight')
	processHighlightTimeout = setTimeout(clearProcessPanelHighlight, 1500)
}

function onReady(event: DockviewReadyEvent) {
	dockviewApi = event.api
	let restored = false
	try {
		const saved = localStorage.getItem(LAYOUT_STORAGE_KEY)
		if (saved) {
			dockviewApi.fromJSON(JSON.parse(saved))
			dockviewApi.getPanel('node')?.api.setTitle('Свойства')
			restored = true
		}
	} catch (error) {
		console.warn('Не удалось восстановить расположение панелей', error)
	}
	if (!restored) {
		dockviewApi.clear()
		loadDefault(dockviewApi)
	}
	if (!dockviewApi.getPanel('templates')) togglePanel('templates')
	dockviewApi.getPanel('templates')?.api.setActive()
	openEditor()
	layoutSubscription = dockviewApi.onDidLayoutChange(saveLayout)
	saveLayout()
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
	clearProcessPanelHighlight()
	dockviewApi.clear()
	loadDefault(dockviewApi)
	saveLayout()
}
</script>

<template lang="pug">
.template-constructor
	.row.items-start.justify-between
		.template-constructor-heading
			.myblock
				q-icon.fold(name="mdi-source-branch")
				div
					.zg {{ template?.name ?? 'Конструктор шаблонов' }}
		.template-constructor-toolbar
			.btngroup
				q-btn(
					flat
					dense
					size="sm"
					color="primary"
					icon="mdi-view-dashboard-outline"
					label="Панели"
				)
					q-menu(@before-show="syncVisiblePanels")
						q-list
							q-item(
								v-for="panel in panelDefinitions"
								:key="panel.id"
								tag="label"
								dense
							)
								q-item-section
									q-checkbox(
										:model-value="visiblePanelIds.includes(panel.id)"
										:label="panel.title"
										dense
										@update:model-value="togglePanel(panel.id)"
									)
							q-separator
							q-item(
								clickable
								v-close-popup
								@click="restoreDefaultLayout"
							)
								q-item-section Восстановить панели по умолчанию
				q-separator.action-divider(vertical)
				q-btn(
					unelevated
					color="primary"
					label="Сохранить"
					size="sm"
				)
				q-btn(
					outline
					color="primary"
					label="Отмена"
					size="sm"
				)
				q-btn(
					round
					flat
					color="primary"
					icon="mdi-sync"
					size="sm"
				)
				q-chip(
					size="sm"
					color="amber"
				) Есть изменения
				q-chip(
					size="sm"
					color="blue-grey-3"
					icon="mdi-lock"
				) Заблокировано вами
				q-btn(
					flat
					round
					color="negative"
					icon="mdi-delete-outline"
					size="sm"
				)
					q-menu
						q-list
							q-item.pink(clickable)
								q-item-section Удалить

	.template-constructor-actions
		q-chip(
			color="blue-grey"
			rounded
			text-color="white"
		) Шаблон

		q-btn.process-properties-button(
			flat
			dense
			size="sm"
			color="primary"
			@click="openProcessProperties"
		)
			CharmNut.process-properties-button__icon.q-mr-sm
			span Свойства процесса
		q-separator.action-divider(vertical)
		q-btn(
			unelevated
			dense
			size="sm"
			color="positive"
			icon="mdi-play"
			label="Запустить экземпляр"
			to="/dvmain/process/monitor?from=/dvmain/process"
		)

	.template-constructor-layout
		DockviewVue.dockview-area(
			:components="panelComponents"
			:tab-components="tabComponents"
			:theme="themeLight"
			single-tab-mode="fullwidth"
			@ready="onReady"
		)
</template>

<style src="./ProcessConstructorContent.scss" lang="scss"></style>
