<script setup lang="ts">
import { ref } from 'vue'
import { date } from 'quasar'
import type { QTableProps } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const test = ref(date.formatDate(new Date(), 'DD.MM.YYYY'))

const columns: QTableProps['columns'] = [
	{ name: 'id', required: true, label: 'ID', align: 'left', field: 'id', sortable: true },
	{ name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
	{ name: 'description', label: 'Description', field: 'description', sortable: true },
	{ name: 'value', label: 'Value', field: 'value', sortable: true },
	{ name: 'status', label: 'Status', field: 'status', sortable: true },
]

const rows = Array.from({ length: 10 }, (_, i) => ({
	id: i + 1,
	name: `Item ${i + 1}`,
	description: `Description for item ${i + 1}`,
	value: Math.round(Math.random() * 100),
	status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
}))
</script>

<template lang="pug">
q-page(padding)
	h2 Hi, there {{ test }}
	p This is a dummy paragraph. This is some more text for the first paragraph.
	q-table(title="Sample Data" flat :rows="rows" :columns="columns" row-key="id")
	.row.justify-center
		q-btn(color="warning" label="Test" @click="router.push('/')")
</template>

<style scoped lang="scss">
h2 {
	color: red;
	font-weight: bold;
}
</style>
