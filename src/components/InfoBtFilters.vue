<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSelectionStore } from '@/stores/selection'

const selectionStore = useSelectionStore()
const { selectedLateFilter, hideWeekends } = storeToRefs(selectionStore)

const routeFilters = ['маршрут 1', 'маршрут 2', 'маршрут 3']

// function toggleMainFilter(filter: string) {
// 	selectMainFilter(filter)
// }

// function toggleRouteFilter(filter: string) {
// 	selectRouteFilter(filter)
// }
</script>

<template lang="pug">
.filt
	.zag Показать
	q-chip(clickable
		v-model:selected='selectedLateFilter'
		:color="selectedLateFilter ? 'primary' : 'grey-3'"
		:text-color="selectedLateFilter ? 'white' : 'black'"
		@click='selectionStore.selectById(2)'
	) просрочено

	q-chip(clickable
		:selected="!hideWeekends"
		:color="!hideWeekends ? 'primary' : 'grey-3'"
		:text-color="!hideWeekends ? 'white' : 'black'"
		@click="hideWeekends = !hideWeekends"
	) выходные

	.pr()
		|Прогноз
		span (экспериментальная функция)
	// q-chip(
	// 	v-for="filter in routeFilters"
	// 	:key="filter"
	// 	clickable
	// 	:color="selectedRouteFilter === filter ? 'primary' : 'grey-3'"
	// 	:text-color="selectedRouteFilter === filter ? 'white' : 'black'"
	// 	@click="toggleRouteFilter(filter)"
	// ) {{ filter }}
</template>

<style scoped lang="scss">
.filt {
	text-align: left;
	margin: 1rem;
}
.pr {
	font-weight: 500;
	margin-top: 1rem;
	span {
		font-weight: 0.7rem;
		font-weight: 400;
		margin-left: 1rem;
		color: #555;
	}
}
:deep(.q-chip__icon.q-chip__icon--left) {
	display: none;
}
.zag {
	text-align: center;
	width: 100%;
	font-weight: 600;
}
</style>
