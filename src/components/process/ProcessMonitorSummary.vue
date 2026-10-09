<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { WorkflowInstance } from '@/composables/useWorkflowPrototype'
const props = defineProps<{ instances: WorkflowInstance[] }>()
const emit = defineEmits<{ filter: [status: string] }>()
const statusCounts = computed(() => ({
	active: props.instances.filter((instance) => instance.status === 'Выполняется').length,
	waiting: props.instances.filter((instance) => instance.status === 'Ожидает').length,
	errors: props.instances.filter((instance) => instance.status === 'Ошибка').length,
	finished: props.instances.filter((instance) => instance.status === 'Завершён').length,
}))
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

</script>

<template lang="pug">
.row.q-col-gutter-md.q-mb-md
	.col-6.col-md-2
		q-card.flat.bordered.metric-card
			q-card-section
				.row.items-center.justify-between
					.text-caption.text-grey-7 Выполняются
					q-icon(name="autorenew" color="positive" size="20px")
				.text-h4.q-mt-sm {{ statusCounts.active }}
	.col-6.col-md-2
		q-card.flat.bordered.metric-card.attention-card(clickable @click="emit('filter', 'Требуют внимания')")
			q-card-section
				.row.items-center.justify-between
					.text-caption.text-grey-7 Требуют внимания
					q-icon(name="schedule" color="amber-9" size="20px")
				.text-h4.q-mt-sm {{ statusCounts.waiting + statusCounts.errors }}
	.col-6.col-md-2
		q-card.flat.bordered.metric-card(clickable @click="emit('filter', 'Ошибки')")
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
</template>

<style scoped>
.metric-card { min-height: 112px; }
.metric-card .text-h4 { color: #20394e; }
.attention-card { border-color: #edc76b; background: #fffcf3; }
.chart-card { height: 112px; overflow: hidden; }
</style>
