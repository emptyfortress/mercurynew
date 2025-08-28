<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'

const columns: QTableProps['columns'] = [
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
		label: 'Автор',
		align: 'left',
		field: 'author',
		sortable: true,
	},
	{
		name: 'created',
		label: 'Создана',
		align: 'left',
		field: 'created',
		sortable: true,
	},
	{
		name: 'status',
		label: 'Статус',
		align: 'left',
		field: 'status',
		sortable: true,
	},
	{
		name: 'col1',
		label: 'DV-Test',
		field: 'col1',
		align: 'center',
		sortable: true,
	},
	{
		name: 'col2',
		label: 'DV-Preprod',
		field: 'col2',
		align: 'center',
		sortable: true,
	},
	{
		name: 'col3',
		label: 'DV-Prod',
		field: 'col3',
		align: 'center',
		sortable: true,
	},
]

const rows = ref([
	{ id: 1, name: 'Иван', age: 25, col1: 'A', col2: 'B', col3: 'C' },
	{ id: 2, name: 'Анна', age: 30, col1: 'X', col2: 'Y', col3: 'Z' },
])
</script>

<template lang="pug">
q-table(
	:rows="rows",
	:columns="columns",
	row-key="id"
	title='Версии приложения'
	hide-bottom
)
	template(v-slot:header="props")
		q-tr.head(:props="props")
			q-th(rowspan="2") {{ props.cols[0].label }}
			q-th(rowspan="2") {{ props.cols[1].label }}
			q-th(rowspan="2") {{ props.cols[2].label }}
			q-th(rowspan="2") {{ props.cols[3].label }}
			q-th.both(:colspan="3") Последняя публикация
		q-tr
			q-th.text-center(v-for="col in props.cols.slice(4)" :key="col.name")
				q-icon(name="mdi-database-outline" color="secondary" size="16px")
				|&nbsp;{{ col.label }}
</template>

<style scoped lang="scss">
th {
	// border: 1px solid #ccc;
}
.q-table tr.head {
	height: initial;
}
.both {
	background: #eee;
}
</style>
