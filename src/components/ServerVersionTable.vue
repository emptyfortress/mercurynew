<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'

const columns: QTableProps['columns'] = [
	{
		name: 'version',
		required: true,
		label: 'Версия',
		align: 'center',
		field: 'value',
		format: (val: string) => val,
		sortable: true,
	},
	{
		name: 'published',
		required: true,
		label: 'Дата публикации',
		align: 'left',
		field: 'published',
		format: (val: string) => val,
		sortable: true,
	},
	{
		name: 'author',
		required: true,
		label: 'Автор',
		align: 'left',
		field: 'author',
		format: (val: string) => val,
		sortable: true,
	},
	{
		name: 'action',
		required: true,
		label: '',
		align: 'left',
		field: 'action',
		format: (val: string) => val,
		sortable: true,
	},
]

const versions = ref<Version[]>([
	{
		id: 2,
		label: '3.4',
		value: '3.4',
		created: '13.11.2023 15:13',
		published: '29.09.2023 11:18',
		author: 'Орлов П.С.',
		comment: '',
		current: true,
	},
	{
		id: 1,
		label: '2.2',
		value: '2.2',
		created: '28.09.2023 09:23',
		published: '18.10.2023 17:11',
		author: 'Орлов П.С.',
		comment: 'Доработки формы создания',
		current: false,
	},
	{
		id: 0,
		label: '1.0',
		value: '1.0',
		created: '20.06.2023 12:03',
		published: '23.06.2023 20:11',
		author: 'Орлов П.С.',
		comment: 'Стартовая версия',
		current: false,
	},
])
</script>

<template lang="pug">
q-table(flat, dense,
	:columns="columns"
	:rows="versions"
	row-key="id"
	color="primary"
	hide-bottom)

	template(v-slot:body-cell-action="props")
		q-td.text-right
			q-btn(flat round dense icon="mdi-delete-outline" color="negative" @click.stop="destroy(props.row)" size='sm') 
</template>

<style scoped lang="scss"></style>
