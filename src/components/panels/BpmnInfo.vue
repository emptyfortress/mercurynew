<script setup lang="ts">
import { computed } from 'vue'
import { useSelectionStore } from '@/stores/selection'
import { storeToRefs } from 'pinia'

const selectionStore = useSelectionStore()
const { current } = storeToRefs(selectionStore)

const list = ['Event_1t7b10m', 'Activity_13ysreu', 'Activity_0kpt2qn', 'Activity_0vjxzxe']

const finished = computed(() => {
	if (!current.value) return false
	return list.includes(String(current.value.id))
})
</script>

<template lang="pug">
.grid
	.zag Этап
	// label id:
	// div {{current?.id}}
	label Тип:
	div {{current?.type}}
	label Название:
	div {{current?.name}}
	label Роль:
	div {{current?.lane}}
	label Завершено:
	div
		span(v-if='current?.id == "Activity_0vjxzxe"') В процессе
		span(v-else) {{finished}}

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
</style>
