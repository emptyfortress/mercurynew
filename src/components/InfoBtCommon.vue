<script setup lang="ts">
import { ref } from 'vue'
import { useSelectionStore } from '@/stores/selection'
import PhPersonSimpleRunFill from '@/components/icons/PhPersonSimpleRunFill.vue'

const store = useSelectionStore()
const select = () => {
	store.programmaticSelectId = 'Activity_0vjxzxe'
}
const item1 = ref(true)
</script>

<template lang="pug">
// .zag Ход процесса
q-expansion-item(v-model="item1")
	template(v-slot:header)
		q-item-section(side)
			PhPersonSimpleRunFill.ic
		q-item-section.zg Ход процесса

	.grid
		label Процесс начат:
		div 22.09.25 13:07
		label Процесс длится:
		div 14 дней 7 часов
		label Инициатор:
		div Орлов П.С.
		label Всего этапов:
		div 6
		label Завершено этапов:
		div 3
		label Совершено циклов:
		div 2
		label Текущий этап:
		.link(@click='select') Рассмотреть заявку
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
.link {
	color: $primary;
	text-decoration: underline;
	cursor: pointer;
}
.link1 {
	color: $negative;
	text-decoration: underline;
	cursor: pointer;
}
</style>
