<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { QTableProps } from 'quasar'
// import TablerCopyPlus from '@/components/icons/TablerCopyPlus.vue'
import { useQuasar, date } from 'quasar'
import AddDialog from '@/components/AddDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useRouter, useRoute } from 'vue-router'
import { useApps } from '@/stores/apps'

const router = useRouter()
const route = useRoute()

const props = defineProps<{
	versions: Ver[]
	item: App
}>()

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
	{
		name: 'test',
		required: true,
		label: 'DV-Test',
		align: 'left',
		field: 'test',
		sortable: false,
	},
	{
		name: 'prod',
		required: true,
		label: 'DV-Prod',
		align: 'left',
		field: 'prod',
		sortable: false,
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

const rows = [
	{
		id: 0,
		label: 'Базовая-copy',
		modified: '18.10.25',
		published: 0,
		test: '--',
		prod: '--',
	},
	{
		id: 1,
		label: 'Базовая',
		modified: '25.09.25',
		published: 1,
		test: '25.09.25',
		prod: '--',
	},
	{
		id: 2,
		label: 'Начальная',
		modified: '23.09.25',
		published: 2,
		test: '23.09.25',
		prod: '23.09.25',
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

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Создана новая версия',
			position: 'top',
		})
	}, 500)
}

// const page = {
// 	sortBy: 'current',
// 	sortOder: 'da',
// }

function viewSettings(id: number) {
	ve.value = 'edit'
	dialog1.value = true
	// router.push('/process')
}

function moveToFirst(arr: any[], predicate: (el: any) => boolean) {
	const index = arr.findIndex(predicate)
	if (index > -1) {
		const [item] = arr.splice(index, 1) // вырезаем элемент
		arr.unshift(item) // вставляем в начало
	}
	return arr
}

async function edit(id: number) {
	let row = props.versions.find((el) => el.id === id)
	props.versions.forEach((el) => (el.current = false)) // лучше forEach, а не map

	if (row) {
		row.current = true
		moveToFirst(props.versions, (el) => el.id === row.id) // ✅ исправлено
		router.push('/process')
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
	{ id: 0, label: 'Просмотреть', icon: 'mdi-eye', action: '' },
	// { id: 1, label: 'Опубликовать', icon: 'mdi-cloud-upload-outline', action: '' },
	{ id: 2, label: 'Создать версию на основе', icon: 'mdi-plus-box-multiple-outline', action: '' },
	// { id: 3, label: 'Удалить', icon: 'mdi-delete-outline', action: '' },
]

const navigate = async () => {
	// const path = route.fullPath.toString()
	await router.push('/process')
	myapps.setCurrentApp(props.item)
	// myapps.currentApp!.master = false
	// myapps.setGroupPath(group.value ? path : '')
	// myapps.setPath(group.value ? '' : path)
	myapps.curVersion(props.item).modified = Date.now()
}
</script>

<template lang="pug">
q-table(flat
	:columns="cols"
	:rows='rows'
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

	template(v-slot:body="props")
		q-tr(:props="props" :class="props.rowIndex === 0 ? 'first-row-separator' : ''")
			q-td(auto-width)
				q-btn(size="sm" color="primary" round flat dense @click="props.expand = !props.expand" icon="mdi-chevron-right")
			q-td
				.text-bold {{ props.row.label }}

			q-td {{ props.row.modified }}
			q-td.text-center
				.caption(v-if='props.row.published == 0') Черновик
				.caption(v-if='props.row.published == 1' ) Ожидает публикации
				.caption(v-if='props.row.published == 2' ) Опубликовано

			q-td {{ props.row.test }}
			q-td {{ props.row.prod }}
			q-td.text-right()
				q-btn-dropdown(v-if='props.row.id == 0' unelevated split icon='mdi-pencil' color="primary" label="Редактировать" size='sm' @click='navigate')
					q-list
						q-item(clickable v-for="item in btmenu" :key='item.id' v-close-popup @click="")
							q-item-section(side)
								q-icon(:name="item.icon" color="primary")
							q-item-section
								q-item-label {{ item.label }}
				q-btn(v-else flat round color="primary" size='sm')
					q-icon(name="mdi-dots-vertical"  size="24px")
					q-menu
						q-list
							q-item(clickable v-for="item in btmenu2" :key="item.id" v-close-popup)
								q-item-section(side)
									q-icon(:name="item.icon" color="primary")
								q-item-section {{ item.label }}


		q-tr(v-show="props.expand" :props="props")
			q-td(colspan="100%")
				.text-left This is expand slot for row above: {{ props.row.name }}.

		q-tr(v-if="props.rowIndex === 0" class="empty-row-spacer")
			q-td(:colspan="props.cols.length + 1")
			
	// template(v-slot:body-cell-ver='props')
	// 	q-td(:props='props')
	// 		.text-bold {{ props.row.label }}
	//
	// template(v-slot:body-cell-modified='props')
	// 	q-td(:props='props') {{ date.formatDate(props.row.modified, 'DD.MM.YY HH:mm') }}
	//
	// template(v-slot:body-cell-created='props')
	// 	q-td(:props='props')
	// 		div {{formatDate(props.row.created)}}
	// 		div Орлов П.С.
	//
	// template(v-slot:body-cell-published='props')
	// 	q-td(:props='props')
	// 		.caption(v-if='props.row.published == 0') Черновик
	// 		.caption(v-if='props.row.published == 2' )
	// 			.pub Опубликовано
	// 			.pub {{ pubDate }}
	// 			.pub Орлов П.С.
	// 		.caption(v-if='props.row.published == 1' )
	// 			div Ожидает публикации

	// template(v-slot:body-cell-action='props')
	// 	q-td.text-right(:props='props' style="padding-right: 0")
	// 		q-btn-dropdown(unelevated split icon='mdi-pencil' color="primary" label="Редактировать" size='sm')
	// 			q-list
	// 				q-item(clickable v-for="item in btmenu" :key='item.id' v-close-popup @click="onItemClick")
	// 					q-item-section(side)
	// 						q-icon(:name="item.icon" color="primary")
	// 					q-item-section
	// 						q-item-label {{ item.label }}

			// q-btn(flat round color="primary" size='sm')
				q-icon(name="mdi-dots-vertical"  size="24px")
				q-menu
					q-list
						template(v-for="item in getMenuForRow1(props.row)" :key="item.id")
							q-item(clickable @click="item.action(props.row.id)" :class='calcClass(item.id)' v-close-popup)
								q-item-section(avatar)
									q-icon(:name="item.icon")
								q-item-section {{ item.label }}
						// template(v-for="item in getMenuForRow(props.row)" :key="item.id")
						// 	q-item(clickable @click="item.action(props.row.id)" :class='calcClass(item.id)' v-close-popup)
						// 		q-item-section(avatar)
						// 			q-icon(:name="item.icon")
						// 		q-item-section {{ item.label }}
	

.check(v-if='isSomePublished')
	div Последняя&nbsp;публикация:
	div {{ lastPublication }} -- {{ pubDate }} -- Орлов П.С.
	.link DV-prod

AddDialog(v-model="dialog" mode='version' :current='currentVer' @create="create")
ConfirmDialog(v-model="dialog1" :mode='ve')

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
	color: #777;
	margin: 0;
}
.pub {
	color: darkred;
	line-height: 1.2;
}
.check {
	margin-top: 1rem;
	display: flex;
	gap: 1rem;
}
:deep(.first-row-separator td) {
	border-bottom: 2px solid $primary !important;
	background-color: var(--node);
}
</style>
