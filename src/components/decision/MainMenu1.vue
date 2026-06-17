<script setup lang="ts">
import { markRaw } from 'vue'
import { DockviewVue, themeLight } from 'dockview-vue'
import type { DockviewApi, DockviewReadyEvent, SerializedDockview } from 'dockview-vue'
import MainPanel from './panels/MainPanel.vue'
import LeftPanel from './panels/LeftPanel.vue'
import RightTopPanel from './panels/RightTopPanel.vue'
import RightBottomPanel from './panels/RightBottomPanel.vue'

const STORAGE_KEY = 'dv-layout-mainmenu'

const panelComponents = markRaw({
	mainPanel: MainPanel,
	leftPanel: LeftPanel,
	rightTopPanel: RightTopPanel,
	rightBottomPanel: RightBottomPanel,
}) as any

function loadDefault(api: DockviewApi) {
	api.addPanel({ id: 'main', component: 'mainPanel', title: 'Превью' })
	api.addPanel({
		id: 'left',
		component: 'leftPanel',
		title: 'Библиотека',
		position: { referencePanel: 'main', direction: 'left' },
		initialWidth: 250,
	})
	api.addPanel({
		id: 'right-top',
		component: 'rightTopPanel',
		title: 'Структура',
		position: { referencePanel: 'main', direction: 'right' },
		initialWidth: 250,
	})
	api.addPanel({
		id: 'right-bottom',
		component: 'rightBottomPanel',
		title: 'Свойства',
		position: { referencePanel: 'right-top', direction: 'below' },
	})
}

function onReady(event: DockviewReadyEvent) {
	const api = event.api

	// Загружаем сохранённый layout или дефолтный
	const saved = localStorage.getItem(STORAGE_KEY)
	if (saved) {
		try {
			api.fromJSON(JSON.parse(saved))
		} catch (e) {
			console.warn('Сохранённый layout повреждён, загружаю дефолтный', e)
			localStorage.removeItem(STORAGE_KEY)
			loadDefault(api)
		}
	} else {
		loadDefault(api)
	}

	// Сохраняем при каждом изменении, debounce 300ms
	let timer: ReturnType<typeof setTimeout>
	api.onDidLayoutChange(() => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(api.toJSON()))
		}, 300)
	})
}
</script>

<template lang="pug">
.layout-container
  DockviewVue.he(
    :components="panelComponents"
    @ready="onReady"
		:theme="themeLight"
  )
</template>

<style scoped lang="scss">
.layout-container {
	width: 100%;
	height: calc(100vh - 77px);
}
.he {
	height: 100% !important;
}
:deep(.dockview-theme-light) {
	// --dv-group-view-background-color: transparent;
}
.layout-container {
	--dv-tab-group-color-grey: red;
}
</style>
