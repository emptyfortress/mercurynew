<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSelectionStore } from '@/stores/selection'
import FluentEyeShow12Filled from '@/components/icons/FluentEyeShow12Filled.vue'
import ExpansionItem from '@/components/ExpansionItem.vue'

const selectionStore = useSelectionStore()
const { selectedLateFilter, hideWeekends } = storeToRefs(selectionStore)
</script>

<template lang="pug">
ExpansionItem(title="Таймлайн" :icon="FluentEyeShow12Filled")
	.text-left.q-mb-md
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
:deep(.q-chip__icon.q-chip__icon--left) {
	display: none;
}
</style>
