<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import { date } from 'quasar'

const cols: QTableProps['columns'] = [
	{
		name: 'app',
		required: true,
		label: 'Приложениe',
		align: 'left',
		field: 'app',
		sortable: true,
	},
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
		label: 'Дата создания',
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
		name: 'actions',
		required: true,
		label: '',
		align: 'right',
		field: 'actions',
		sortable: false,
	},
]
const rows: any = ref([
	{
		id: 0,
		app: 'Заявка на отпуск',
		version: 'Базовая',
		author: 'Орлов П.С.',
		created: 1755513353568,
		status: 'Ожидает публикации',
	},
	{
		id: 3,
		app: 'Заявка на отпуск',
		version: 'Базовая-copy',
		author: 'Сирень Крокодиловна',
		created: 1755513363568,
		status: 'Ожидает публикации',
	},
	{
		id: 1,
		app: 'Управление командировками',
		version: 'Базовая-сopy',
		author: 'Роза Львовна',
		created: 1755515353569,
		status: 'Ожидает публикации',
	},

	{
		id: 2,
		app: 'Служебные записки',
		version: 'Версия 5',
		author: 'Лотос Тигрович',
		created: 1755516353569,
		status: 'Ожидает публикации',
	},
])
</script>

<template lang="pug">
.h7 Ожидают публикации
q-table(flat,
	:columns="cols"
	:rows="rows"
	row-key="id"
	color="primary"
	hide-bottom
	)
	template(v-slot:body-cell-actions='props')
		q-td.text-center(:props='props' auto-width)
			q-btn(flat round color="primary" icon="mdi-cloud-upload-outline" @click="" size='md' dense) 
			q-btn(flat round color="primary" icon="mdi-dots-vertical" @click="" size='md' dense) 
</template>

<style scoped lang="scss"></style>
