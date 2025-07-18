<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { QTableProps } from 'quasar'
import TablerCopyPlus from '@/components/icons/TablerCopyPlus.vue'
import { useVersion } from '@/stores/version'
import { useQuasar } from 'quasar'
import AddDialog from '@/components/AddDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const version = useVersion()
const cols: QTableProps['columns'] = [
	// {
	// 	name: 'current',
	// 	required: true,
	// 	label: 'Текущая',
	// 	align: 'center',
	// 	field: 'current',
	// 	sortable: true,
	// },
	{
		name: 'ver',
		required: true,
		label: 'Версия',
		align: 'left',
		field: 'ver',
		sortable: true,
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
		name: 'created',
		required: true,
		label: 'Дата создания',
		align: 'left',
		field: 'created',
		sortable: true,
	},
	{
		name: 'published',
		required: true,
		label: 'Статус',
		align: 'center',
		field: 'published',
		sortable: true,
	},
	{
		name: 'action',
		required: true,
		label: '',
		align: 'left',
		field: 'action',
		sortable: true,
	},
]

const ve = ref('version')

const $q = useQuasar()

const remove = (id: number, pub: number) => {
	console.log(id, pub)

	if (pub == 0) {
		version.remove(id)
		version.versions[0].current = true
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

const radio = computed({
	get: () => version.versions.find((v) => v.current)?.id ?? null,
	set: (id) => {
		if (id !== null) {
			version.setCurrent(id)
		}
	},
})

const dialog = ref(false)
const dialog1 = ref(false)

const create = (e: any) => {
	version.add(e.ver, e.descr)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Создана новая версия',
			position: 'top',
		})
	}, 500)
}

const edit = (num: number) => {
	if (num > 0) {
		ve.value = 'edit'
		dialog1.value = true
	} else router.push('/process')
}
</script>

<template lang="pug">
q-table(flat
	:columns="cols"
	:rows='version.versions'
	row-key="id"
	color="primary"
	dense
	hide-bottom
	@row-click="(evt, row) => radio = row.id"
)

	// template(v-slot:body-cell-current='props')
	// 	q-td(:props='props')
	// 		q-radio(
	//        dense
	//        :model-value="radio"
	//        :val="props.row.id"
	//        @update:model-value="radio = $event"
	//      )

	template(v-slot:body-cell-ver='props')
		q-td(:props='props')
			.text-bold {{ props.row.ver }}
			.caption {{ props.row.descr }}

	template(v-slot:body-cell-action='props')
		q-td.text-right(:props='props')
			.text-secondary
				q-btn(flat round dense size='md' icon='mdi-pencil' @click='edit(props.row.published)') 

				q-btn(flat round dense @click="add(props.row.ver)" size='md') 
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
