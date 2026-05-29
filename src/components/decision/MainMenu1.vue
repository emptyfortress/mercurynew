<script setup lang="ts">
import { ref, onMounted, markRaw, type Component } from 'vue'
import { DockviewVue, themeLight } from 'dockview-vue'
// import type { DockviewReadyEvent } from 'dockview-core'
import type { DockviewApi, DockviewReadyEvent, SerializedDockview } from 'dockview-vue'
import MainPanel from './panels/MainPanel.vue'
import LeftPanel from './panels/LeftPanel.vue'
import RightTopPanel from './panels/RightTopPanel.vue'
import RightBottomPanel from './panels/RightBottomPanel.vue'

const panelComponents = markRaw({
	mainPanel: MainPanel,
	leftPanel: LeftPanel,
	rightTopPanel: RightTopPanel,
	rightBottomPanel: RightBottomPanel,
}) as any

function onReady(event: DockviewReadyEvent) {
	const api = event.api
	api.addPanel({ id: 'main', component: 'mainPanel', title: 'Превью' })
	api.addPanel({
		id: 'left',
		component: 'leftPanel',
		title: 'Библиотека',
		position: { referencePanel: 'main', direction: 'left' },
		initialWidth: 250,
		initialHeight: 600,
	})
	api.addPanel({
		id: 'right-top',
		component: 'rightTopPanel',
		title: 'Структура',
		position: { referencePanel: 'main', direction: 'right' },
		initialWidth: 250,
		initialHeight: 600,
	})
	api.addPanel({
		id: 'right-bottom',
		component: 'rightBottomPanel',
		title: 'Свойства',
		position: { referencePanel: 'right-top', direction: 'below' },
		initialWidth: 250,
		initialHeight: 600,
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
	--dv-group-view-background-color: transparent;
}
</style>
