<script setup lang="ts">
import type { QTableColumn } from 'quasar'
import type { OperationDefinition } from './types'
import OperationColorPicker from './OperationColorPicker.vue'

defineProps<{
	rows: Array<OperationDefinition & { assignedCount?: number }>
	columns: QTableColumn[]
	showAllowed?: boolean
	noDataLabel: string
}>()
const emit = defineEmits<{
	(event: 'toggle-allowed', id: string, allowed: boolean): void
	(event: 'edit', id: string): void
	(event: 'update:operation-color', id: string, color?: string): void
	(event: 'delete', id: string): void
}>()
const openEditorForRow = (_event: Event, row: OperationDefinition & { assignedCount?: number }) =>
	emit('edit', row.id)
</script>

<template lang="pug">
q-table.operation-table.operations-table(:rows="rows" :columns="columns" row-key="id" flat dense bordered wrap-cells hide-bottom :pagination="{ rowsPerPage: 0 }" :no-data-label="noDataLabel" @row-click="openEditorForRow")
	template(v-slot:body-cell-name="slotProps")
		q-td.operation-name(:props="slotProps")
			.row.items-center.no-wrap
				.col-auto
					OperationColorPicker(v-if="slotProps.row.hasTransition" :model-value="slotProps.row.color" @update:model-value="emit('update:operation-color', slotProps.row.id, $event)")
				.col.operation-name-text {{ slotProps.row.name }}
	template(v-slot:body-cell-allowed="slotProps" v-if="showAllowed")
		q-td(:props="slotProps")
			q-checkbox(:model-value="Boolean(slotProps.row.assignedCount)" dense @click.stop @update:model-value="emit('toggle-allowed', slotProps.row.id, Boolean($event))")
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
.operation-table :deep(.q-table td.action) {
	padding-right: 0;
}
.operation-table :deep(.q-table td.operation-name) {
	padding-left: 0.2rem;
}
.operation-table :deep(.q-table tbody tr) {
	cursor: pointer;
}
.operation-name-text {
	white-space: normal;
	overflow-wrap: anywhere;
	margin-left: 0.5rem;
}
</style>
