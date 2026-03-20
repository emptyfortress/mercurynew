<script setup lang="ts">
import { computed } from 'vue'
import Chips from '@/components/decision/Chips.vue'
import { useMatrixStore } from '@/stores/matrix'
import type { QTableColumn } from 'quasar'

type TableType = 'role' | 'operation' | 'state'

const props = defineProps<{
	type: TableType
}>()

const matrixStore = useMatrixStore()

const tableColumns = computed(() => {
	if (props.type === 'role') {
		return [
			{ name: 'label', label: 'Операция', field: 'label', align: 'left', sortable: true },
			...matrixStore.states.map((state) => ({
				name: state.id,
				label: state.label,
				field: state.id,
				align: 'center',
				sortable: true,
			})),
		] as QTableColumn[]
	} else if (props.type === 'operation') {
		return [
			{ name: 'label', label: 'Роль', field: 'label', align: 'left', sortable: true },
			...matrixStore.states.map((state) => ({
				name: state.id,
				label: state.label,
				field: state.id,
				align: 'center',
				sortable: true,
			})),
		] as QTableColumn[]
	} else {
		return [
			{ name: 'label', label: 'Роль', field: 'label', align: 'left', sortable: true },
			...matrixStore.operations.map((operation) => ({
				name: operation.id,
				label: operation.label,
				field: operation.id,
				align: 'center',
				sortable: true,
			})),
		] as QTableColumn[]
	}
})

const tableRows = computed(() => {
	if (props.type === 'role') {
		const selectedRole = matrixStore.roles.find((r) => r.selected)?.id || 'admin'
		return matrixStore.operations.map((operation) => ({
			...operation,
			...matrixStore.states.reduce(
				(acc, state) => {
					acc[state.id] = matrixStore.getAccess(selectedRole, operation.id, state.id)
					return acc
				},
				{} as Record<string, boolean | undefined>
			),
		}))
	} else if (props.type === 'operation') {
		const selectedOperation = matrixStore.operations.find((o) => o.selected)?.id || 'create'
		return matrixStore.roles.map((role) => ({
			...role,
			...matrixStore.states.reduce(
				(acc, state) => {
					acc[state.id] = matrixStore.getAccess(role.id, selectedOperation, state.id)
					return acc
				},
				{} as Record<string, boolean | undefined>
			),
		}))
	} else {
		const selectedState = matrixStore.states.find((s) => s.selected)?.id || 'draft'
		return matrixStore.roles.map((role) => ({
			...role,
			...matrixStore.operations.reduce(
				(acc, operation) => {
					acc[operation.id] = matrixStore.getAccess(role.id, operation.id, selectedState)
					return acc
				},
				{} as Record<string, boolean | undefined>
			),
		}))
	}
})

function getCheckboxColor(value: boolean): string {
	if (value === true) return 'teal'
	if (value === false) return 'pink'
	return 'grey-6'
}

function handleCheckboxClick(row: any, col: any) {
	if (props.type === 'role') {
		const selectedRole = matrixStore.roles.find((r) => r.selected)?.id || 'admin'
		matrixStore.toggleAccess(selectedRole, row.id, col.name)
	} else if (props.type === 'operation') {
		const selectedOperation = matrixStore.operations.find((o) => o.selected)?.id || 'create'
		matrixStore.toggleAccess(row.id, selectedOperation, col.name)
	} else {
		const selectedState = matrixStore.states.find((s) => s.selected)?.id || 'draft'
		matrixStore.toggleAccess(row.id, col.name, selectedState)
	}
}

// --- Row actions ---

function getRowColIds(): string[] {
	return tableColumns.value.filter((c) => c.name !== 'label').map((c) => c.name)
}

function setRowAccess(row: any, value: boolean | undefined) {
	const colIds = getRowColIds()
	if (props.type === 'role') {
		const selectedRole = matrixStore.roles.find((r) => r.selected)?.id || 'admin'
		colIds.forEach((stateId) => matrixStore.setAccess(selectedRole, row.id, stateId, value))
	} else if (props.type === 'operation') {
		const selectedOperation = matrixStore.operations.find((o) => o.selected)?.id || 'create'
		colIds.forEach((stateId) => matrixStore.setAccess(row.id, selectedOperation, stateId, value))
	} else {
		const selectedState = matrixStore.states.find((s) => s.selected)?.id || 'draft'
		colIds.forEach((operationId) =>
			matrixStore.setAccess(row.id, operationId, selectedState, value)
		)
	}
}

function invertRow(row: any) {
	const colIds = getRowColIds()
	if (props.type === 'role') {
		const selectedRole = matrixStore.roles.find((r) => r.selected)?.id || 'admin'
		colIds.forEach((stateId) => matrixStore.toggleAccess(selectedRole, row.id, stateId))
	} else if (props.type === 'operation') {
		const selectedOperation = matrixStore.operations.find((o) => o.selected)?.id || 'create'
		colIds.forEach((stateId) => matrixStore.toggleAccess(row.id, selectedOperation, stateId))
	} else {
		const selectedState = matrixStore.states.find((s) => s.selected)?.id || 'draft'
		colIds.forEach((operationId) => matrixStore.toggleAccess(row.id, operationId, selectedState))
	}
}

// --- Column actions ---

function setColAccess(colId: string, value: boolean | undefined) {
	if (props.type === 'role') {
		const selectedRole = matrixStore.roles.find((r) => r.selected)?.id || 'admin'
		tableRows.value.forEach((row) => matrixStore.setAccess(selectedRole, row.id, colId, value))
	} else if (props.type === 'operation') {
		const selectedOperation = matrixStore.operations.find((o) => o.selected)?.id || 'create'
		tableRows.value.forEach((row) => matrixStore.setAccess(row.id, selectedOperation, colId, value))
	} else {
		const selectedState = matrixStore.states.find((s) => s.selected)?.id || 'draft'
		tableRows.value.forEach((row) => matrixStore.setAccess(row.id, colId, selectedState, value))
	}
}

function invertCol(colId: string) {
	if (props.type === 'role') {
		const selectedRole = matrixStore.roles.find((r) => r.selected)?.id || 'admin'
		tableRows.value.forEach((row) => matrixStore.toggleAccess(selectedRole, row.id, colId))
	} else if (props.type === 'operation') {
		const selectedOperation = matrixStore.operations.find((o) => o.selected)?.id || 'create'
		tableRows.value.forEach((row) => matrixStore.toggleAccess(row.id, selectedOperation, colId))
	} else {
		const selectedState = matrixStore.states.find((s) => s.selected)?.id || 'draft'
		tableRows.value.forEach((row) => matrixStore.toggleAccess(row.id, colId, selectedState))
	}
}
</script>

<template lang="pug">
Chips(:type='props.type')

q-table.q-mt-md(
	:rows='tableRows'
	:columns='tableColumns'
	row-key='id'
	flat
	bordered
	:pagination='{ rowsPerPage: 0 }'
)

	template(v-slot:header-cell='headerProps')
		q-th.header-cell(:props='headerProps')
			span {{ headerProps.col.label }}
			template(v-if='headerProps.col.name !== "label"')
				q-btn.col-menu-btn(
					flat
					round
					dense
					size='sm'
					icon='mdi-dots-vertical'
					@click.stop
				)
					q-menu(auto-close)
						q-list(dense)
							q-item(clickable @click='setColAccess(headerProps.col.name, true)')
								q-item-section Весь столбец — разрешено
							q-item(clickable @click='setColAccess(headerProps.col.name, false)')
								q-item-section Весь столбец — запрещено
							q-item(clickable @click='setColAccess(headerProps.col.name, undefined)')
								q-item-section Весь столбец — не задано
							q-separator
							q-item(clickable @click='invertCol(headerProps.col.name)')
								q-item-section Инвертировать

	template(v-slot:body-cell-label='cellProps')
		q-td.label-cell(:props='cellProps')
			span {{ cellProps.value }}
			q-btn.row-menu-btn(
				flat
				round
				dense
				size='sm'
				icon='mdi-dots-vertical'
			)
				q-menu(auto-close)
					q-list(dense)
						q-item(clickable @click='setRowAccess(cellProps.row, true)')
							q-item-section Вся строка — разрешено
						q-item(clickable @click='setRowAccess(cellProps.row, false)')
							q-item-section Вся строка — запрещено
						q-item(clickable @click='setRowAccess(cellProps.row, undefined)')
							q-item-section Вся строка — не задано
						q-separator
						q-item(clickable @click='invertRow(cellProps.row)')
							q-item-section Инвертировать

	template(v-slot:body-cell='cell')
		q-td
			.text-center
				q-checkbox(
					dense,
					checked-icon='mdi-check-bold'
					unchecked-icon='mdi-close-thick'
					indeterminate-icon='mdi-checkbox-blank-outline'
					:model-value='cell.row[cell.col.name]'
					toggle-indeterminate
					:color='getCheckboxColor(cell.row[cell.col.name])'
					@click.prevent='handleCheckboxClick(cell.row, cell.col)'
				)
</template>

<style scoped lang="scss">
:deep(.q-checkbox__inner--falsy .q-icon) {
	color: var(--q-negative);
}

.label-cell {
	position: relative;

	.row-menu-btn {
		opacity: 0;
		transition: opacity 0.15s;
		vertical-align: middle;
		position: absolute;
		right: 0.5rem;
	}

	&:hover .row-menu-btn {
		opacity: 1;
	}
}

.header-cell {
	position: relative;
	white-space: nowrap;

	.col-menu-btn {
		opacity: 0;
		transition: opacity 0.15s;
		vertical-align: middle;
		margin-left: 2px;
	}

	&:hover .col-menu-btn {
		opacity: 1;
	}
}
</style>
