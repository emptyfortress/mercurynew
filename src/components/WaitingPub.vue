<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import { date } from 'quasar'
import MappingDialog from '@/components/MappingDialog.vue'
import ErrDialog from '@/components/ErrDialog.vue'
import RejectDialog from '@/components/RejectDialog.vue'
import PublicationStatusCell from '@/components/PublicationStatusCell.vue'
import { useQuasar } from 'quasar'
import { useLogEventsStore } from '@/stores/logevents'
import { useApps } from '@/stores/apps'
import { useRouter } from 'vue-router'

const router = useRouter()

const myapps = useApps()

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
		app: 'Заявки на отпуск',
		version: 'Базовая',
		author: 'Орлов П.С.',
		created: 1755513353568,
		dvmain: 1755514403568,
		loadingMain: false,
		loadingProd: false,
	},
	{
		id: 3,
		app: 'Заявки на отпуск',
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
	const db = curDB.value

	if (db !== 'DV-Main' && db !== 'DV-Prod') {
		return
	}

	const loadingKey = db === 'DV-Main' ? 'loadingMain' : 'loadingProd'
	const dateKey = db === 'DV-Main' ? 'dvmain' : 'dvprod'

	curRow.value[loadingKey] = true

	setTimeout(() => {
		curRow.value[loadingKey] = false
		curRow.value[dateKey] = Date.now()
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: `Версия успешно опубликована на сервере ${db}`,
		})
		const maxId =
			logEventsStore.events.length > 0 ? Math.max(...logEventsStore.events.map((e) => e.id)) : -1
		logEventsStore.events.unshift({
			id: maxId + 1,
			date: Date.now(),
			app: curRow.value.app,
			user: 'admin',
			db: db,
			event: 'Публикация',
			result: true,
			reason: '',
		})
	}, 5000)
}

const remove1 = (row: any, reason: string) => {
	let tmp = rows.value.findIndex((el: any) => el.id == row.id)
	if (tmp > -1) {
		rows.value.splice(tmp, 1)
		setTimeout(() => {
			const maxId =
				logEventsStore.events.length > 0 ? Math.max(...logEventsStore.events.map((e) => e.id)) : -1
			logEventsStore.events.unshift({
				id: maxId + 1,
				date: Date.now(),
				app: row.app,
				user: 'admin',
				db: '--',
				event: 'Публикация отклонена',
				reason: reason,
				result: true,
			})
			$q.notify({
				icon: 'mdi-cancel',
				color: 'negative',
				message: 'Публикация отклонена.',
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
const rejectModal = ref(false)

const errPub = (row: any) => {
	curRow.value = row
	errModal.value = !errModal.value
}

const openRejectDialog = (row: any) => {
	curRow.value = row
	rejectModal.value = true
}

const goto = (name: string) => {
	let tmp = myapps.pathForEvent(name)
	if (tmp) {
		router.push(tmp)
	}
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
		PublicationStatusCell(:row="props.row" dbName="DV-Main" @prepublish="prepublish" @errPub="errPub")

	template(v-slot:body-cell-dvprod='props')
		PublicationStatusCell(:row="props.row" dbName="DV-Prod" @prepublish="prepublish")


	template(v-slot:body-cell-actions='props')
		q-td.text-center(:props='props' auto-width)
			q-btn(flat round color="primary" icon="mdi-dots-vertical" @click.stop size='md' dense) 
				q-menu
					q-list
						q-item(clickable @click='goto(props.row.app)')
							q-item-section(side)
								q-icon(name="mdi-pencil" color="primary")
							q-item-section Открыть версию

						q-item(clickable color="negative" @click='remove(props.row)' v-if='props.row.dvmain && props.row.dvprod')
							q-item-section(side)
								q-icon(name="mdi-close" color="primary")
							q-item-section Очистить

						q-item(clickable color="negative" @click='openRejectDialog(props.row)' v-else)
							q-item-section(side)
								q-icon(name="mdi-cancel" color="negative")
							q-item-section Отклонить публикацию


MappingDialog(v-model="dialog" :bd='curDB' @publish="publish")
ErrDialog(v-model="errModal" :bd='curDB' :row="curRow" @reject="openRejectDialog")
RejectDialog(v-model="rejectModal" :row="curRow" @reject="remove1")
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
