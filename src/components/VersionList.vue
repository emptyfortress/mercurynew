<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { QTableProps } from 'quasar'
import TablerCopyPlus from '@/components/icons/TablerCopyPlus.vue'
import { useVersion } from '@/stores/version'
import { useQuasar } from 'quasar'
import AddDialog from '@/components/AddDialog.vue'

const version = useVersion()
const cols: QTableProps['columns'] = [
	{
		name: 'current',
		required: true,
		label: 'Текущая',
		align: 'center',
		field: 'current',
		sortable: true,
	},
	{
		name: 'ver',
		required: true,
		label: 'Версия',
		align: 'left',
		field: 'ver',
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
		label: 'Дата создания',
		align: 'left',
		field: 'created',
		sortable: true,
	},
	{
		name: 'published',
		required: true,
		label: 'Опубликовано',
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

const $q = useQuasar()
const remove = (id: number) => {
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
	template(v-slot:body-cell-current='props')
		q-td(:props='props')
			q-radio(
        dense
        :model-value="radio"
        :val="props.row.id"
        @update:model-value="radio = $event"
      )

	template(v-slot:body-cell-action='props')
		q-td(:props='props')
			.text-secondary
				q-btn(flat round dense @click="add(props.row.ver)" size='md') 
					TablerCopyPlus.ic
				q-btn(flat round dense icon="mdi-delete-outline" size='md') 
					q-menu
						q-list
							q-item(clickable @click='remove(props.row.id)').pink
								q-item-section Удалить

	template(v-slot:body-cell-published='props')
		q-td(:props='props')
			q-icon(v-if='props.row.published == 2' name="mdi-check-bold" color="primary" size="16px")
			q-icon(v-if='props.row.published == 1' name="mdi-timer-sand" color="primary" size="16px")

AddDialog(v-model="dialog" mode='version' :current='currentVer' @create="create")

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
</style>
