<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSelectionStore } from '@/stores/selection'
import FluentEyeShow12Filled from '@/components/icons/FluentEyeShow12Filled.vue'

const selectionStore = useSelectionStore()
const { selectedLateFilter, hideWeekends } = storeToRefs(selectionStore)

const item1 = ref(true)
</script>

<template lang="pug">
q-expansion-item(v-model="item1")
	template(v-slot:header)
		q-item-section(side)
			FluentEyeShow12Filled.ic
		q-item-section.zg Таймлайн

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
.ic {
	font-size: 1.5rem;
	margin-right: 0.5rem;
	color: $secondary;
}
.zg {
	text-transform: uppercase;
	color: $secondary;
	text-align: left;
}
</style>
