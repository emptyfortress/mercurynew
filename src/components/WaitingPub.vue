<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import { date } from 'quasar'
import SvgSpinnersBarsRotateFade from '@/components/icons/SvgSpinnersBarsRotateFade.vue'
import MappingDialog from '@/components/MappingDialog.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const cols: QTableProps['columns'] = [
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
		name: 'col2',
		required: true,
		label: 'DV-Main',
		align: 'center',
		field: 'col2',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	{
		name: 'col3',
		required: true,
		label: 'DV-Prod',
		align: 'center',
		field: 'col3',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
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
		col2: 1755514403568,
		status: 1,
	},
	{
		id: 3,
		app: 'Заявка на отпуск',
		version: 'Базовая-copy',
		author: 'Сирень Крокодиловна',
		created: 1755513363568,
		col3: 1755514253568,
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
		col2: 0,
	},
])

const progress: any = ref([])

const curDB = ref('')
const curRow: any = ref()
const dialog = ref(false)

const prepublish = (e: any, db: string) => {
	curDB.value = db
	curRow.value = e
	dialog.value = !dialog.value
}

const publish = () => {
	curRow.value.started = Date.now()
	curRow.value.db = curDB.value
	curRow.value.status = 1
	progress.value.push(curRow.value)
	setTimeout(() => {
		curRow.value.status = 2
	}, 3000)
}

const remove = (row: any) => {
	let tmp = rows.value.findIndex((el: any) => el.id == row.id)
	if (tmp > -1) {
		rows.value.splice(tmp, 1)
		setTimeout(() => {
			$q.notify({
				icon: 'mdi-cancel',
				color: 'negative',
				message: 'Публикация отклонена, версия переведена в статус "Черновик"',
			})
		}, 1200)
	}
}

const dat = (val: number) => {
	return date.formatDate(val, 'DD.MM.YY HH:mm')
}

const errPub = () => {
	let tmp = rows.value.findIndex((el: any) => el.id == 2)
	if (tmp > -1) {
		rows.value.splice(tmp, 1)
	}
	progress.value.push({
		id: 2,
		app: 'Служебные записки',
		version: 'Версия 5',
		author: 'Лотос Тигрович',
		created: 1755516353569,
		started: Date.now(),
		db: 'DV-Main',
		status: 0,
		col2: 0,
	})
}
</script>

<template lang="pug">
template(v-if='rows.length')
	.h7 Ожидают публикации
	q-table(flat,
		:columns="cols"
		:rows="rows"
		row-key="id"
		color="primary"
		hide-bottom
		)
		template(v-slot:header-cell-col2='props')
			q-th
				q-icon.q-mr-sm(name="mdi-database-outline" color="primary" size="18px")
				span.text-bold.text-primary {{ props.col.label}}
		template(v-slot:header-cell-col3='props')
			q-th
				q-icon.q-mr-sm(name="mdi-database-outline" color="primary" size="18px")
				span.text-bold.text-primary {{ props.col.label}}

		template(v-slot:body-cell-col2='props')
			q-td.text-center(:props='props')
				q-btn(v-if='props.row.col2 == undefined' flat color="primary" icon='mdi-cloud-upload' label="Опубликовать" @click="prepublish(props.row, 'DV-Main')" size='sm') 
				.red(v-if='props.row.col2 == 0' @click='errPub')
					q-icon(name="mdi-close-octagon" color="negative")
					|&nbsp;&nbsp;Ошибка
				div(v-else) {{ dat(props.row.col2) }}

		template(v-slot:body-cell-col3='props')
			q-td.text-center(:props='props')
				q-btn(v-if='!props.row.col3' flat color="primary" icon='mdi-cloud-upload' label="Опубликовать" @click="prepublish(props.row, 'DV-Prod')" size='sm') 
				div(v-else) {{ dat(props.row.col3) }}


		template(v-slot:body-cell-actions='props')
			q-td.text-center(:props='props' auto-width)
				q-btn(flat round color="primary" icon="mdi-dots-vertical" @click.stop size='md' dense) 
					q-menu
						q-list
							q-item(clickable)
								q-item-section(side)
									q-icon(name="mdi-pencil" color="primary")
								q-item-section Открыть версию
							q-item(clickable color="negative" @click='remove(props.row)')
								q-item-section(side)
									q-icon(name="mdi-cancel" color="negative")
								q-item-section Отклонить публикацию


MappingDialog(v-model="dialog" :bd='curDB' @publish="publish")
</template>

<style scoped lang="scss">
.red {
	color: $negative;
	font-weight: 600;
}
</style>
