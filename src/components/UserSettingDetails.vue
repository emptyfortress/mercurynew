<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useServers } from '@/stores/servers'
import type { QTableProps } from 'quasar'
import { useApps } from '@/stores/apps'

const props = defineProps<{ id: string; type: string }>()

const myapps = useApps()
const server = useServers()

const current = computed(() => {
	return server.editors.find((el) => el.id.toString() == props.id)
})

const cols: QTableProps['columns'] = [
	{
		name: 'label',
		required: true,
		label: 'Приложения',
		align: 'left',
		field: 'label',
		sortable: true,
	},
	{
		name: 'col0',
		required: true,
		label: 'Редактирование',
		align: 'center',
		field: 'col0',
		sortable: true,
	},
	{
		name: 'col1',
		required: true,
		label: 'DV-Test',
		align: 'center',
		field: 'col1',
		sortable: true,
	},
	{
		name: 'col2',
		required: true,
		label: 'DV-Main',
		align: 'center',
		field: 'col2',
		sortable: true,
	},
	{
		name: 'col3',
		required: true,
		label: 'DV-Prod',
		align: 'center',
		field: 'col3',
		sortable: true,
	},
]

const page = {
	rowsPerPage: 0,
}

const rows = ref(
	myapps.flatApps.map((item) => ({
		...item,
		id: item.id.toString(),
		col0: true,
		col1: false,
		col2: false,
		col3: false,
	}))
)
</script>

<template lang="pug">
div
	h6
		q-icon(name="mdi-account-circle" color="primary" size="md")
		|&nbsp;&nbsp;{{ current?.name || 'fuck'}}
	br
	.h7 Права на редактирование и публикацию
	q-table(flat,
		:columns="cols"
		:rows="rows"
		row-key="id"
		color="primary"
		hide-bottom
		:pagination='page'
		)

		template(v-slot:body-cell-col0="props")
			q-td.text-center(:props="props")
				q-checkbox(v-model="props.row.col0" dense)
		template(v-slot:body-cell-col1="props")
			q-td.text-center(:props="props")
				q-checkbox(v-model="props.row.col1" dense)
		template(v-slot:body-cell-col2="props")
			q-td.text-center(:props="props")
				q-checkbox(v-model="props.row.col2" dense)
		template(v-slot:body-cell-col3="props")
			q-td.text-center(:props="props")
				q-checkbox(v-model="props.row.col3" dense)
</template>

<style scoped lang="scss"></style>
