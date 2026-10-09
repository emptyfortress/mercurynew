<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { WorkflowInstance, WorkflowTemplate } from '@/composables/useWorkflowPrototype'
import ProcessStatusBadge from './ProcessStatusBadge.vue'
const props = defineProps<{ instances: WorkflowInstance[]; templates: WorkflowTemplate[] }>()
const emit = defineEmits<{ select: [id: string] }>()
const selectedStatus = defineModel<string>('status', { required: true })
const selectedTemplateId = ref('all')
const searchText = ref<string | null>('')
const statusFilters = ['Все экземпляры', 'Выполняются', 'Требуют внимания', 'Ошибки', 'Завершены']

const filteredInstances = computed(() => {
	const query = (searchText.value ?? '').trim().toLocaleLowerCase('ru')
	return props.instances.filter((instance) => {
		const statusMatch = selectedStatus.value === 'Все экземпляры'
			|| (selectedStatus.value === 'Выполняются' && instance.status === 'Выполняется')
			|| (selectedStatus.value === 'Требуют внимания' && ['Ожидает', 'Ошибка'].includes(instance.status))
			|| (selectedStatus.value === 'Ошибки' && instance.status === 'Ошибка')
			|| (selectedStatus.value === 'Завершены' && ['Завершён', 'Остановлен'].includes(instance.status))
		const templateMatch = selectedTemplateId.value === 'all' || instance.templateId === selectedTemplateId.value
		const textMatch = !query || `${instance.id} ${instance.templateName} ${instance.card} ${instance.currentStep}`.toLocaleLowerCase('ru').includes(query)
		return statusMatch && templateMatch && textMatch
	})
})

const columns = [
	{ name: 'id', label: 'Экземпляр', field: 'id', align: 'left' as const, sortable: true },
	{ name: 'templateName', label: 'Шаблон', field: 'templateName', align: 'left' as const, sortable: true },
	{ name: 'card', label: 'Карточка', field: 'card', align: 'left' as const },
	{ name: 'currentStep', label: 'Текущий шаг', field: 'currentStep', align: 'left' as const },
	{ name: 'elapsed', label: 'Время', field: 'elapsed', align: 'left' as const },
	{ name: 'status', label: 'Состояние', field: 'status', align: 'left' as const, sortable: true },
]
const pagination = ref({ sortBy: 'id', descending: true, page: 1, rowsPerPage: 8 })

watch([selectedStatus, selectedTemplateId, searchText], () => { pagination.value.page = 1 })
</script>

<template lang="pug">
q-card.flat.bordered
	q-tabs(v-model="selectedStatus" dense align="left" active-color="primary" indicator-color="primary" no-caps)
		q-tab(v-for="filter in statusFilters" :key="filter" :name="filter" :label="filter")
	q-separator
	.row.items-center.q-col-gutter-sm.q-pa-md
		.col-12.col-sm-5
			q-input(v-model="searchText" dense outlined clearable placeholder="Найти по процессу, карточке или шагу")
		.col-12.col-sm-4
			q-select(v-model="selectedTemplateId" dense outlined emit-value map-options :options="[{ label: 'Все шаблоны', value: 'all' }, ...templates.map((template) => ({ label: template.name, value: template.id }))]" label="Шаблон")
		.col-12.col-sm-3.text-right.text-caption.text-grey-7 {{ filteredInstances.length }} экземпляров
	.row.q-col-gutter-md.q-px-sm.q-pb-md.monitor-layout
		.col-12.col-lg-8
			q-table(flat bordered dense :rows="filteredInstances" :columns="columns" row-key="id" v-model:pagination="pagination" :rows-per-page-options="[8, 15, 30]" no-data-label="Экземпляры не найдены" @row-click="(_event, row) => emit('select', row.id)")
				template(v-slot:body-cell-id="props")
					q-td(:props="props")
						.text-weight-medium.text-primary {{ props.value }}
				template(v-slot:body-cell-templateName="props")
					q-td(:props="props")
						.text-weight-medium {{ props.value }}
						.text-caption.text-grey-7 Версия {{ props.row.version }}
				template(v-slot:body-cell-status="props")
					q-td(:props="props")
						ProcessStatusBadge(:status="props.row.status")
				template(v-slot:no-data)
					.column.items-center.q-pa-lg.text-grey-7
						q-icon(name="search_off" size="36px")
						| По выбранным условиям экземпляров нет
		.col-12.col-lg-4
			slot
</template>

<style scoped>
.monitor-layout { align-items: flex-start; }
:deep(.q-table tbody tr) { cursor: pointer; }
:deep(.q-table tbody tr:hover) { background: #f3f8fc; }
</style>
