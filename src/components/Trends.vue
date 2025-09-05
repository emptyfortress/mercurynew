<script setup lang="ts">
import MaterialSymbolsHomeAppLogo from '@/components/icons/MaterialSymbolsHomeAppLogo.vue'
import VueApexCharts from 'vue3-apexcharts'
import { randomArray } from '@/utils/utils'

const series = [44, 35, 12, 7]

const chartOptions = {
	labels: ['Черновики', 'DV-test', 'DV-Main', 'DV-Prod'],
	dataLabels: {
		enabled: true,
		formatter: function (val: number, opts: any) {
			return opts.w.config.series[opts.seriesIndex]
		},
	},
}

const db = [
	{
		id: 0,
		label: 'Конструктор',
		type: 1,
	},
	{
		id: 1,
		label: 'Базы данных',
		type: 2,
		series: [{ data: randomArray(3, 5, 20) }],
	},
]

const series1 = [
	{
		name: 'Приложения',
		data: [44, 55, 57],
	},
	{
		name: 'Версии',
		data: [76, 85, 10],
	},
	{
		name: 'Ожидают публикации',
		data: [35, 41, 36],
	},
	{
		name: 'Ошибки',
		data: [15, 5, 7],
	},
]

const options1 = {
	chart: {
		type: 'bar',
	},
	plotOptions: {
		bar: {
			horizontal: false,
		},
	},
	xaxis: {
		categories: ['DV-Test', 'DV-Main', 'DV-Prod'], // ← вот сюда
	},
}
</script>

<template lang="pug">
.grid
	q-card(v-for="card in db" :key='card.id')
		.row.items-center.h7
			q-icon(v-if='card.type == 2' name="mdi-database-outline" color="primary")
			MaterialSymbolsHomeAppLogo(v-else color="primary")
			span.q-ml-sm {{ card.label }}
		br
		VueApexCharts(v-if='card.type == 1' type="donut" :options="chartOptions" :series="series")
		VueApexCharts(v-if='card.type == 2' height='200px' type="bar" :options="options1" :series="series1")
</template>

<style scoped lang="scss">
.grid {
	display: grid;
	grid-template-columns: 1fr 3fr;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.h7 {
	color: $primary;
}
.q-card {
	min-height: 100px;
	padding: 1rem;
}
</style>
