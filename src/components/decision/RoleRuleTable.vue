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
		operation: '',
		value: '',
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
</template>

<style scoped lang="scss"></style>
