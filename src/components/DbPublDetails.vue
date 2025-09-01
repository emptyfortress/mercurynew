<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApps } from '@/stores/apps'
import { date } from 'quasar'
import type { QTableProps } from 'quasar'
import DetailsAppEvents from '@/components/DetailsAppEvents.vue'

const props = defineProps<{ id: number; type: string }>()

const myapps = useApps()

const current = computed(() => {
	return myapps.db.find((el) => el.id == props.id)
})

const cols: QTableProps['columns'] = [
	{
		name: 'app',
		required: true,
		label: 'Приложение',
		align: 'left',
		field: 'app',
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
		name: 'version',
		required: true,
		label: 'Версия',
		align: 'left',
		field: 'version',
		sortable: true,
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
		name: 'date',
		required: true,
		label: 'Дата публикации',
		align: 'left',
		field: 'date',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	{
		name: 'action',
		required: true,
		label: '',
		align: 'left',
		field: 'action',
		sortable: true,
	},
]
const rows: any = ref([
	{
		id: 0,
		app: 'Заявки на отпуск',
		author: 'Орлов П.С.',
		date: 1755513353568,
		version: 'Базовая-сopy',
		status: 'Опубликовано',
	},
	{
		id: 1,
		app: 'Управление командировками',
		author: 'Орлов П.С.',
		date: 1752512353568,
		version: 'Пробная',
		status: 'Опубликовано',
	},
	{
		id: 2,
		app: 'Партнерский форум',
		author: 'Роза Львовна',
		date: 1751513353568,
		version: 'Базовая',
		status: 'Опубликовано',
	},
	{
		id: 3,
		app: 'Квартальный отчет',
		author: 'Роза Львовна',
		date: 1751413353568,
		version: 'Базовая',
		status: 'Опубликовано',
	},
])

const cols1: QTableProps['columns'] = [
	{
		name: 'app',
		required: true,
		label: 'Приложение',
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
		name: 'date',
		required: true,
		label: 'Дата публикации',
		align: 'left',
		field: 'date',
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
		name: 'action',
		required: true,
		label: '',
		align: 'left',
		field: 'action',
		sortable: true,
	},
]

const rows1: any = [
	{
		id: 0,
		app: 'Заявки на отпуск',
		version: 'Версия 0',
		date: 1755513353568,
		status: 'Архив',
	},
	{
		id: 1,
		app: 'Заявки на отпуск',
		version: 'Версия 1',
		date: 1755523353569,
		status: 'Архив',
	},
	{
		id: 2,
		app: 'Заявки на отпуск',
		version: 'Базовая',
		date: 1755523553569,
		status: 'Архив',
	},
]
const page = {
	sortBy: 'date',
	descending: true,
}
</script>

<template lang="pug">
div
	h6
		q-icon(name="mdi-database-outline")
		|&nbsp;{{ current?.label || 'fuck'}}
	br
	h7 Установленные приложения
	q-table(flat,
		:columns="cols"
		:rows="rows"
		row-key="id"
		color="primary"
		hide-bottom
		)
		template(v-slot:body-cell-action='props')
			q-td.text-right(:props='props')
				q-btn(flat color="primary" icon="mdi-dots-vertical" dense) 

	br
	h7 Архив версий
	q-table(flat,
		:columns="cols1"
		:rows="rows1"
		row-key="id"
		color="primary"
		:pagination='page'
		hide-bottom
		)
		template(v-slot:body-cell-action='props')
			q-td.text-right(:props='props')
				q-btn(flat color="primary" icon="mdi-dots-vertical" dense) 

	br
	DetailsAppEvents

</template>

<style scoped lang="scss">
h6 .q-icon {
	margin-top: -3px;
	margin-right: 0.5rem;
	font-size: 1.8rem;
}
</style>
