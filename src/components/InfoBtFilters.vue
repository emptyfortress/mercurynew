<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSelectionStore } from '@/stores/selection'

const selectionStore = useSelectionStore()
const { selectedLateFilter, hideWeekends } = storeToRefs(selectionStore)
</script>

<template lang="pug">
.filt
	.zag Показать
	q-chip(clickable
		v-model:selected='selectedLateFilter'
		:color="selectedLateFilter ? 'primary' : 'grey-3'"
		:text-color="selectedLateFilter ? 'white' : 'black'"
	) просрочено
		q-tooltip подсветить просроченные

	q-chip(clickable
		:selected="!hideWeekends"
		:color="!hideWeekends ? 'primary' : 'grey-3'"
		:text-color="!hideWeekends ? 'white' : 'black'"
		@click="hideWeekends = !hideWeekends"
	) выходные
		q-tooltip показать выходные на шкале

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
