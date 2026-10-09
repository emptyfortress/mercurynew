<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProcessExplorer } from '@/composables/useProcessExplorer'
import ProcessHomeFilters from './ProcessHomeFilters.vue'
import ProcessHomeBreadcrumbs from './ProcessHomeBreadcrumbs.vue'
import ProcessTreemap from './ProcessTreemap.vue'
import ProcessTemplateTable from './ProcessTemplateTable.vue'
import ProcessInstanceGrid from './ProcessInstanceGrid.vue'
const route = useRoute()
const instancesExpanded = ref(false)
const {
	section, group, grouping, templateId, templateLabel, subStatus, remainingOnly, showList, search, category, status, author,
	categoryOptions, authorOptions, statusOptions, filteredTemplates, filteredInstances,
	templateRows, instanceRows, templateZones, instanceZones, instanceTemplateZones, breadcrumbs,
	navigate, back, openTemplateGroup, openInstanceGroup, openInstanceTemplate, openInstanceChild,
	openTemplate, openInstance, clearFilters,
} = useProcessExplorer()
const groupingOptions = [{ label: 'По статусам', value: 'status' }, { label: 'По категориям', value: 'category' }]
</script>

<template lang="pug">
.process-home
	.row.items-center.justify-between.q-mb-md.q-gutter-sm
		div
			.text-h5 Процессы
			.text-caption.text-grey-7 Шаблоны и экземпляры · найдите нужную группу или откройте список
		.row.items-center.q-gutter-sm
			q-btn(flat color="primary" icon="account_tree" label="Конструктор" :to="{ path: '/dvmain/process/constructor', query: { from: route.fullPath } }")
			q-btn(flat color="primary" icon="monitor_heart" label="Мониторинг" :to="{ path: '/dvmain/process/monitor', query: { from: route.fullPath } }")
	ProcessHomeBreadcrumbs(:items="breadcrumbs" @back="back")
	ProcessHomeFilters(v-model:search="search" v-model:category="category" v-model:status="status" v-model:author="author" :categories="categoryOptions" :authors="authorOptions" :statuses="statusOptions" :show-instance-filters="section !== 'templates'" @clear="clearFilters")
	.row.q-col-gutter-md(v-if="section === 'overview'")
		.col-12.col-md-6(v-if="!instancesExpanded")
			ProcessTreemap(title="Шаблоны" :zones="templateZones" @select="openTemplateGroup" @list="navigate({ section: 'templates', group: '', template: '', subStatus: '', other: '', view: 'list' })" @clear="clearFilters")
		.col-12(:class="instancesExpanded ? 'col-md-12' : 'col-md-6'")
			ProcessTreemap(title="Экземпляры" :zones="instanceZones" expandable :expanded="instancesExpanded" @toggle-expand="instancesExpanded = !instancesExpanded" @select="openInstanceGroup" @select-child="openInstanceChild" @list="navigate({ section: 'instances', group: '', template: '', subStatus: '', other: '', view: 'list' })" @clear="clearFilters")
				template(v-slot:controls)
					q-btn-toggle.q-mx-md.q-mb-sm(v-model="grouping" :options="groupingOptions" dense no-caps unelevated toggle-color="primary" color="grey-3" text-color="dark")
	template(v-else)
		.row.items-center.justify-between.q-mb-sm.q-gutter-sm
			.text-h6 {{ section === 'templates' ? 'Шаблоны' : (remainingOnly ? 'Остальные экземпляры' : (templateId ? templateLabel : 'Экземпляры')) }}
			q-btn-toggle(v-if="section === 'instances'" v-model="grouping" :options="groupingOptions" dense no-caps unelevated toggle-color="primary" color="grey-3" text-color="dark")
		q-card.flat.bordered(v-if="showList")
			q-card-section.row.items-center.justify-between
				.text-subtitle2 {{ section === 'templates' ? templateRows.length : instanceRows.length }} объектов
				q-btn(v-if="section === 'instances' && !templateId && !subStatus && !remainingOnly" flat dense color="primary" icon="dashboard" label="Показать диаграмму" @click="navigate({ view: '' })")
			ProcessTemplateTable(v-if="section === 'templates'" :rows="templateRows" :reset-key="route.fullPath" @select="openTemplate")
			ProcessInstanceGrid(v-else :rows="instanceRows" :reset-key="route.fullPath" @select="openInstance")
			q-card-actions(v-if="!(section === 'templates' ? templateRows.length : instanceRows.length)" align="center")
				q-btn(flat color="primary" label="Очистить фильтры" @click="clearFilters")
				q-btn(flat color="primary" label="Вернуться наверх" @click="back")
		ProcessTreemap(v-else :title="group ? `Шаблоны · ${group}` : 'Экземпляры'" :zones="group ? instanceTemplateZones : instanceZones" @select-child="openInstanceChild" @select="group ? openInstanceTemplate($event) : openInstanceGroup($event)" @list="navigate({ view: 'list' })" @clear="clearFilters")
</template>

<style scoped>
.process-home { max-width: 1700px; margin: 0 auto; }
</style>
