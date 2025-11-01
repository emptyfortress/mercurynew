<script setup lang="ts">
import { computed } from 'vue'
import { useSelectionStore } from '@/stores/selection'
import { storeToRefs } from 'pinia'

const selectionStore = useSelectionStore()
const { current, selectedForecast, forecastEvents } = storeToRefs(selectionStore)

const finishDate = computed(() => {
	if (!current.value || current.value.kind !== 'bpmn') return null
	const event = forecastEvents.value.find((e) => e.sideId === current.value?.id)
	return event?.end?.toLocaleDateString('ru-RU')
})

const forecast = computed(() => {
	if (current.value && current.value.kind == 'bpmn') {
		return current.value?.finished == 'Не начато' ? true : false
	}
	return false
})

const toggleForecast = async () => {
	selectedForecast.value = !selectedForecast.value

	if (selectedForecast.value) {
		await selectionStore.loadForecastEvents()
	}
}

const finished = computed(() => {
	if (current.value && current.value.id == 'Activity_0vjxzxe') return 'в процессе'
	if (current.value && current.value.kind == 'bpmn') {
		return current.value.finished
	}
})
</script>

<template lang="pug">
.grid
	.zag Этап
	label Тип:
	div {{current?.type}}
	label Название:
	div {{current?.name}}
	template(v-if='current?.kind == "bpmn"')
		label Роль:
		div {{current?.lane}}
	label Состояние:
	div {{ finished }}
	template(v-if='forecast')
		q-separator(spaced)
		label Прогноз:
		q-chip(clickable
			:selected="selectedForecast"
			:color="selectedForecast ? 'primary' : 'grey-3'"
			:text-color="selectedForecast ? 'white' : 'black'"
			@click="toggleForecast"
		) Показать
			q-tooltip экспериментальная функция
		template(v-if="selectedForecast")
			label Дата завершения:
			div.forecast-date
				span {{ finishDate }}
				q-icon(name="mdi-help-circle-outline" color="primary" size="xs")
					q-tooltip Прогнозируемая дата завершения этапа
</template>

<style scoped lang="scss">
.grid {
	padding: 1rem;
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.q-separator {
	grid-column: 1/-1;
	width: 100%;
}
label {
	color: #666;
}
.zag {
	grid-column: 1/-1;
	width: 100%;
	font-weight: 600;
}
.forecast-date {
	font-style: italic;
	color: #666;
	border: 1px dotted $positive;
	padding: 0 0.5rem;
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
}
</style>
