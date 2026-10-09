<script setup lang="ts">
import { ref, watch } from 'vue'
import type { WorkflowTemplate } from '@/composables/useWorkflowPrototype'
const props = defineProps<{ rows: WorkflowTemplate[]; resetKey: string }>()
const emit = defineEmits<{ select: [template: WorkflowTemplate] }>()
const pagination = ref({ sortBy: 'name', descending: false, page: 1, rowsPerPage: 15 })
watch(() => props.resetKey, () => { pagination.value.page = 1 })
watch(() => props.rows.length, () => {
	const lastPage = Math.max(1, Math.ceil(props.rows.length / pagination.value.rowsPerPage))
	pagination.value.page = Math.min(pagination.value.page, lastPage)
})
const columns = [
	{ name: 'name', label: 'Шаблон', field: 'name', align: 'left' as const, sortable: true },
	{ name: 'category', label: 'Категория', field: 'category', align: 'left' as const, sortable: true },
	{ name: 'enabled', label: 'Новые запуски', field: 'enabled', align: 'left' as const, sortable: true },
]
</script>

<template lang="pug">
q-table(flat dense :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination" :rows-per-page-options="[15, 30, 60]" @row-click="(_event, row) => emit('select', row)")
	template(v-slot:body-cell-name="props")
		q-td(:props="props")
			q-btn(flat dense no-caps color="primary" :label="props.row.name" @click.stop="emit('select', props.row)")
	template(v-slot:body-cell-enabled="props")
		q-td(:props="props")
			q-badge(:color="props.row.enabled ? 'positive' : 'grey-6'" :label="props.row.enabled ? 'Разрешены' : 'Отключены'")
	template(v-slot:no-data)
		.column.items-center.q-pa-lg.text-grey-7
			q-icon(name="search_off" size="36px")
			div По выбранным условиям шаблонов нет
</template>

<style scoped>
:deep(.q-table tbody tr) { cursor: pointer; }
</style>
