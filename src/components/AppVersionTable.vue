<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import { date } from 'quasar'

const selection = defineModel<any[]>('selection', { default: [] })

const cols: QTableProps['columns'] = [
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

const rows: any = ref([
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
	{
		id: 2,
		version: 'Суперверсия',
		author: 'Орлов П.С.',
		created: 1755613353568,
		status: 'Черновик',
		col1: 1755714353601,
		col3: 1755814853601,
	},
])

function handleRowClick(_evt: Event, row: any) {
	selection.value = [row]
}
</script>

<template lang="pug">
// .h7 Версии приложения
q-table(flat,
	:columns="cols"
	:rows="rows"
	row-key="id"
	color="primary"
	hide-bottom
	selection='single'
	v-model:selected='selection'
	@row-click="handleRowClick"
	)
	template(v-slot:body-cell-action)
		q-td.text-right(auto-width)
			q-btn(flat round icon="mdi-dots-vertical" color="primary" dense) 
</template>

<style scoped lang="scss"></style>
