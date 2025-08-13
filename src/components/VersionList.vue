<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { QTableProps } from 'quasar'
import TablerCopyPlus from '@/components/icons/TablerCopyPlus.vue'
import { useQuasar, date } from 'quasar'
import AddDialog from '@/components/AddDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useRouter } from 'vue-router'
import { useApps } from '@/stores/apps'

const router = useRouter()

const props = defineProps<{
	versions: Ver[]
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
	// {
	// 	name: 'author',
	// 	required: true,
	// 	label: 'Автор',
	// 	align: 'left',
	// 	field: 'author',
	// 	sortable: true,
	// },
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

const ve = ref('version')

const $q = useQuasar()

const remove = (id: number, pub: number) => {
	if (pub == 0) {
		myapps.removeVersion(props.versions, id)
		props.versions[0].current = true
		setTimeout(() => {
			$q.notify({
				icon: 'mdi-delete-outline',
				color: 'negative',
				message: 'Версия удалена',
				position: 'top',
			})
		}, 500)
	}

	if (pub == 2) {
		ve.value = 'version'
		dialog1.value = true
	}

	if (pub == 1) {
		ve.value = 'version1'
		dialog1.value = true
	}
}

const currentVer = ref('')

const add = (ver: string) => {
	currentVer.value = ver
	dialog.value = !dialog.value
}

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

const edit = (num: number, row: any) => {
	if (num > 0) {
		ve.value = 'edit'
		dialog1.value = true
	} else {
		row.modified = date.formatDate(Date.now(), 'DD.MM.YY HH:mm')
		router.push('/process')
	}
}

const page = {
	sortBy: 'created',
}
</script>

<template lang="pug">
q-table(flat
	:columns="cols"
	:rows='props.versions'
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

	template(v-slot:body-cell-action='props')
		q-td.text-right(:props='props')
			.text-secondary
				q-btn(flat round dense size='md' @click='edit(props.row.published, props.row)') 
					q-icon(v-if='props.row.published == 0' name="mdi-pencil")
					q-icon(v-else name="mdi-eye")

				q-btn(flat round dense @click="add(props.row.label)" size='md') 
					TablerCopyPlus.ic

				q-btn(flat round dense icon="mdi-delete-outline" size='md' @click.stop) 
					q-menu
						q-list
							q-item(clickable @click='remove(props.row.id, props.row.published)' v-close-popup).pink
								q-item-section Удалить

	template(v-slot:body-cell-published='props')
		q-td(:props='props')
			.caption(v-if='props.row.published == 0') Черновик
			.caption(v-if='props.row.published == 2' )
				q-icon(name="mdi-check-bold" color="primary" size="18px")
				.link Опубликовано
			.caption(v-if='props.row.published == 1' )
				q-icon(name="mdi-timer-sand" color="primary" size="18px")
				div Ожидает публикации

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
}
</style>
