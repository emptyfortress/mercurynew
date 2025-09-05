<script setup lang="ts">
import { date } from 'quasar'
import type { QTableProps } from 'quasar'

const cols: QTableProps['columns'] = [
	{
		name: 'date',
		required: true,
		label: 'Дата',
		align: 'left',
		field: 'date',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	{
		name: 'user',
		required: true,
		label: 'Пользователь',
		align: 'left',
		field: 'user',
		sortable: true,
	},
	{
		name: 'db',
		required: true,
		label: 'База данных',
		align: 'left',
		field: 'db',
		sortable: true,
	},
	{
		name: 'event',
		required: true,
		label: 'Событие',
		align: 'left',
		field: 'event',
		sortable: true,
	},
	{
		name: 'result',
		required: true,
		label: 'Результат',
		align: 'center',
		field: 'result',
		sortable: true,
	},
	{
		name: 'action',
		required: true,
		label: '',
		align: 'left',
		field: 'action',
		sortable: false,
	},
]

// const rows = [
// 	{
// 		id: 0,
// 		date: 1755533483568,
// 		user: 'Орлов П.С.',
// 		db: 'DV-Test',
// 		event: 'Проверка',
// 		result: true,
// 	},
// ]

const rows = [
	{
		id: 0,
		date: 1756447083568,
		user: 'Роза Львовна',
		db: '--',
		event: 'Создание версии',
		result: true,
	},
	{
		id: 1,
		date: 1756445283568,
		user: 'Орлов П.С.',
		db: 'DV-Main',
		event: 'Удаление',
		result: false,
	},
	{
		id: 2,
		date: 1756443183568,
		user: 'Орлов П.С.',
		db: 'DV-Prod',
		event: 'Проверка',
		result: true,
	},
	{
		id: 3,
		date: 1756441383568,
		user: 'Сидоров В.В.',
		db: 'DV-Test',
		event: 'Авторизация',
		result: false,
	},
	{
		id: 4,
		date: 1756438983568,
		user: 'Кузнецов Д.Д.',
		db: 'DV-Prod',
		event: 'Обновление',
		result: false,
	},
	{
		id: 5,
		date: 1756436283568,
		user: 'Иванов И.И.',
		db: 'DV-Main',
		event: 'Удаление',
		result: true,
	},
	{
		id: 6,
		date: 1756433883568,
		user: 'Орлов П.С.',
		db: 'DV-Test',
		event: 'Проверка',
		result: false,
	},
	{
		id: 7,
		date: 1756431783568,
		user: 'Сидоров В.В.',
		db: 'DV-Prod',
		event: 'Авторизация',
		result: false,
	},
	{
		id: 8,
		date: 1756429983568,
		user: 'Кузнецов Д.Д.',
		db: 'DV-Main',
		event: 'Обновление',
		result: false,
	},
	{
		id: 9,
		date: 1756427583568,
		user: 'Орлов П.С.',
		db: 'DV-Test',
		event: 'Удаление',
		result: false,
	},
	{
		id: 10,
		date: 1756425483568,
		user: 'Орлов П.С.',
		db: 'DV-Prod',
		event: 'Проверка',
		result: true,
	},
	{
		id: 11,
		date: 1756423383568,
		user: 'Иванов И.И.',
		db: 'DV-Main',
		event: 'Авторизация',
		result: true,
	},
	{
		id: 12,
		date: 1756420983568,
		user: 'Сидоров В.В.',
		db: 'DV-Test',
		event: 'Удаление',
		result: false,
	},
	{
		id: 13,
		date: 1756418883568,
		user: 'Орлов П.С.',
		db: '--',
		event: 'Создание версии',
		result: true,
	},
]
const page = {
	rowsPerPage: 7,
}
</script>

<template lang="pug">
.h7 Журнал событий
q-table(flat,
	:columns="cols"
	:rows="rows"
	row-key="id"
	color="primary"
	:pagination="page"
	)
	template(v-slot:body-cell-result='props')
		q-td.text-center(:props='props')
			q-icon(v-if='props.row.result' name="mdi-check-bold" color="positive" size="20px")
			q-icon(v-else name="mdi-close-octagon" color="negative" size="20px")

	template(v-slot:body-cell-action='props')
		q-td.text-right(:props='props' auto-width)
			q-btn(flat round icon="mdi-dots-vertical" color="primary" dense) 
</template>

<style scoped lang="scss">
:deep(.q-field__control:before) {
	background: #fff;
}
</style>
