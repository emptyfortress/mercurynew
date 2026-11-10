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
import DockviewPanelControls from '@/components/common/DockviewPanelControls.vue'

const route = useRoute()
const visiblePanelIds = ref<string[]>([])
const isDockviewReady = ref(false)
const treeWidth = ref(20)
const expandedTreeWidth = ref(20)
const LAYOUT_STORAGE_KEY = 'dv-layout-template-constructor-v1'
let dockviewApi: DockviewApi | null = null
let layoutSubscription: ReturnType<DockviewApi['onDidLayoutChange']> | null = null

onBeforeUnmount(() => {
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
	// Keep the component available while restoring layouts saved before the tree was moved.
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

const panelOptions = panelDefinitions.map((panel) => ({
	id: panel.id,
	title: panel.title ?? panel.id,
}))

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
								direction: id === 'editor' || id === 'library' ? 'left' : 'right',
							}
						: undefined,
		})
	}
	saveLayout()
}

function toggleTemplateTree() {
	if (treeWidth.value > 0) {
		expandedTreeWidth.value = treeWidth.value
		treeWidth.value = 0
	} else {
		treeWidth.value = expandedTreeWidth.value
	}
}

function openEditor() {
	if (!dockviewApi || !template.value) return
	if (!dockviewApi.getPanel('editor')) togglePanel('editor')
	dockviewApi.getPanel('editor')?.api.setActive()
}

function onReady(event: DockviewReadyEvent) {
	dockviewApi = event.api
	let restored = false
	try {
		const saved = localStorage.getItem(LAYOUT_STORAGE_KEY)
		if (saved) {
			dockviewApi.fromJSON(JSON.parse(saved))
			const templatesPanel = dockviewApi.getPanel('templates')
			if (templatesPanel) dockviewApi.removePanel(templatesPanel)
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
	openEditor()
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
</script>

<template lang="pug">
.template-constructor
	q-splitter.template-constructor__splitter(
		v-model="treeWidth"
		:limits="[0, 50]"
		separator-class="template-constructor__separator bg-transparent"
		after-class="template-constructor__editor-pane"
	)
		template(v-slot:before)
			.template-constructor__navigation(v-show="treeWidth > 0")
				TemplatesPanel
		template(v-slot:after)
			.template-constructor__editor
				.row.items-start.justify-between
					.template-constructor-heading.row.items-center
						q-btn(
							flat
							round
							dense
							color="primary"
							@click="toggleTemplateTree"
						)
							q-icon(
								v-if="treeWidth === 0"
								name="mdi-forwardburger"
							)
							q-icon(
								v-else
								name="mdi-backburger"
							)
						.myblock
							q-icon.fold(name="mdi-source-branch")
							div
								.zg {{ template?.name ?? 'Конструктор шаблонов' }}
					.template-constructor-toolbar
						.btngroup
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

					q-btn(
						unelevated
						dense
						size="sm"
						color="positive"
						icon="mdi-play"
						label="Запустить экземпляр"
						to="/dvmain/process/monitor?from=/dvmain/process"
					)

					DockviewPanelControls(
						:panels="panelOptions"
						:visible-panel-ids="visiblePanelIds"
						:disabled="!isDockviewReady"
						@toggle="togglePanel"
						@reset="restoreDefaultLayout"
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
