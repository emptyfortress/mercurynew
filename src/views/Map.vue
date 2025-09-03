<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import { date } from 'quasar'

const dat = [
	{ id: 0, label: 'Приложение', val: 'Заявки на отпуск' },
	{ id: 1, label: 'Автор', val: 'Орлов П.С.' },
	{ id: 2, label: 'Создано', val: '22.07.25 15:10' },
]
const dat1 = [
	{ id: 0, label: 'Версия', val: 'Базовая-copy' },
	{ id: 1, label: 'Автор версии', val: 'Роза Львовна' },
	{ id: 2, label: 'Версия создана', val: '22.07.25 15:10' },
	{ id: 2, label: 'Версия изменена', val: '22.07.25 15:10' },
]
const cols2: QTableProps['columns'] = [
	{
		name: 'version',
		required: true,
		label: 'Версия',
		align: 'left',
		field: 'version',
		sortable: true,
	},
	{
		name: 'author',
		required: true,
		label: 'Автор',
		align: 'left',
		field: 'author',
		sortable: true,
	},
	{
		name: 'created',
		required: true,
		label: 'Создана',
		align: 'left',
		field: 'created',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	{
		name: 'status',
		required: true,
		label: 'Статус',
		align: 'left',
		field: 'status',
		sortable: true,
	},
	{
		name: 'col1',
		required: true,
		label: 'DV-Test',
		align: 'left',
		field: 'col1',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	{
		name: 'col2',
		required: true,
		label: 'DV-Main',
		align: 'left',
		field: 'col2',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	{
		name: 'col3',
		required: true,
		label: 'DV-Prod',
		align: 'left',
		field: 'col3',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
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
const rows2: any = ref([
	{
		id: 0,
		version: 'Базовая-copy',
		author: 'Роза Львовна',
		created: 1755533353568,
		status: 'Ожидает публикации',
		col1: 1755533483568,
	},
	{
		id: 1,
		version: 'Базовая',
		author: 'Орлов П.С.',
		created: 1755513353568,
		status: 'Черновик',
		col1: 1755514353601,
		col3: 1755514853601,
	},
])

const versions = ref(false)
const map = ref(true)
const bd = ref(false)
</script>

<template lang="pug">
q-page(padding)
	.cont
		.grid
			div
				.inf
					template(v-for="item in dat" :key='item.id')
						label {{ item.label }}:
						.val {{ item.val }}

			div
				.inf
					template(v-for="item in dat1" :key='item.id')
							label {{ item.label }}:
							.val {{ item.val }}

			.wait Ожидает публикации

		br
		q-expansion-item(
			v-model='versions'
			expand-separator
			header-class='exphd'
			label="Версии приложения")

			q-table(flat,
				:columns="cols2"
				:rows="rows2"
				row-key="id"
				color="primary"
				hide-bottom
				)
				template(v-slot:body-cell-action)
					q-td.text-right(auto-width)
						q-btn(flat round icon="mdi-dots-vertical" color="primary" dense) 

		q-expansion-item(
			v-model='bd'
			expand-separator
			header-class='exphd'
			label="Базы данных")
			q-card
				div Тут базы данных
		q-expansion-item(
			v-model='map'
			expand-separator
			header-class='exphd'
			label="Маппинг справочников")

			q-card
				div Тут маппинг

		br
		q-card-actions(align='center')
			q-btn(flat color="primary" label="Отмена" ) 
			q-btn(unelevated color="primary" label="Опубликовать" ) 

</template>

<style scoped lang="scss">
.q-page {
	--width: 1000px;
}
.q-card {
	padding: 1rem;
	border-radius: 0.4rem;
	box-shadow: var(--shad0);
}
.cont {
	max-width: var(--width);
	margin: 1rem auto;
}
.grid {
	max-width: var(--width);
	margin: 0 auto;
	background: white;
	box-shadow: var(--shad0);
	padding: 1rem 2rem;
	border-radius: 0.4rem;
	display: flex;
	justify-content: space-between;
}
.inf {
	display: grid;
	grid-template-columns: max-content 1fr; // ширина по содержимому
	column-gap: 1rem;
	row-gap: 0.25rem;
}
.wait {
	align-self: center;
	color: $negative;
}
label {
	color: #666;
}
</style>
