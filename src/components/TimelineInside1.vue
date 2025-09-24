<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'

interface TimelineEvent {
	role: string
	name: string
	start: Date
	end: Date
}

// Роли и цвета
const roleColors: Record<string, string> = {
	Инициатор: '#008FFB',
	Руководитель: '#00E396',
	Рассматривающий: '#FEB019',
	Исполнитель: '#FF4560',
}

// Исходная последовательность событий
const eventSequence = [
	{ role: 'Инициатор', name: 'Создал заявку' },
	{ role: 'Руководитель', name: 'Согласовать заявку' },
	{ role: 'Инициатор', name: 'Исправить заявку' },
	{ role: 'Руководитель', name: 'Согласовать заявку' },
	{ role: 'Рассматривающий', name: 'Рассмотреть заявку' },
	{ role: 'Исполнитель', name: 'Исполнить заявку' },
	{ role: 'Инициатор', name: 'Принять результаты' },
]

// Генерация start/end дат (2–3 дня) последовательно
const today = new Date()
let currentTime = today.getTime()

// Создаём серию на каждое событие
const series = eventSequence.map((ev) => {
	const durationDays = 2 + Math.floor(Math.random() * 2)
	const start = new Date(currentTime)
	const end = new Date(currentTime + durationDays * 24 * 60 * 60 * 1000)
	currentTime = end.getTime()
	return {
		name: ev.name,
		data: [
			{
				x: ev.role, // категория = роль
				y: [start.getTime(), end.getTime()],
				label: ev.name,
			},
		],
		color: roleColors[ev.role], // одинаковый цвет для роли
	}
})

// Категории Y = роли
const categories = Object.keys(roleColors)

const chartOptions = {
	chart: { type: 'rangeBar', height: 400 },
	plotOptions: {
		bar: {
			horizontal: true,
			barHeight: '80%', // максимально толстые полоски на дорожке
			distributed: false,
			dataLabels: { position: 'center' },
		},
	},
	dataLabels: {
		enabled: true,
		offsetY: 0,
		formatter: (_val: any, opts: any) => opts.w.config.series[opts.seriesIndex].data[0].label,
		style: { colors: ['#fff'], fontSize: '12px', fontWeight: 'bold' },
	},
	xaxis: { type: 'datetime' },
	yaxis: {
		categories,
		labels: { show: true },
		axisBorder: { show: true },
		axisTicks: { show: true },
	},
	grid: { yaxis: { lines: { show: true } } },
}
</script>

<template lang="pug">
.inside
  ApexChart(
    type="rangeBar"
    height="400"
    :options="chartOptions"
    :series="series"
  )
</template>

<style scoped lang="scss">
.inside {
	width: 100%;
	height: 100%;
	background: #fff;
}
</style>
