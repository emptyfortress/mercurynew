<script setup lang="ts">
import { ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { uid } from 'quasar'

interface Row {
	id: string
	parameter: string
	operation: string
	value: string
	group: boolean
}
const rows = ref<Row[]>([])

const columns = ref<QTableColumn[]>([
	{ name: 'parameter', label: 'Параметр', field: 'parameter', align: 'left', sortable: false },
	{ name: 'operation', label: 'Операция', field: 'operation', align: 'left', sortable: false },
	{ name: 'value', label: 'Значение', field: 'value', align: 'left' },
	{ name: 'action', label: '', field: 'action', align: 'right' },
])

const pagination = ref({
	rowsPerPage: 0,
})

const emit = defineEmits(['dirty'])

const addGroup = () => {
	rows.value.push({
		id: uid(),
		parameter: '',
		operation: '',
		value: '',
		group: true,
	})
}

const addRule = () => {
	rows.value.push({
		id: uid(),
		parameter: 'test',
		operation: 'test',
		value: 'test',
		group: false,
	})
}
</script>

<template lang="pug">
.row.justify-between.align-end
	div Правила определения роли:
	.q-gutter-x-sm
		q-btn(unelevated color="positive" label="Создать группу" @click="addGroup" size='sm')
		q-btn(unelevated color="positive" label="Создать правило" @click="addRule" size='sm')

q-table.q-mt-md(
	:rows="rows"
	:columns="columns"
	:pagination="pagination"
	row-key="id"
	flat
	hide-pagination
)
	template(v-slot:header="props")
		q-tr(:props="props")
			q-th(auto-width)
			q-th(
				v-for="col in props.cols"
				:key="col.name"
				:props="props"
			)
				| {{ col.label }}
	template(v-slot:body="props")
		q-tr(v-if="props.row.group" :props="props")
			q-td(auto-width)
				q-btn(round flat dense color="secondary" :icon="props.expand ? 'remove' : 'add'" @click="props.expand = !props.expand" size='sm') 
			q-td(colspan='3')
				|{{ props.row.parameter || 'Новая группа' }}
			q-td.text-right
				q-btn(flat round dense icon="mdi-delete-outline" color="grey" @click="" size='sm') 

		q-tr(v-else :props="props")
			q-td(auto-width)
			q-td(:props="props" key='parameter') щту
			q-td(:props="props" key='operation') дфылво
			q-td(:props="props" key='value') фдыв
			q-td(:props="props" key='action')
				q-btn(flat round dense icon="mdi-delete-outline" color="grey" @click="" size='sm') 
</template>

<style scoped lang="scss"></style>
