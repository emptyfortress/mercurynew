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
		parameter: 'Выберите',
		operation: 'Выберите',
		value: 'Выберите',
		group: false,
	})
}

const group = ref('И')
const toggleGroup = () => {
	group.value == 'И' ? (group.value = 'ИЛИ') : (group.value = 'И')
}

const removeRow = (id: string) => {
	console.log(id)
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
				q-btn(unelevated color="primary" :label="group" @click="toggleGroup") 
			q-td.text-right
				q-btn(flat round dense icon="mdi-delete-outline" color="grey" @click="removeRow(props.row.id)" size='sm') 

		q-tr(v-else :props="props")
			q-td(auto-width)
			q-td(:props="props" key='parameter')
				q-select(v-model="props.row.parameter" outlined dense)
			q-td(:props="props" key='operation')
				q-select(v-model="props.row.operation" outlined dense)
			q-td(:props="props" key='value')
				q-select(v-model="props.row.value" outlined dense)
			q-td(:props="props" key='action')
				q-btn(flat round dense icon="mdi-delete-outline" color="grey" @click="removeRow(props.row.id)" size='sm') 
</template>

<style scoped lang="scss"></style>
