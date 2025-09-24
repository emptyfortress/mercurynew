<script setup lang="ts">
import { ref } from 'vue'
import ApexChart from 'vue3-apexcharts'

interface TimelineEvent {
	name: string
	start: Date
	end: Date
}

const today = new Date()

// 3 события подряд
const events: TimelineEvent[] = [
	{
		name: 'Создал заявку',
		start: new Date(today),
		end: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 дня
	},
	{
		name: 'Согласовать заявку',
		start: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
		end: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // +3 дня
	},
	{
		name: 'Исправить заявку',
		start: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
		end: new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000), // +4 дня
	},
]

const series = [
	{
		data: events.map((ev) => ({
			x: ev.name,
			y: [ev.start.getTime(), ev.end.getTime()],
		})),
	},
]

// const series = [
// 	{
// 		data: events.map((ev) => ({
// 			x: 'Процесс', // ✅ все в одной строке
// 			y: [ev.start.getTime(), ev.end.getTime()],
// 			label: ev.name, // сохраним имя отдельно
// 		})),
// 	},
// ]

const chartOptions = {
	chart: {
		type: 'rangeBar',
		height: 350,
	},
	plotOptions: {
		bar: {
			horizontal: true,
			distributed: true,
			dataLabels: {
				position: 'center', // подписи внутри бара
			},
		},
	},
	dataLabels: {
		enabled: true,
		formatter: function (_val: any, opts: any) {
			return opts.w.globals.labels[opts.dataPointIndex] // берём x (название события)
		},
		style: {
			colors: ['#fff'], // белый текст, если фон тёмный
		},
	},
	xaxis: {
		type: 'datetime',
	},
	yaxis: {
		show: true, // ✅ убираем ось Y
	},
}
</script>

<template lang="pug">
.inside
	ApexChart(
		type="rangeBar"
		height="350"
		:options="chartOptions"
		:series="series"
	)
</template>

<style scoped lang="scss">
.inside {
	width: 100%;
	height: 100%;
	background: #fff;
	// background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAADBJREFUGFclioEJADAMwvSl7f8P1pfMaAsiCcT1inOPQJIlkwy3uT8JbmImh2zANh9STBXvibRbIgAAAABJRU5ErkJggg==);
}
</style>
