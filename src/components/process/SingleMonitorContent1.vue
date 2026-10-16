<script setup lang="ts">
import { computed, markRaw, ref } from 'vue'
import { DockviewVue, themeLight } from 'dockview-vue'
import type { DockviewApi, DockviewReadyEvent } from 'dockview-vue'
import { useRoute, useRouter } from 'vue-router'
import { processHomePath } from '@/composables/useProcessExplorer'
import LibraryPanel from './ConstructorLibraryPanel.vue'
import EditorPanel from './ConstructorEditorPanel.vue'
import PropertiesPanel from './ConstructorPropertiesPanel.vue'
import { instance } from './singleMonitorLayoutState'
import ProcessLogDialog from './ProcessLogDialog.vue'
import { processStatusColor } from './processStatusColor'

const route = useRoute()
const router = useRouter()
const homePath = computed(() => processHomePath(route.query.from))
const statusColor = computed(() => processStatusColor(instance.status))
const isProcessLogOpen = ref(false)
let dockviewApi: DockviewApi | null = null

const panelComponents = markRaw({
	constructorLibrary: LibraryPanel,
	constructorEditor: EditorPanel,
	constructorProperties: PropertiesPanel,
}) as any

function loadDefault(api: DockviewApi) {
	api.addPanel({ id: 'editor', component: 'constructorEditor', title: 'Редактор' })
	api.addPanel({ id: 'library', component: 'constructorLibrary', title: 'Библиотека', position: { referencePanel: 'editor', direction: 'left' }, initialWidth: 260 })
	api.addPanel({ id: 'properties', component: 'constructorProperties', title: 'Свойства', position: { referencePanel: 'editor', direction: 'right' }, initialWidth: 280 })
}

function onReady(event: DockviewReadyEvent) {
	dockviewApi = event.api
	loadDefault(dockviewApi)
}

function restoreDefaultLayout() {
	if (!dockviewApi) return
	dockviewApi.clear()
	loadDefault(dockviewApi)
}

function openTemplate() {
	void router.push({
		path: '/dvmain/process/constructor',
		query: { template: instance.templateId, from: homePath.value },
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
		q-chip.q-mr-xl(:color="statusColor" rounded text-color="white") {{ instance.status }}
		q-btn(flat dense size="sm" color="primary" icon="mdi-text-box-search-outline" label="Журнал процесса" @click="isProcessLogOpen = true")
		q-separator.action-divider(vertical)
		q-btn(flat dense size="sm" color="primary" icon="list" label="К мониторингу" :to="{ path: '/dvmain/process/monitor', query: { from: homePath } }")
		q-btn.q-mx-md(flat dense size="sm" color="primary" icon="account_tree" label="Открыть шаблон" @click="openTemplate")
		q-btn(flat dense size="sm" color="primary" icon="mdi-card-account-details-outline" label="Открыть родительскую карточку")
		q-separator.action-divider(vertical)
		q-btn(flat dense size="sm" color="primary" icon="mdi-view-dashboard-outline" label="Восстановить панели" @click="restoreDefaultLayout")

	.single-monitor-layout
		DockviewVue.dockview-area(:components="panelComponents" :theme="themeLight" @ready="onReady")
	ProcessLogDialog(v-model="isProcessLogOpen")
</template>

<style lang="scss">
.single-monitor { --panel-gap: 0.25rem; }
.single-monitor-heading { min-width: 0; margin-right: 1rem; }
.myblock {
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: stretch;
	column-gap: 0.7rem;
	.text-overline { color: $blue-grey-6; line-height: 1; }
	svg { width: 35px; height: 35px; color: $secondary; }
}
.zg { margin-top: 0.3rem; font-size: 1rem; font-weight: 600; text-transform: uppercase; }
.fold { color: $secondary; font-size: 2.3rem; }
.single-monitor-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 0.5rem; }
.btngroup { display: flex; flex-wrap: wrap; align-items: center; }
.btngroup > * { margin-right: 0.25rem; }
.single-monitor-actions { display: flex; flex-wrap: wrap; gap: 0.125rem; margin: 0.5rem 0 0; }
.single-monitor-layout {
	display: flex;
	flex-direction: column;
	height: calc(100vh - 220px);
	min-height: 360px;
}
.dockview-area { flex: 1; min-height: 0; }
.num { margin-left: 1rem; padding: 2px 0.5rem; background: var(--bgLight); border-top: 1px solid var(--nodeborder); border-bottom: 1px solid var(--nodeborder); }
.action-divider { margin-right: 2rem; margin-left: 2rem; background: var(--my-border-color); }
</style>
