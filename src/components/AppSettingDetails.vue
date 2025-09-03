<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApps } from '@/stores/apps'
import { useServers } from '@/stores/servers'
import type { QTableProps } from 'quasar'
import { date } from 'quasar'
import DetailsAppEvents from '@/components/DetailsAppEvents.vue'

const props = defineProps<{ id: string; type: string }>()

const myapps = useApps()
const server = useServers()

const current = computed(() => {
	return myapps.flatApps.find((el) => el.id == props.id)
})

const cols: QTableProps['columns'] = [
	{
		name: 'name',
		required: true,
		label: 'Пользователи',
		align: 'left',
		field: 'name',
		sortable: false,
	},
	{
		name: 'col0',
		required: true,
		label: 'Редактирование',
		align: 'center',
		field: 'col0',
		sortable: true,
	},
	{
		name: 'col1',
		required: true,
		label: 'DV-Test',
		align: 'center',
		field: 'col1',
		sortable: true,
	},
	{
		name: 'col2',
		required: true,
		label: 'DV-Main',
		align: 'center',
		field: 'col2',
		sortable: true,
	},
	{
		name: 'col3',
		required: true,
		label: 'DV-Prod',
		align: 'center',
		field: 'col3',
		sortable: true,
	},
]

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

const rows = ref(
	server.editors.map((item) => ({
		...item,
		id: item.id.toString(),
		col0: true,
		col1: false,
		col2: false,
		col3: false,
	}))
)

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
	.h7 Права на редактирование и публикацию

	q-table(flat,
		:columns="cols"
		:rows="rows"
		row-key="id"
		color="primary"
		hide-bottom
		)

		template(v-slot:body-cell-name='props')
			q-td.text-center(:props='props')
				q-icon(name="mdi-account-circle" color="primary" size="sm")
				|&nbsp;&nbsp; {{ props.row.name}}
				span.q-ml-sm(v-if='props.row.author') (Автор)

		template(v-slot:body-cell-col0="props")
			q-td.text-center(:props="props")
				q-checkbox(v-model="props.row.col0" dense)
		template(v-slot:body-cell-col1="props")
			q-td.text-center(:props="props")
				q-checkbox(v-model="props.row.col1" dense)
		template(v-slot:body-cell-col2="props")
			q-td.text-center(:props="props")
				q-checkbox(v-model="props.row.col2" dense)
		template(v-slot:body-cell-col3="props")
			q-td.text-center(:props="props")
				q-checkbox(v-model="props.row.col3" dense)

</template>

<style scoped lang="scss">
.ic {
	font-size: 1.8rem;
	margin-right: 0.5rem;
	margin-bottom: -5px;
}
</style>
