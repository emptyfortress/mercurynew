<script setup lang="ts">
import { computed } from 'vue'
import { useSelectionStore } from '@/stores/selection'
import { storeToRefs } from 'pinia'
import { date } from 'quasar'
import type { TimelineSelection } from '@/stores/selection'

const selectionStore = useSelectionStore()
const { current } = storeToRefs(selectionStore)

// this is for fix type error
const timeline = computed(() => current.value as TimelineSelection | null)

const format = (val: Date) => {
	return date.formatDate(val, 'DD.MM.YY HH:mm')
}

const decision = computed(() => {
	if (current.value) {
		switch (current.value.id) {
			case 5:
				return 'Решение не принято'
			case 4:
				return 'На рассмотрение'
			case 2:
				return 'На исправление'
			default:
				return 'На согласование'
		}
	}
})

const diff = computed(() => {
	return date.getDateDiff(timeline.value?.end, timeline.value?.start, 'hours')
})
</script>

<template lang="pug">
.grid
	.zag Событие
	label Этап:
	div {{timeline?.name}}
	label Роль:
	div {{timeline?.role}}
	label Исполнитель:
	div {{timeline?.fio}}
	label Начато:
	div {{format(timeline?.start)}}
	label Завершено:
	.neg(v-if='current?.id == 5') Задание не завершено
	div(v-else) {{format(timeline?.end)}}
	label Длительность:
	div {{ diff }} часов
	q-separator(spaced)
	label Решение:
	div {{ decision }}

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
label {
	color: #666;
}
.zag {
	grid-column: 1/-1;
	width: 100%;
	font-weight: 600;
}
.q-separator {
	grid-column: 1/-1;
	width: 100%;
}
.neg {
	color: $negative;
}
</style>
