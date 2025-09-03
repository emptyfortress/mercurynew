<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import { date } from 'quasar'
import SvgSpinners3DotsRotate from '@/components/icons/SvgSpinners3DotsRotate.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
		label: 'Кто публикует',
		align: 'left',
		field: 'author',
		sortable: true,
	},
	{
		name: 'created',
		required: true,
		label: 'Дата обращения',
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
const cols1: QTableProps['columns'] = [
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
		name: 'started',
		required: true,
		label: 'Дата старта',
		align: 'left',
		field: 'started',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
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
		status: 1,
	},
	{
		id: 3,
		app: 'Заявка на отпуск',
		version: 'Базовая-copy',
		author: 'Сирень Крокодиловна',
		created: 1755513363568,
		status: 1,
	},
	{
		id: 1,
		app: 'Управление командировками',
		version: 'Базовая-сopy',
		author: 'Роза Львовна',
		created: 1755515353569,
		status: 2,
	},

	{
		id: 2,
		app: 'Служебные записки',
		version: 'Версия 5',
		author: 'Лотос Тигрович',
		created: 1755516353569,
		status: 1,
	},
])

const progress: any = ref([])

const currentApp = ref()
const prepublish = (_evt: any, row: any) => {
	currentApp.value = row
	router.push('/map')
}

const publish = (row: any) => {
	let tmp = rows.value.findIndex((el: any) => el.id == row.id)
	if (tmp > -1) {
		rows.value.splice(tmp, 1)
	}
	row.started = Date.now()
	row.db = 'DV-Prod'
	progress.value.push(row)
}

const remove = (row: any) => {
	let tmp = progress.value.findIndex((el: any) => el.id == row.id)
	if (tmp > -1) {
		progress.value.splice(tmp, 1)
	}
}
</script>

<template lang="pug">
.h7 Ожидают публикации
q-table(flat,
	:columns="cols"
	:rows="rows"
	row-key="id"
	color="primary"
	hide-bottom
	@row-click='prepublish'
	)
	template(v-slot:body-cell-status='props')
		q-td.text-center(:props='props')
			span(v-if='props.row.status == 1') Ожидает публикации
			span.red(v-else)
				q-icon(name="mdi-alert-octagon" color="negative" size="22px")
				|&nbsp;Ошибка

	template(v-slot:body-cell-actions='props')
		q-td.text-center(:props='props' auto-width)
			q-btn(flat round color="primary" icon="mdi-cloud-upload-outline" @click.stop='publish(props.row)' size='md' dense) 
			q-btn(flat round color="primary" icon="mdi-dots-vertical" @click.stop size='md' dense) 
				q-menu
					q-list
						q-item(clickable)
							q-item-section Опубликовать
						q-item(clickable).pink
							q-item-section Удалить

br
template(v-if='progress.length')
	.h7 В процессе публикации
	q-table(flat,
		:columns="cols1"
		:rows="progress"
		row-key="id"
		color="primary"
		hide-bottom
		)
		template(v-slot:body-cell-status='props')
			q-td.text-center(:props='props')
				template(v-if='props.row.status == 1')
					SvgSpinners3DotsRotate
					span &nbsp;&nbsp;Публикация
				span.red(v-else)
					q-icon(name="mdi-alert-octagon" color="negative" size="22px")
					|&nbsp;Ошибка

		template(v-slot:body-cell-actions='props')
			q-td.text-center(:props='props' auto-width)
				q-btn(v-if='props.row.status == 1' flat round color="primary" icon="mdi-pause" @click="" size='md' dense) 
				q-btn(v-else flat round color="primary" icon="mdi-delete-outline" @click="remove(props.row)" size='md' dense) 
				q-btn(flat round color="primary" icon="mdi-dots-vertical" @click="" size='md' dense) 
</template>

<style scoped lang="scss">
.red {
	color: $negative;
	font-weight: 600;
}
</style>
