<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

const container = ref<HTMLElement | null>(null)

// Роли
const categories = ['Инициатор', 'Руководитель', 'Рассматривающий', 'Исполнитель']

// События
const events = [
	{
		role: 'Инициатор',
		name: 'Создал заявку',
		start: new Date(2025, 8, 20),
		end: new Date(2025, 8, 22),
	},
	{
		role: 'Руководитель',
		name: 'Согласовать заявку',
		start: new Date(2025, 8, 22),
		end: new Date(2025, 8, 24),
	},
	{
		role: 'Инициатор',
		name: 'Исправить заявку',
		start: new Date(2025, 8, 24),
		end: new Date(2025, 8, 26),
	},
	{
		role: 'Руководитель',
		name: 'Согласовать заявку',
		start: new Date(2025, 8, 26),
		end: new Date(2025, 8, 28),
	},
	{
		role: 'Рассматривающий',
		name: 'Рассмотреть заявку',
		start: new Date(2025, 8, 28),
		end: new Date(2025, 8, 30),
	},
	{
		role: 'Исполнитель',
		name: 'Исполнить заявку',
		start: new Date(2025, 8, 30),
		end: new Date(2025, 9, 2),
	},
	{
		role: 'Инициатор',
		name: 'Принять результаты',
		start: new Date(2025, 9, 2),
		end: new Date(2025, 9, 4),
	},
]

// Цвета ролей
const roleColors: Record<string, string> = {
	Инициатор: '#008FFB',
	Руководитель: '#00E396',
	Рассматривающий: '#FEB019',
	Исполнитель: '#FF4560',
}

// Группы
const groups = new DataSet(
	categories.map((role) => ({
		id: role,
		content: role,
	}))
)

const items = new DataSet(
	events.map((event, index) => ({
		id: index,
		group: event.role, // важно: должен совпадать с id группы
		start: event.start,
		end: event.end,
		content: event.name,
	}))
)

onMounted(() => {
	if (container.value) {
		const options = {
			editable: false,
			stack: true,
			orientation: 'top',
		}

		new Timeline(container.value, items, groups, options)
	}
})
</script>

<template lang="pug">
.inside
  div(ref="container")
</template>

<style scoped lang="scss">
.inside {
	width: 100%;
	height: 100%;
	background: #fff;
}
</style>
