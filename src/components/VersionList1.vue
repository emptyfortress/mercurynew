<script setup lang="ts">
import { ref, computed } from 'vue'
import type { QTableProps } from 'quasar'
import { useQuasar, date } from 'quasar'
import AddDialog from '@/components/AddDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useRouter } from 'vue-router'
import { useApps } from '@/stores/apps'

const router = useRouter()

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
		label: 'Создано',
		align: 'left',
		field: 'created',
		sortable: false,
	},
	{
		name: 'modified',
		required: true,
		label: 'Изменено',
		align: 'left',
		field: 'modified',
		sortable: false,
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
		name: 'action',
		required: true,
		label: '',
		align: 'left',
		field: 'action',
		sortable: false,
	},
]

const versions = ref([
	{
		id: 0,
		label: 'Базовая версия',
		value: 'Базовая версия',
		descr: 'Стартовая версия приложения',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		modified: '',
		published: 0,
		current: true,
	},
])

const ve = ref('version')

const $q = useQuasar()

const remove = (id: number) => {
	// myapps.removeVersion(versions, id)

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
	// versions.map((el) => (el.current = false))
	// myapps.addVersion(versions, e)

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Создана новая версия',
			position: 'top',
		})
	}, 500)
}

const page = {
	sortBy: 'created',
}

function viewSettings(id: number) {
	ve.value = 'edit'
	dialog1.value = true
	// router.push('/process')
}

function edit(id: number) {
	// let row = versions.find((el) => el.id == id)
	// versions.map((el) => (el.current = false))
	// if (row) {
	// 	row.current = true
	// 	row.modified = date.formatDate(Date.now(), 'DD.MM.YY HH:mm')
	// 	router.push('/process')
	// }
}

function createVersion(id: number) {
	// let tmp = versions.findIndex((el) => el.id == id)
	// if (tmp > -1) {
	// 	currentVer.value = versions[tmp].label
	// 	dialog.value = !dialog.value
	// }
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
	// return menu.filter((item) => {
	// 	if (item.id === 3 && versions.length == 1) return false
	// 	if (item.id === 0 && row.published == 0) return false
	// 	if (item.id === 1 && row.published > 0) return false
	// 	if (item.id === 3 && row.published !== 0) return false
	// 	return true
	// })
}

const calcClass = (id: number) => {
	return id == 3 ? 'pub' : ''
}

const isSomePublished = computed(() => {
	// return versions.find((el) => el.published == 2)
})

const lastPublication = computed(() => {
	// let tmp = versions.find((el) => el.published == 2)
	// if (tmp) return tmp.label
})

const pubDate = computed(() => {
	// let tmp = versions.find((el) => el.published == 2)
	// if (tmp) return tmp.pubDate
})
</script>

<template lang="pug">
q-table(flat
	:columns="cols"
	:rows='versions'
	row-key="id"
	color="primary"
	dense
	hide-bottom
	:pagination='page'
)

	template(v-slot:body-cell-ver='props')
		q-td(:props='props')
			.text-bold {{ props.row.label }}
			.caption {{ props.row.descr }}

	template(v-slot:body-cell-modified='props')
		q-td(:props='props') {{ props.row.modified}}

	template(v-slot:body-cell-published='props')
		q-td(:props='props')
			.caption(v-if='props.row.published == 0') Черновик
			.caption(v-if='props.row.published == 2' )
				.pub Опубликовано
			.caption(v-if='props.row.published == 1' )
				div Ожидает публикации

	template(v-slot:body-cell-action='props')
		q-td.text-right(:props='props')
			q-btn(flat round color="primary" size='sm')
				q-icon(name="mdi-dots-vertical"  size="24px")
				// q-menu
					q-list
						template(v-for="item in getMenuForRow(props.row)" :key="item.id")
							q-item(clickable @click="item.action(props.row.id)" :class='calcClass(item.id)' v-close-popup)
								q-item-section(avatar)
									q-icon(:name="item.icon")
								q-item-section {{ item.label }}
	

// .check(v-if='isSomePublished')
	div Последняя&nbsp;публикация:
	div {{ lastPublication }} -- {{ pubDate }}
	.link DV-prod

AddDialog(v-model="dialog" mode='version' :current='currentVer' @create="create")
ConfirmDialog(v-model="dialog1" :mode='ve')

</template>

<style scoped lang="scss">
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
}
.pub {
	color: darkred;
}
.check {
	margin-top: 2rem;
	display: flex;
	gap: 1rem;
}
</style>
