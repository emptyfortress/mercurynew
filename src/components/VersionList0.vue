<script setup lang="ts">
import { ref, computed } from 'vue'
import type { QTableProps } from 'quasar'
import { useQuasar, date } from 'quasar'
import AddDialog from '@/components/AddDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useRouter, useRoute } from 'vue-router'
import { useApps } from '@/stores/apps'
import MappingDialog from '@/components/MappingDialog.vue'
import SvgSpinnersBarsRotateFade from '@/components/icons/SvgSpinnersBarsRotateFade.vue'

const router = useRouter()

const props = defineProps<{
	versions: Ver[]
	item: App
}>()

console.log('item ', props.item)
console.log('versions ', props.versions)
const myapps = useApps()

const cols: QTableProps['columns'] = [
	{
		name: 'ver',
		required: true,
		label: 'Версия',
		align: 'left',
		field: 'ver',
		sortable: false,
	},
	{
		name: 'modified',
		required: true,
		label: 'Изменено',
		align: 'left',
		field: 'modified',
		sortable: false,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	{
		name: 'published',
		required: true,
		label: 'Статус',
		align: 'center',
		field: 'published',
		sortable: false,
	},
]

const ve = ref('version')

const $q = useQuasar()

const remove = (id: number) => {
	myapps.removeVersion(props.versions, id)

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-delete-outline',
			color: 'negative',
			message: 'Версия удалена',
			position: 'top',
		})
	}, 500)
}

const currentVer = ref('')

const dialog = ref(false)
const dialog1 = ref(false)

const create = (e: any) => {
	props.versions.map((el) => (el.current = false))
	myapps.addVersion(props.versions, e)
	expandedRows.value = [props.item.versions[0].id]

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Создана новая версия',
			position: 'top',
		})
	}, 500)
}

function viewSettings(id: number) {
	ve.value = 'edit'
	dialog1.value = true
}

function testVersion() {
	ve.value = 'check'
	dialog1.value = true
}

async function edit(id: number) {
	let row = props.versions.find((el) => el.id === id)
	props.versions.forEach((el) => (el.current = false)) // лучше forEach, а не map

	if (row) {
		row.current = true
		await router.push('/process')

		row.modified = Date.now()
		myapps.currentApp!.master = false
	}
}

function createVersion(id: number) {
	let tmp = props.versions.findIndex((el) => el.id == id)
	if (tmp > -1) {
		currentVer.value = props.versions[tmp].label
		dialog.value = !dialog.value
	}
}

interface RowData {
	id: number
	label: string
	descr: string
	modified: string
	published: number // 0, 1, 2
}

interface MenuItem {
	id: number
	icon: string
	label: string
	action: (rowId: number) => void
}

const menu: MenuItem[] = [
	{ id: 0, icon: 'mdi-eye', label: 'Просмотреть настройки', action: viewSettings },
	{ id: 1, icon: 'mdi-pencil', label: 'Редактировать', action: edit },
	{
		id: 2,
		icon: 'mdi-plus-box-multiple-outline',
		label: 'Создать версию на основе',
		action: createVersion,
	},
	{ id: 3, icon: 'mdi-delete-outline', label: 'Удалить', action: remove },
]

function getMenuForRow(row: RowData) {
	return menu.filter((item) => {
		if (item.id === 3 && props.versions.length == 1) return false
		if (item.id === 0 && row.published == 0) return false
		if (item.id === 1 && row.published > 0) return false
		if (item.id === 3 && row.published !== 0) return false
		return true
	})
}

function getMenuForRow1(row: RowData) {
	return menu.filter((item) => {
		if (item.id === 0 && row.published == 0) return false
		if (item.id === 1 && row.published > 0) return false
		if (item.id === 2 && row.published == 0) return false
		if (item.id === 3 && props.versions.length == 1) return false
		if (item.id === 3 && row.published > 0) return false
		// if (item.id === 3 && row.published !== 0) return false
		return true
	})
}

const calcClass = (id: number) => {
	return id == 3 ? 'pub' : ''
}

const isSomePublished = computed(() => {
	return props.versions.find((el) => el.published == 2)
})

const lastPublication = computed(() => {
	let tmp = props.versions.find((el) => el.published == 2)
	if (tmp) return tmp.label
})

const pubDate = computed(() => {
	let tmp = props.versions.find((el) => el.published == 2)
	if (tmp) return date.formatDate(tmp.pubDate, 'DD.MM.YY HH:mm')
})
const formatDate = (e: number) => {
	return date.formatDate(e, 'DD.MM.YY HH:mm')
}

const btmenu = [
	{ id: 0, label: 'Тестировать', icon: 'mdi-test-tube', action: '' },
	{ id: 1, label: 'Опубликовать', icon: 'mdi-cloud-upload-outline', action: '' },
	// { id: 2, label: 'Создать версию на основе', icon: 'mdi-plus-box-multiple-outline', action: '' },
	{ id: 3, label: 'Удалить', icon: 'mdi-delete-outline', action: '' },
]
const btmenu2 = [
	{ id: 0, label: 'Просмотреть', icon: 'mdi-eye', action: viewSettings },
	{
		id: 2,
		label: 'Создать версию на основе',
		icon: 'mdi-plus-box-multiple-outline',
		action: viewSettings,
	},
]

const expandedRows = ref([props.item.versions[0].id])

const formattedString = computed(() => {
	return date.formatDate(timeStamp.value, 'DD.MM.YY HH:mm')
})
const letcheck = computed({
	get: () => myapps.curVersion(props.item).tested !== undefined,
	set: (val) => {
		myapps.curVersion(props.item).tested = val ? formattedString.value : undefined
	},
})

const precheck = ref(false)
const precheck1 = ref(false)

const timeStamp = ref(Date.now())
const check = () => {
	precheck.value = true
	setTimeout(() => {
		myapps.curVersion(props.item).tested = formattedString.value
		timeStamp.value = Date.now()
		precheck.value = false
		letcheck.value = true
	}, 4000)
}

const dialog2 = ref(false)

const prepublish = (ver: number) => {
	if (ver == 1) {
		myapps.curVersion(props.item).published = ver
		myapps.curVersion(props.item).pubDate = Date.now()
		props.item.published = ver
		props.item.publishDate = Date.now()

		props.item.master = false
		setTimeout(() => {
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'positive',
				message: 'Приложение передано на публикацию!',
				position: 'top',
			})
		}, 3000)
	}
	if (ver == 2) {
		dialog2.value = true
	}
}
const add = () => {
	currentVer.value = myapps.curVersion(props.item).label
	dialog.value = !dialog.value
}
const publish = () => {
	precheck1.value = true
	myapps.curVersion(props.item).published = 2
	myapps.curVersion(props.item).pubDate = Date.now()
	props.item.published = 2
	props.item.publishDate = Date.now()

	props.item.master = false

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Приложение опубликовано!',
			position: 'top',
		})
		precheck1.value = false
	}, 4000)
}
const handlePub = () => {
	ve.value = 'publ'
	dialog1.value = true
}
</script>

<template lang="pug">
q-table(
	flat
	:columns="cols"
	:rows='props.versions'
	v-model:expanded='expandedRows'
	row-key="id"
	color="primary"
	dense
	hide-bottom
)

	template(v-slot:header="props")
		q-tr(:props="props")
			q-th(auto-width)
			q-th(
				v-for="col in props.cols"
				:key="col.name"
				:props="props"
			) {{ col.label }}
			q-th.fixwidth

	template(v-slot:body="props")
		q-tr(:props="props" :class="props.rowIndex === 0 ? 'first-row-separator' : ''")
			q-td(auto-width)
				q-btn.exp(size="sm" color="primary" round flat dense @click="props.expand = !props.expand" icon="mdi-chevron-right" :class='{rot : props.expand}')
			q-td
				.text-bold {{ props.row.label }}

			q-td {{ date.formatDate(props.row.modified, 'DD.MM.YY HH:mm') }}
			q-td.text-center
				.caption(v-if='props.row.published == 0') Черновик
				.red(v-if='props.row.published == 1' ) Ожидает публикации
				.red(v-if='props.row.published == 2' ) Опубликовано

			q-td.fixwidth
				template(v-if='props.rowIndex == 0')
					q-btn(v-if='props.row.published == 0' unelevated icon='mdi-pencil' color="primary" label="Редактировать" size='sm' @click='edit(props.row.id)')
					q-btn(v-if='props.row.published > 0' unelevated icon='mdi-eye' color="primary" label="Просмотр" size='sm' @click='edit(props.row.id)')

				q-btn.men(v-else flat round color="primary" size='sm')
					q-icon(name="mdi-dots-vertical"  size="24px")
					q-menu
						q-list
							q-item(clickable v-for="item in btmenu2" :key="item.id" v-close-popup @click='item.action(props.row.id)')
								q-item-section(side)
									q-icon(:name="item.icon" color="primary")
								q-item-section {{ item.label }}


		q-tr(v-show="props.expand" :props="props")
			q-td(colspan="4")
				.fle
					.grids
						label Название:
						.val {{props.row.label}}
						label Описание:
						.val {{props.row.descr}}
						label Создано:
						.val {{ date.formatDate(props.row.created, 'DD.MM.YY HH:mm') }}
						label Автор версии:
						.val {{props.row.author}}
						label Изменено:
						.val {{ date.formatDate(props.row.modified, 'DD.MM.YY HH:mm') }}
						label Тестирование:
						.val
							.check(v-if='precheck')
								SvgSpinnersBarsRotateFade.big
								span Загрузка версии на тестовый сервер
							div(v-if='letcheck')
								span Версия доступна для тестирования на
								span.link() DV-test
								span {{ props.row.tested }}
						label Публикация:
						.val
							div(v-if='props.row.published == 1')
								span Версия передана на публикацию
								span.q-ml-md {{ date.formatDate(props.row.pubDate, 'DD.MM.YY HH:mm') }}
							div(v-if='props.row.published == 2')
								span Версия опубликована на
								span.link DV-Prod
								span {{ pubDate }} -- Орлов П.С.

			q-td.fixwidth
				div(v-if='props.row.published > 0' )
					q-btn(outline color="primary" label="Создать версию" @click="add" size='sm') 
				div(v-if='props.row.modified && props.row.published == 0')
					div
						q-btn(outline color="primary" label="Тестировать" @click="testVersion" size='sm') 
					div
						q-btn.q-mt-xs(outline color="primary" label="Опубликовать" @click="handlePub" size='sm') 
				

		q-tr(v-if="props.rowIndex === 0" class="empty-row-spacer")
			q-td(:colspan="props.cols.length + 2")
			
MappingDialog(v-model="dialog2" bd='DV-prod' @publish="publish")
AddDialog(v-model="dialog" mode='version' :current='currentVer' @create="create")
ConfirmDialog(v-model="dialog1" :mode='ve' @publish='prepublish' @check='check')

</template>

<style scoped lang="scss">
.cont {
	max-width: 1400px;
	margin: 0 auto;
}
.current {
	background: var(--selection);
}

.hd {
	font-size: 1.3rem;
	text-align: center;
}
.hd1 {
	font-size: 1rem;
	text-align: center;
	margin-bottom: 0.5rem;
	img {
		margin-bottom: -2px;
	}
}
.grid {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: 1fr 1fr;
	align-items: start;
	column-gap: 1rem;
	row-gap: 0.5rem;
	.constructor {
		padding: 1rem;
		background: #ffffff77;
		border-radius: 0.5rem;
		border: 1px solid white;
		margin-bottom: 0.5rem;
	}
}
.server.drag-over {
	border: 2px dashed $primary;
	background-color: #e3f2fd;
}
.dr {
	height: 100%;
}
.myitem {
	display: grid;
	align-items: center;
	grid-template-columns: auto 1fr 1fr auto;
	// min-height: 48px;
	cursor: pointer;
	padding: 0.5rem;
	&:hover {
		background: white;
	}
}
.myitem:not(:last-child) {
	border-bottom: 1px solid #ccc;
}
.ic {
	width: 20px;
	height: 20px;
}
.selected {
	background: var(--selection);
}
.plu {
	grid-column: 2/3;
}
.link {
	font-weight: 600;
	color: $primary;
	text-decoration: underline;
	&:hover {
		text-decoration: none;
	}
}
.caption {
	font-size: 0.8rem;
	margin: 0;
}
.pub {
	color: darkred;
	line-height: 1.2;
}
:deep(.first-row-separator td) {
	border-bottom: 2px solid $primary !important;
	background-color: var(--node);
}
.exp {
	transition: 0.2s ease transform;
	&.rot {
		transform: rotate(90deg);
	}
}
.fle {
	display: flex;
	gap: 2rem;
	align-items: center;
}
.grids {
	margin-top: 0.5rem;
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	justify-items: start;
	column-gap: 1rem;
	row-gap: 0;
	font-size: 0.8rem;
	label {
		color: #666;
	}
}
.link {
	color: $primary;
	text-decoration: underline;
	cursor: pointer;
	margin-left: 1rem;
	margin-right: 1rem;
}
.fixwidth {
	width: 170px;
	text-align: right;
	.q-btn {
		width: 100%;
	}
	.men {
		width: initial;
	}
}
.check {
	color: darkred;
	.big {
		// font-size: 1.1rem;
		margin-right: 1rem;
	}
}
.red {
	font-weight: 600;
	color: darkred;
}
</style>
