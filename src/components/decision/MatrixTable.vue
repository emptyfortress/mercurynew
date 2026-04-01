<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Chips from '@/components/decision/Chips.vue'
import { useMatrixStore } from '@/stores/matrix'
import type { QTableColumn } from 'quasar'

type TableType = 'role' | 'operation' | 'state'

const props = defineProps<{
	type: TableType
}>()

const route = useRoute()
const matrixStore = useMatrixStore()

onMounted(() => {
	const roleId = route.query.role as string | undefined

	matrixStore.roles.forEach((r, i) => {
		r.selected = roleId ? r.id === roleId : i === 0
	})
})

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
		const selectedRoles = matrixStore.roles.filter((r) => r.selected).map((r) => r.id)
		return matrixStore.operations.map((operation) => ({
			...operation,
			...matrixStore.states.reduce(
				(acc, state) => {
					acc[state.id] = mergeAccess(
						selectedRoles.map((roleId) => matrixStore.getAccess(roleId, operation.id, state.id))
					)
					return acc
				},
				{} as Record<string, boolean | undefined>
			),
		}))
	} else if (props.type === 'operation') {
		const selectedOperations = matrixStore.operations.filter((o) => o.selected).map((o) => o.id)
		return matrixStore.roles.map((role) => ({
			...role,
			...matrixStore.states.reduce(
				(acc, state) => {
					acc[state.id] = mergeAccess(
						selectedOperations.map((opId) => matrixStore.getAccess(role.id, opId, state.id))
					)
					return acc
				},
				{} as Record<string, boolean | undefined>
			),
		}))
	} else {
		const selectedStates = matrixStore.states.filter((s) => s.selected).map((s) => s.id)
		return matrixStore.roles.map((role) => ({
			...role,
			...matrixStore.operations.reduce(
				(acc, operation) => {
					acc[operation.id] = mergeAccess(
						selectedStates.map((stateId) => matrixStore.getAccess(role.id, operation.id, stateId))
					)
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

// multiselect
// const isMultiSelect = computed(() => {
// 	if (props.type === 'role') return matrixStore.roles.filter((r) => r.selected).length > 1
// 	if (props.type === 'operation') return matrixStore.operations.filter((o) => o.selected).length > 1
// 	return matrixStore.states.filter((s) => s.selected).length > 1
// })
const isMultiSelect = ref(false)

// Вычисляет результирующий доступ по приоритету: false (deny) > true (allow) > undefined (unset)
function mergeAccess(values: (boolean | undefined)[]): boolean | undefined {
	if (values.some((v) => v === false)) return false
	if (values.some((v) => v === true)) return true
	return undefined
}

// copy-paste rows **********************************************
// null = буфер пуст, string = id строки/столбца-источника, Record = сами значения
const clipboard = ref<{
	type: 'row' | 'col'
	sourceLabel: string
	values: Record<string, boolean | undefined>
} | null>(null)

function copyRow(row: any) {
	const colIds = getRowColIds()
	clipboard.value = {
		type: 'row',
		sourceLabel: row.label,
		values: Object.fromEntries(colIds.map((id) => [id, row[id]])),
	}
}

function copyCol(colId: string, colLabel: string) {
	clipboard.value = {
		type: 'col',
		sourceLabel: colLabel,
		values: Object.fromEntries(
			tableRows.value.map((row) => [row.id, (row as Record<string, any>)[colId]])
		),
	}
}

function pasteRow(row: any) {
	if (!clipboard.value || clipboard.value.type !== 'row') return
	const colIds = getRowColIds()
	if (props.type === 'role') {
		const selectedRole = matrixStore.roles.find((r) => r.selected)?.id || 'admin'
		colIds.forEach((stateId) =>
			matrixStore.setAccess(selectedRole, row.id, stateId, clipboard.value!.values[stateId])
		)
	} else if (props.type === 'operation') {
		const selectedOperation = matrixStore.operations.find((o) => o.selected)?.id || 'create'
		colIds.forEach((stateId) =>
			matrixStore.setAccess(row.id, selectedOperation, stateId, clipboard.value!.values[stateId])
		)
	} else {
		const selectedState = matrixStore.states.find((s) => s.selected)?.id || 'draft'
		colIds.forEach((operationId) =>
			matrixStore.setAccess(
				row.id,
				operationId,
				selectedState,
				clipboard.value!.values[operationId]
			)
		)
	}
}

function pasteCol(colId: string) {
	if (!clipboard.value || clipboard.value.type !== 'col') return
	if (props.type === 'role') {
		const selectedRole = matrixStore.roles.find((r) => r.selected)?.id || 'admin'
		tableRows.value.forEach((row) =>
			matrixStore.setAccess(selectedRole, row.id, colId, clipboard.value!.values[row.id])
		)
	} else if (props.type === 'operation') {
		const selectedOperation = matrixStore.operations.find((o) => o.selected)?.id || 'create'
		tableRows.value.forEach((row) =>
			matrixStore.setAccess(row.id, selectedOperation, colId, clipboard.value!.values[row.id])
		)
	} else {
		const selectedState = matrixStore.states.find((s) => s.selected)?.id || 'draft'
		tableRows.value.forEach((row) =>
			matrixStore.setAccess(row.id, colId, selectedState, clipboard.value!.values[row.id])
		)
	}
}
</script>

<template lang="pug">
Chips(:type='props.type' v-model='isMultiSelect')

q-table.q-mt-md(
	:rows='tableRows'
	:columns='tableColumns'
	row-key='id'
	flat
	bordered
	:pagination='{ rowsPerPage: 0 }'
	:class='{ "multi-select-table": isMultiSelect }'
)

	template(v-slot:header-cell='headerProps')
		q-th.header-cell(:props='headerProps')
			span {{ headerProps.col.label }}
			template(v-if='headerProps.col.name !== "label"')
				q-btn.col-menu-btn(
					v-if='!isMultiSelect'
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
							q-separator
							q-item(clickable @click='copyCol(headerProps.col.name, headerProps.col.label)')
								q-item-section Скопировать права столбца
							q-item(
								clickable
								:disable='!clipboard || clipboard.type !== "col"'
								@click='pasteCol(headerProps.col.name)'
							)
								q-item-section
									| Вставить права в столбец
									span.text-grey-6(v-if='clipboard?.type === "col"')  ({{ clipboard.sourceLabel }})

	template(v-slot:body-cell-label='cellProps')
		q-td.label-cell(:props='cellProps')
			span {{ cellProps.value }}
			q-btn.row-menu-btn(
				v-if='!isMultiSelect'
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
						q-separator
						q-item(clickable @click='copyRow(cellProps.row)')
							q-item-section Скопировать права строки
						q-item(
							clickable
							:disable='!clipboard || clipboard.type !== "row"'
							@click='pasteRow(cellProps.row)'
						)
							q-item-section
								| Вставить права в строку
								span.text-grey-6(v-if='clipboard?.type === "row"')  ({{ clipboard.sourceLabel }})

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
					:disable='isMultiSelect'
					@click.prevent='!isMultiSelect && handleCheckboxClick(cell.row, cell.col)'
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
.multi-select-table {
	background: #eee;
}
.multi {
	margin-top: 0.5rem;
	span {
		display: inline-block;
		border: 1px solid red;
		background: pink;
		padding: 3px 1rem;
	}
}
</style>
