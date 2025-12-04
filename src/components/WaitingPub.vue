<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import { date } from 'quasar'
import MappingDialog from '@/components/MappingDialog.vue'
import ErrDialog from '@/components/ErrDialog.vue'
import { useQuasar } from 'quasar'
import { useLogEventsStore } from '@/stores/logevents'

const $q = useQuasar()
const logEventsStore = useLogEventsStore()
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
		name: 'author',
		required: true,
		label: 'Кто публикует',
		align: 'left',
		field: 'author',
		sortable: true,
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
		name: 'dvmain',
		required: true,
		label: 'DV-Main',
		align: 'center',
		field: 'dvmain',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	{
		name: 'dvprod',
		required: true,
		label: 'DV-Prod',
		align: 'center',
		field: 'dvprod',
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

const rows: any = ref([])

const rowsStart = [
	{
		id: 0,
		app: 'Заявка на отпуск',
		version: 'Базовая',
		author: 'Орлов П.С.',
		created: 1755513353568,
		dvmain: 1755514403568,
		loadingMain: false,
		loadingProd: false,
	},
	{
		id: 3,
		app: 'Заявка на отпуск',
		version: 'Базовая-copy',
		author: 'Сирень Крокодиловна',
		created: 1755513363568,
		dvprod: 1755514253568,
		loadingMain: false,
		loadingProd: false,
	},
	{
		id: 1,
		app: 'Управление командировками',
		version: 'Базовая-сopy',
		author: 'Роза Львовна',
		created: 1755515353569,
		loadingMain: false,
		loadingProd: false,
	},

	{
		id: 2,
		app: 'Служебные записки',
		version: 'Версия 5',
		author: 'Лотос Тигрович',
		created: 1755516353569,
		loadingMain: false,
		loadingProd: false,
		dvmain: 0,
	},
]

const load = () => {
	rows.value = [...rowsStart]
}

const curDB = ref('')
const curRow: any = ref()
const dialog = ref(false)

const prepublish = (e: any, db: string) => {
	curDB.value = db
	curRow.value = e
	dialog.value = !dialog.value
}

const publish = () => {
	curRow.value.db = curDB.value
	if (curDB.value == 'DV-Main') {
		curRow.value.loadingMain = true
		setTimeout(() => {
			curRow.value.loadingMain = false
			curRow.value.dvmain = Date.now()
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'positive',
				message: 'Версия успешно опубликована на сервере DV-Main',
			})
			const maxId = logEventsStore.events.length > 0 ? Math.max(...logEventsStore.events.map((e) => e.id)) : -1
			logEventsStore.events.unshift({
				id: maxId + 1,
				date: Date.now(),
				user: 'admin',
				db: curDB.value,
				event: 'Публикация',
				result: true,
			})
		}, 5000)
	}
	if (curDB.value == 'DV-Prod') {
		curRow.value.loadingProd = true
		setTimeout(() => {
			curRow.value.loadingProd = false
			curRow.value.dvprod = Date.now()
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'positive',
				message: 'Версия успешно опубликована на сервере DV-Prod',
			})
			const maxId = logEventsStore.events.length > 0 ? Math.max(...logEventsStore.events.map((e) => e.id)) : -1
			logEventsStore.events.unshift({
				id: maxId + 1,
				date: Date.now(),
				user: 'admin',
				db: curDB.value,
				event: 'Публикация',
				result: true,
			})
		}, 5000)
	}
}

const remove1 = (row: any) => {
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
const remove = (row: any) => {
	let tmp = rows.value.findIndex((el: any) => el.id == row.id)
	if (tmp > -1) {
		rows.value.splice(tmp, 1)
	}
}

const dat = (val: number) => {
	return date.formatDate(val, 'DD.MM.YY HH:mm')
}

const errModal = ref(false)

const errPub = () => {
	errModal.value = !errModal.value
}
</script>

<template lang="pug">
.h7(@click='load') Запросы на публикацию ({{rows.length}})
q-table(flat,
	:columns="cols"
	:rows="rows"
	row-key="id"
	)

	template(v-slot:no-data)
		q-icon.q-mr-md(name="mdi-emoticon-cool-outline" color="grey" size='md')
		span Запросы на публикацию отсутствуют.

	template(v-slot:header-cell-dvmain='props')
		q-th
			q-icon.q-mr-sm(name="mdi-database-outline" color="primary" size="18px")
			span.text-bold.text-primary {{ props.col.label}}

	template(v-slot:header-cell-dvprod='props')
		q-th
			q-icon.q-mr-sm(name="mdi-database-outline" color="primary" size="18px")
			span.text-bold.text-primary {{ props.col.label}}

	template(v-slot:body-cell-dvmain='props')
		q-td.text-center(:props='props')
			q-btn(v-if='props.row.dvmain==undefined' :loading="props.row.loadingMain" flat color="primary" icon='mdi-cloud-upload' label="Опубликовать" @click="prepublish(props.row, 'DV-Main')" size='sm') 
				template(v-slot:loading)
					q-spinner-gears(class="on-left" size='24px')
					span Публикация...

			.red(v-if='props.row.dvmain == 0' @click='errPub')
				q-icon(name="mdi-close-octagon" color="negative" size='20px')
				|&nbsp;&nbsp;19.08.25 16:12
			div(v-if='props.row.dvmain')
				q-icon(name="mdi-check-bold" color="positive" size='20px')
				.link {{ dat(props.row.dvmain) }}

	template(v-slot:body-cell-dvprod='props')
		q-td.text-center(:props='props')
			q-btn(v-if='!props.row.dvprod' :loading="props.row.loadingProd" flat color="primary" icon='mdi-cloud-upload' label="Опубликовать" @click="prepublish(props.row, 'DV-Prod')" size='sm') 
				template(v-slot:loading)
					q-spinner-gears(class="on-left" size='24px')
					span Публикация...
			div(v-else)
				q-icon(name="mdi-check-bold" color="positive" size='20px')
				.link {{ dat(props.row.dvprod) }}


	template(v-slot:body-cell-actions='props')
		q-td.text-center(:props='props' auto-width)
			q-btn(flat round color="primary" icon="mdi-dots-vertical" @click.stop size='md' dense) 
				q-menu
					q-list
						q-item(clickable)
							q-item-section(side)
								q-icon(name="mdi-pencil" color="primary")
							q-item-section Открыть версию
						q-item(clickable color="negative" @click='remove(props.row)' v-if='props.row.dvmain && props.row.dvprod')
							q-item-section(side)
								q-icon(name="mdi-close" color="primary")
							q-item-section Очистить

						q-item(clickable color="negative" @click='remove1(props.row)' v-else)
							q-item-section(side)
								q-icon(name="mdi-cancel" color="negative")
							q-item-section Отклонить публикацию


MappingDialog(v-model="dialog" :bd='curDB' @publish="publish")
ErrDialog(v-model="errModal" :bd='curDB' @publish="publish")
</template>

<style scoped lang="scss">
.red {
	color: $negative;
	cursor: pointer;
	// font-weight: 600;
}
.link {
	color: $primary;
	text-decoration: underline;
	margin-left: 0.5rem;
	display: inline;
	cursor: pointer;
}
:deep(.q-field__control:before) {
	background: #fff;
}
</style>
