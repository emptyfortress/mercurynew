<script setup lang="ts">
import { ref } from 'vue'
import { useServers } from '@/stores/servers'
import type { QTableProps } from 'quasar'

const server = useServers()

const selectAll = () => {
	server.selectAll()
}

const cols: QTableProps['columns'] = [
	{
		name: 'icon',
		label: '',
		align: 'center',
		field: 'icon',
		sortable: false,
	},
	{
		name: 'nick',
		label: 'Псевдоним',
		field: 'nick',
		align: 'left',
		sortable: true,
	},
	{
		name: 'prod',
		label: 'Среда',
		field: 'prod',
		align: 'left',
		sortable: true,
	},
	{
		name: 'vis',
		label: 'Доступна',
		field: 'vis',
		align: 'right',
		sortable: true,
	},
]

const pagination = {
	rowsPerPage: 0,
}
const onRowClick = (_evt: Event, row: any) => {
	server.toggleUsed(row.id)
}
</script>

<template lang="pug">
.info Выберите базы данных, которые будут доступны для публикации данного приложения

q-table.table(flat
	:columns='cols'
	:rows='server.servers'
	row-key="id"
	color="primary"
	@row-click="onRowClick"
	:pagination='pagination'
)

	template(v-slot:body-cell-icon="props")
		q-td(:props="props" auto-width)
			q-icon(name="mdi-database-outline" size="18px" color="secondary")

	template(v-slot:body-cell-vis="props")
		q-td(:props="props")
			q-icon(:name="props.row.vis ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'" :color="props.row.prod ? 'negative' : 'primary'" size="sm")

	template(v-slot:body-cell-prod="props")
		q-td(:props="props")
			q-icon.q-mr-sm(name='mdi-access-point' :color="props.row.prod  ? 'negative' : 'primary'" size='sm')
			span(v-if='props.row.prod') production
			span(v-else) test

	template(v-slot:bottom)
		q-btn(unelevated round icon="mdi-plus" color="primary" size="sm")

</template>

<style scoped lang="scss">
.info {
	text-align: center;
}
.hid {
	visibility: hidden;
}
.q-list {
	max-width: 500px;
	margin: 0 auto;
}
.plus {
	margin-top: 1rem;
	// margin: 1rem auto;
}
.table {
	max-width: 600px;
	margin: 1rem auto;
	background: transparent;
}
</style>
