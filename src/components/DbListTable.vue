<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import { date } from 'quasar'

const selection = defineModel<any[]>('selection', { default: [] })

const cols: QTableProps['columns'] = [
	{
		name: 'server',
		required: true,
		label: 'База данных',
		align: 'left',
		field: 'server',
		sortable: true,
	},
	{
		name: 'env',
		required: true,
		label: 'Среда',
		align: 'left',
		field: 'env',
		sortable: true,
	},
	{
		name: 'last',
		required: true,
		label: 'Последняя публикация данного приложения',
		align: 'left',
		field: 'last',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
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
		server: 'DV-Test',
		env: 'test',
		last: 1755533353568,
		version: 'Базовая',
	},
	{
		id: 1,
		server: 'DV-Main',
		env: 'prod',
		last: null,
		version: null,
	},
	{
		id: 2,
		server: 'DV-Prod',
		env: 'prod',
		last: null,
		version: null,
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
