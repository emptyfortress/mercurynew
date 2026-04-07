<script setup lang="ts">
import { ref, computed } from 'vue'
import type { QTableProps } from 'quasar'

const cols: QTableProps['columns'] = [
	{
		name: 'number',
		required: true,
		label: 'Номер',
		align: 'left',
		field: 'number',
		sortable: true,
	},
	{
		name: 'numberi',
		required: true,
		label: 'Номер исх.',
		align: 'left',
		field: 'numberi',
		sortable: true,
	},
	{
		name: 'datai',
		required: true,
		label: 'Дата исх.',
		align: 'left',
		field: 'datai',
		sortable: true,
	},
	{
		name: 'from',
		required: true,
		label: 'Отправитель',
		align: 'left',
		field: 'from',
		sortable: true,
	},
	{
		name: 'theme',
		required: true,
		label: 'Тема',
		align: 'left',
		field: 'theme',
		sortable: true,
	},
	{
		name: 'state',
		required: true,
		label: 'Состояние',
		align: 'left',
		field: 'state',
		sortable: true,
	},
]

const rows = ref<any[]>([])

const model = ref({
	from: '2026/04/01',
	to: '2026/04/02',
})

const sampleData = [
	{
		metka: 'Важное',
		number: '123-45',
		numberi: 'ИН-001',
		datai: '2026-04-01',
		from: 'ООО "Ромашка"',
		theme: 'Договор поставки',
		state: 'На рассмотрении',
	},
	{
		metka: 'Срочное',
		number: '123-46',
		numberi: 'ИН-002',
		datai: '2026-04-01',
		from: 'АО "Вектор"',
		theme: 'Запрос коммерческого предложения',
		state: 'В работе',
	},
	{
		metka: 'Обычное',
		number: '123-47',
		numberi: 'ИН-003',
		datai: '2026-04-02',
		from: 'ИП Иванов',
		theme: 'Акт выполненных работ',
		state: 'Завершено',
	},
	{
		metka: 'Важное',
		number: '123-48',
		numberi: 'ИН-004',
		datai: '2026-04-02',
		from: 'ООО "СтройМонтаж"',
		theme: 'Счет на оплату',
		state: 'Ожидает подписи',
	},
	{
		metka: 'Обычное',
		number: '123-49',
		numberi: 'ИН-005',
		datai: '2026-04-03',
		from: 'ЗАО "ТехноПром"',
		theme: 'Спецификация оборудования',
		state: 'На согласовании',
	},
	{
		metka: 'Срочное',
		number: '123-50',
		numberi: 'ИН-006',
		datai: '2026-04-03',
		from: 'ООО "Консалтинг"',
		theme: 'Отчет по аудиту',
		state: 'В работе',
	},
]

const action = () => {
	rows.value = sampleData
}
const clear = () => {
	rows.value = []
}
const selected = ref<any>(null)

const toggleRow = (row: any) => {
	if (selected.value === row) {
		selected.value = null
	} else {
		selected.value = row
	}
}

const isRowSelected = (row: any) => {
	return selected.value === row
}
const isSelection = computed(() => {
	return selected.value ? false : true
})
const emit = defineEmits(['close'])
const close = () => {
	emit('close')
}
</script>

<template lang="pug">
q-table(
	flat
	:columns='cols'
	:rows='rows'
	row-key='number'
)
	template(v-slot:body='props')
		tr(
			@click='toggleRow(props.row)'
			:class='{ selected: isRowSelected(props.row) }'
		)
			td.q-td(v-for='col in props.cols' :key='col.name') {{ props.row[col.field] }}
	template(v-slot:no-data)
		.center
			.col
				q-btn(flat color="primary" label="Прошлая неделя" ) 
				q-btn(flat color="primary" label="Текущая неделя" ) 
				q-btn(flat color="primary" label="Сегодня") 
			q-date(v-model="model" range subtitle="Показать карточки в диапазоне")
			.col
				q-btn(unelevated color="primary" label="Показать" @click="action") 

	template(v-slot:bottom)
		q-btn(flat icon="mdi-calendar" color="primary" label="Задать другой диапазон" @click='clear') 
		q-btn(unelevated  color="primary" label="Подтвердить" :disable="isSelection" @click='close') 
</template>

<style scoped lang="scss">
.center {
	display: flex;
	gap: 1rem;
	align-items: center;
}
.col > .q-btn {
	display: block;
	white-space: nowrap;
	width: 100%;
}
tr {
	cursor: pointer;
	transition: background-color 0.2s;
	&.selected {
		background-color: var(--selection);
		&:hover {
			background-color: var(--selection);
		}
	}
	&:hover {
		background-color: rgba(var(--q-primary-rgb), 0.05);
	}
}
</style>
