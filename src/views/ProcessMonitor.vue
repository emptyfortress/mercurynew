<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'
import {
	stopWorkflow,
	workflowPrototype,
	type WorkflowInstance,
	type WorkflowStatus,
} from '@/composables/useWorkflowPrototype'

const router = useRouter()
const selectedStatus = ref('Все экземпляры')
const selectedTemplateId = ref('all')
const searchText = ref('')
const selectedInstanceId = ref(workflowPrototype.instances[0]?.id ?? '')
const selectedInstance = computed(() => workflowPrototype.instances.find((instance) => instance.id === selectedInstanceId.value) ?? null)
const statusFilters = ['Все экземпляры', 'Выполняются', 'Требуют внимания', 'Ошибки', 'Завершены']
const statusCounts = computed(() => ({
	active: workflowPrototype.instances.filter((instance) => instance.status === 'Выполняется').length,
	waiting: workflowPrototype.instances.filter((instance) => instance.status === 'Ожидает').length,
	errors: workflowPrototype.instances.filter((instance) => instance.status === 'Ошибка').length,
	finished: workflowPrototype.instances.filter((instance) => instance.status === 'Завершён').length,
}))

const filteredInstances = computed(() => {
	const query = searchText.value.trim().toLocaleLowerCase('ru')
	return workflowPrototype.instances.filter((instance) => {
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

const chartSeries = computed(() => [{ name: 'Запуски', data: [18, 24, 20, 31, 26, 38, 34] }])
const chartOptions = {
	chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: true } },
	colors: ['#1976d2'],
	dataLabels: { enabled: false },
	stroke: { curve: 'smooth', width: 2 },
	xaxis: { categories: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] },
	tooltip: { theme: 'light' },
	fill: { opacity: 0.18 },
}

function statusColor(status: WorkflowStatus) {
	if (status === 'Ошибка') return 'negative'
	if (status === 'Ожидает') return 'amber-8'
	if (status === 'Выполняется') return 'positive'
	if (status === 'Остановлен') return 'grey-7'
	return 'blue-grey-5'
}

function openTemplate(instance: WorkflowInstance) {
	void router.push({ path: '/dvmain/process/constructor', query: { template: instance.templateId } })
}

function stopSelectedInstance() {
	if (!selectedInstance.value) return
	stopWorkflow(selectedInstance.value)
}
</script>

<template lang="pug">
q-page(padding)
	.workflow-page
		.row.items-center.justify-between.q-mb-md
			div
				.text-h5 Мониторинг процессов
				.text-caption.text-grey-7 Состояние экземпляров и проблемные запуски
			.row.items-center.q-gutter-sm
				q-btn(flat color="primary" icon="account_tree" label="Конструктор" to="/dvmain/process/constructor")
				q-btn(outline color="primary" icon="refresh" label="Обновить" @click="$q.notify({ message: 'Данные обновлены', color: 'positive', timeout: 1200 })")

		.row.q-col-gutter-md.q-mb-md
			.col-6.col-md-2
				q-card.flat.bordered.metric-card
					q-card-section
						.row.items-center.justify-between
							.text-caption.text-grey-7 Выполняются
							q-icon(name="autorenew" color="positive" size="20px")
						.text-h4.q-mt-sm {{ statusCounts.active }}
			.col-6.col-md-2
				q-card.flat.bordered.metric-card.attention-card(clickable @click="selectedStatus = 'Требуют внимания'")
					q-card-section
						.row.items-center.justify-between
							.text-caption.text-grey-7 Требуют внимания
							q-icon(name="schedule" color="amber-9" size="20px")
						.text-h4.q-mt-sm {{ statusCounts.waiting + statusCounts.errors }}
			.col-6.col-md-2
				q-card.flat.bordered.metric-card(clickable @click="selectedStatus = 'Ошибки'")
					q-card-section
						.row.items-center.justify-between
							.text-caption.text-grey-7 Ошибки
							q-icon(name="error_outline" color="negative" size="20px")
						.text-h4.q-mt-sm {{ statusCounts.errors }}
			.col-6.col-md-2
				q-card.flat.bordered.metric-card
					q-card-section
						.row.items-center.justify-between
							.text-caption.text-grey-7 Завершены
							q-icon(name="task_alt" color="blue-grey-5" size="20px")
						.text-h4.q-mt-sm {{ statusCounts.finished }}
			.col-12.col-md-4
				q-card.flat.bordered.chart-card
					q-card-section.row.items-center.justify-between
						div
							.text-caption.text-grey-7 Запуски за неделю
							.text-h5 191
						q-chip(dense color="green-1" text-color="positive") +12%
					VueApexCharts(type="area" height="62" :options="chartOptions" :series="chartSeries")

		q-card.flat.bordered
			q-tabs(v-model="selectedStatus" dense align="left" active-color="primary" indicator-color="primary" no-caps)
				q-tab(v-for="filter in statusFilters" :key="filter" :name="filter" :label="filter")
			q-separator
			.row.items-center.q-col-gutter-sm.q-pa-md
				.col-12.col-sm-5
					q-input(v-model="searchText" dense outlined clearable placeholder="Найти по процессу, карточке или шагу")
				.col-12.col-sm-4
					q-select(v-model="selectedTemplateId" dense outlined emit-value map-options :options="[{ label: 'Все шаблоны', value: 'all' }, ...workflowPrototype.templates.map((template) => ({ label: template.name, value: template.id }))]" label="Шаблон")
				.col-12.col-sm-3.text-right.text-caption.text-grey-7 {{ filteredInstances.length }} экземпляров

			.row.q-col-gutter-md.q-px-sm.q-pb-md.monitor-layout
				.col-12.col-lg-8
					q-table(flat bordered dense :rows="filteredInstances" :columns="columns" row-key="id" v-model:pagination="pagination" :rows-per-page-options="[8, 15, 30]" no-data-label="Экземпляры не найдены" @row-click="(_event, row) => selectedInstanceId = row.id")
						template(v-slot:body-cell-id="props")
							q-td(:props="props")
								.text-weight-medium.text-primary {{ props.value }}
						template(v-slot:body-cell-templateName="props")
							q-td(:props="props")
								.text-weight-medium {{ props.value }}
								.text-caption.text-grey-7 Версия {{ props.row.version }}
						template(v-slot:body-cell-status="props")
							q-td(:props="props")
								q-badge(:color="statusColor(props.value)" :label="props.value")
						template(v-slot:no-data)
							.column.items-center.q-pa-lg.text-grey-7
								q-icon(name="search_off" size="36px")
								| По выбранным условиям экземпляров нет

				.col-12.col-lg-4
					q-card.flat.bordered.instance-detail(v-if="selectedInstance")
						q-card-section.row.items-start.justify-between
							div
								.text-caption.text-grey-7 Экземпляр {{ selectedInstance.id }}
								.text-h6 {{ selectedInstance.card }}
							q-badge(:color="statusColor(selectedInstance.status)" :label="selectedInstance.status")
						q-separator
						q-card-section
							.row.justify-between.q-mb-sm
								.text-caption.text-grey-7 Шаблон
								.text-body2.text-weight-medium {{ selectedInstance.templateName }} · v{{ selectedInstance.version }}
							.row.justify-between.q-mb-sm
								.text-caption.text-grey-7 Текущий шаг
								.text-body2.text-weight-medium {{ selectedInstance.currentStep }}
							.row.justify-between.q-mb-sm
								.text-caption.text-grey-7 Запущен
								.text-body2 {{ selectedInstance.startedAt }}
							.row.justify-between
								.text-caption.text-grey-7 Время в работе
								.text-body2 {{ selectedInstance.elapsed }}
							q-banner(v-if="selectedInstance.status === 'Ошибка'" class="bg-red-1 text-negative rounded-borders q-mt-md" dense)
								.text-weight-medium Не удалось продолжить процесс
								| Не найден заказ для сверки. Проверьте связанную карточку и правило обработки.
							q-banner(v-if="selectedInstance.status === 'Ожидает'" class="bg-amber-1 text-amber-10 rounded-borders q-mt-md" dense)
								.text-weight-medium Дольше обычного
								| Экземпляр ожидает решения на текущем шаге.
						q-separator
						q-card-section
							.text-subtitle2 Последние события
							q-timeline(color="primary" layout="dense" side="right")
								q-timeline-entry(v-for="(event, index) in selectedInstance.events" :key="`${selectedInstance.id}-${index}`" :title="event" :subtitle="index === 0 ? 'Сейчас' : `${index * 8 + 4} мин назад`" :icon="index === 0 && selectedInstance.status === 'Ошибка' ? 'error_outline' : 'circle'" :color="index === 0 && selectedInstance.status === 'Ошибка' ? 'negative' : 'primary'")
						q-card-actions
							q-btn(flat color="primary" icon="account_tree" label="Открыть шаблон" @click="openTemplate(selectedInstance)")
							q-space
							q-btn(flat color="negative" icon="stop" label="Остановить" :disable="['Завершён', 'Остановлен'].includes(selectedInstance.status)" @click="stopSelectedInstance")
				q-card.flat.bordered.q-pa-md.text-grey-7.text-center(v-if="!selectedInstance")
					q-icon(name="touch_app" size="28px")
					div Выберите экземпляр, чтобы посмотреть детали
</template>

<style scoped lang="scss">
.workflow-page { max-width: 1700px; margin: 0 auto; }
.metric-card { min-height: 112px; }
.metric-card .text-h4 { color: #20394e; }
.attention-card { border-color: #edc76b; background: #fffcf3; }
.chart-card { height: 112px; overflow: hidden; }
.monitor-layout { align-items: flex-start; }
.instance-detail { min-height: 440px; }
:deep(.q-table tbody tr) { cursor: pointer; }
:deep(.q-table tbody tr:hover) { background: #f3f8fc; }
:deep(.q-timeline__entry) { min-height: 42px; }
@media (max-width: 1023px) { .instance-detail { min-height: 0; } }
</style>
