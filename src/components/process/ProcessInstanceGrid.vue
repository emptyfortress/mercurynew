<script setup lang="ts">
import { ref, watch } from 'vue'
import type { WorkflowInstance } from '@/composables/useWorkflowPrototype'
import ProcessStatusBadge from './ProcessStatusBadge.vue'
const props = withDefaults(defineProps<{ rows: WorkflowInstance[]; resetKey?: string; pageSizes?: number[] }>(), {
	resetKey: '', pageSizes: () => [15, 30, 60],
})
const emit = defineEmits<{ select: [id: string] }>()
const pagination = ref({ sortBy: 'id', descending: true, page: 1, rowsPerPage: props.pageSizes[0] ?? 15 })
watch(() => props.resetKey, () => { pagination.value.page = 1 })
watch(() => props.rows.length, () => {
	const lastPage = Math.max(1, Math.ceil(props.rows.length / pagination.value.rowsPerPage))
	pagination.value.page = Math.min(pagination.value.page, lastPage)
})
const columns = [
	{ name: 'id', label: 'Экземпляр', field: 'id', align: 'left' as const, sortable: true },
	{ name: 'templateName', label: 'Шаблон', field: 'templateName', align: 'left' as const, sortable: true },
	{ name: 'card', label: 'Карточка', field: 'card', align: 'left' as const },
	{ name: 'currentStep', label: 'Текущий шаг', field: 'currentStep', align: 'left' as const },
	{ name: 'author', label: 'Автор', field: 'author', align: 'left' as const, sortable: true },
	{ name: 'startedAt', label: 'Запущен', field: 'startedAt', align: 'left' as const, sortable: true },
	{ name: 'elapsed', label: 'Время', field: 'elapsed', align: 'left' as const },
	{ name: 'status', label: 'Состояние', field: 'status', align: 'left' as const, sortable: true },
]
</script>

<template lang="pug">
q-table(flat bordered dense :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination" :rows-per-page-options="pageSizes" no-data-label="Экземпляры не найдены" @row-click="(_event, row) => emit('select', row.id)")
	template(v-slot:body-cell-id="props")
		q-td(:props="props")
			.text-weight-medium.text-primary {{ props.value }}
	template(v-slot:body-cell-templateName="props")
		q-td(:props="props")
			.text-weight-medium {{ props.value }}
	template(v-slot:body-cell-status="props")
		q-td(:props="props")
			ProcessStatusBadge(:status="props.row.status")
	template(v-slot:no-data)
		.column.items-center.q-pa-lg.text-grey-7
			q-icon(name="search_off" size="36px")
			| По выбранным условиям экземпляров нет
</template>

<style scoped>
:deep(.q-table tbody tr) { cursor: pointer; }
:deep(.q-table tbody tr:hover) { background: #f3f8fc; }
</style>
