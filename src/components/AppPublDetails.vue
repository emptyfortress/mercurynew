<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApps } from '@/stores/apps'
import type { QTableProps } from 'quasar'
import { date } from 'quasar'
import DetailsAppEvents from '@/components/DetailsAppEvents.vue'

const props = defineProps<{ id: string; type: string }>()

const myapps = useApps()

const current = computed(() => {
	return myapps.flatApps.find((el) => el.id == props.id)
})

const cols1: QTableProps['columns'] = [
	{
		name: 'db',
		required: true,
		label: 'Сервер | БД',
		align: 'center',
		field: 'db',
		sortable: false,
	},
	{
		name: 'users',
		required: true,
		label: 'Пользователи',
		align: 'center',
		field: 'users',
		sortable: false,
	},
	{
		name: 'advanced',
		required: true,
		label: 'Продвинутые пользователи',
		align: 'center',
		field: 'advanced',
		sortable: false,
	},
	{
		name: 'author',
		required: true,
		label: 'Автор',
		align: 'center',
		field: 'author',
		sortable: false,
	},
	{
		name: 'admin',
		required: true,
		label: 'Администраторы',
		align: 'center',
		field: 'admin',
		sortable: false,
	},
]

const rows1: any = ref([
	{
		id: 0,
		db: 'DV-Test',
		author: true,
		admin: true,
		advanced: true,
		users: true,
	},
	{
		id: 1,
		db: 'DV-Main',
		author: true,
		admin: true,
		advanced: false,
		users: false,
	},
	{
		id: 2,
		db: 'DV-Prod',
		author: false,
		admin: true,
		advanced: true,
		users: false,
	},
])

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
</script>

<template lang="pug">
div
	h6
		component.ic(:is='current?.pic')
		|{{ current?.label || 'fuck'}}
	br
	.h7 Версии приложения
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

	br
	DetailsAppEvents

</template>

<style scoped lang="scss">
.ic {
	font-size: 1.8rem;
	margin-right: 0.5rem;
	margin-bottom: -5px;
}
</style>
