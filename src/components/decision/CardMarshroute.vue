<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import DndTable from '@/components/common/DndTable.vue'

// interface Row {
// 	id: number
// 	name: string
// 	age: number
// 	city: string
// }

const approveStore = useApproveStore()
const name = computed(() => approveStore.selectedElement?.text)

const author = ref('admin')
const registrator = ref('registrator')
const check = ref(true)

const cols = [
	{
		name: 'etap',
		label: 'Этап',
		field: 'etap',
		align: 'left',
	},
	{
		name: 'first',
		label: 'Первый',
		field: 'first',
		align: 'center',
		type: 'checkbox',
	},
	{
		name: 'condition',
		label: 'Условие старта',
		field: 'condition',
		align: 'left',
	},
	{
		name: 'repeat',
		label: 'Повторять внутри цикла',
		field: 'repeat',
		align: 'left',
	},
	{
		name: 'regim',
		label: 'Режим',
		field: 'regim',
		align: 'left',
	},
	{
		name: 'marsh',
		label: 'Маршрутизация',
		field: 'marsh',
		align: 'left',
	},
	{
		name: 'sogl',
		label: 'Согласующие',
		field: 'sogl',
		align: 'left',
	},
	{
		name: 'duration',
		label: 'Длительность',
		field: 'duration',
		align: 'center',
	},
]

const rows = ref([
	{
		id: 1,
		etap: 'Внутреннее согласование',
		first: true,
		condtion: '',
		repeat: 'Всегда',
		regim: 'Согласование',
		marsh: 'Параллельно',
		sogl: 'Согласующие',
		duration: 8,
	},
	{
		id: 2,
		etap: 'Подведение итогов',
		first: false,
		condtion: '',
		repeat: 'Всегда',
		regim: 'Консолидация',
		marsh: 'Последовательно',
		sogl: 'Инициатор',
		duration: 24,
	},
	{
		id: 3,
		etap: 'Консолидация',
		first: false,
		condtion: '',
		repeat: 'Всегда',
		regim: 'Консолидация',
		marsh: 'Последовательно',
		sogl: 'Инициатор',
		duration: 24,
	},
])
</script>

<template lang="pug">
.q-ma-md
	fieldset
		legend Общие
		.grid3
			q-input(v-model="name" label="Название" dense outlined :readonly='approveStore.typovoy')
			q-input(v-model="author" label="Автор" dense outlined :readonly='approveStore.typovoy')
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="secondary")
					q-icon(name="mdi-close" color="secondary" size="xs")
			q-input(v-model="registrator" label="Регистратор" dense outlined :readonly='approveStore.typovoy')
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="secondary")
					q-icon(name="mdi-close" color="secondary" size="xs")
			q-checkbox(v-model='check' label='Усовершенствованный маршрут' dense)

	fieldset
		legend Карта этапов
		DndTable(:columns='cols' :rows='rows')
</template>

<style scoped lang="scss">
.grid3 {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	// justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
</style>
