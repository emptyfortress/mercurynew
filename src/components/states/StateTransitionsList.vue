<script setup lang="ts">
import type { QTableColumn } from 'quasar'
import type { Edge } from '@vue-flow/core'
defineProps<{
	rows: Array<Edge<{ operationId: string }> & { transitionLabel: string; operationName: string; operationColor?: string }>
	columns: QTableColumn[]
	noDataLabel: string
}>()
const emit = defineEmits<{
	(event: 'select', id: string): void
	(event: 'delete', id: string): void
}>()
const selectRow = (_event: Event, row: { id: string }) => emit('select', row.id)
</script>

<template lang="pug">
q-table.operation-table(:rows="rows" :columns="columns" row-key="id" flat dense bordered wrap-cells hide-bottom :pagination="{ rowsPerPage: 0 }" :no-data-label="noDataLabel" @row-click="selectRow")
	template(v-slot:body-cell-transition="slotProps")
		q-td(:props="slotProps") {{ slotProps.row.transitionLabel }}
	template(v-slot:body-cell-operation="slotProps")
		q-td.operation-cell(:props="slotProps")
			span.operation-color-dot(v-if="slotProps.row.operationColor" :style="{ backgroundColor: slotProps.row.operationColor }")
			| {{ slotProps.row.operationName }}
	template(v-slot:body-cell-actions="slotProps")
		q-td.action(:props="slotProps")
			q-btn.delete-action(flat round dense size="sm" color="secondary" icon="mdi-close" @click.stop="emit('delete', slotProps.row.id)")
</template>

<style scoped lang="scss">
.operation-table {
	border-color: var(--my-border-color);
	border-radius: 0.35rem;
	background: var(--bgLight);
	font-size: 0.78rem;
}
:deep(.q-table th),
:deep(.q-table td) {
	padding: 0.25rem 0.35rem;
}
:deep(.q-table th) {
	white-space: nowrap;
}
:deep(.q-table td) {
	overflow-wrap: anywhere;
}
.action {
	padding-right: 0 !important;
}
.operation-cell {
	white-space: nowrap;
}
.operation-color-dot {
	display: inline-block;
	width: 0.65rem;
	height: 0.65rem;
	margin-right: 0.4rem;
	border-radius: 50%;
	vertical-align: -0.05rem;
}
</style>
