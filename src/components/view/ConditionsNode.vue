<script setup lang="ts">
import { ref } from 'vue'
import type { ConditionsSetNode as ConditionsNodeType, ConditionRow } from './nodesTypes'
import EditConditionsNodeDialog from './EditConditionsNodeDialog.vue'

interface Props {
	node: ConditionsNodeType
	stat: Stat
}

const props = defineProps<Props>()

const collapse = (stat: any) => {
	stat.open = false
}

const emit = defineEmits(['remove'])

const remove = () => {
	emit('remove', props.stat)
}

// Ensure conditions array exists
if (!props.node.conditions) {
	props.node.conditions = [] as ConditionRow[]
}

let rowCounter = 0
const genId = () => `row_${Date.now()}_${rowCounter++}`

let conditionCounter = 0

const addRow = () => {
	conditionCounter++
	props.node.conditions.push({ id: genId(), condition: `${conditionCounter} условие`, value: '' })
}

const removeRow = (id: string) => {
	const idx = props.node.conditions.findIndex((r: ConditionRow) => r.id === id)
	if (idx !== -1) props.node.conditions.splice(idx, 1)
}

const editDialogOpen = ref(false)
const editingRow = ref<ConditionRow | null>(null)

const showEditDialog = (row: ConditionRow) => {
	editingRow.value = row
	editDialogOpen.value = true
}

const onEditConfirm = (payload: { condition: string; value: string }) => {
	if (editingRow.value) {
		editingRow.value.condition = payload.condition
		editingRow.value.value = payload.value
	}
}
</script>

<template lang="pug">
q-expansion-item.my-expansion(v-model="props.stat.open")
	template(v-slot:header)
		.drag-handle(@mousedown="collapse(props.stat)" @touchstart="collapse(props.stat)") ⠿

		q-item-section
			.project
				| Набор условий:
				span.editable(@click.stop) {{ props.node.name }}
					q-popup-edit(v-model="props.node.name" v-slot="scope")
						q-input(
							v-model="scope.value"
							dense
							autofocus
							@keyup.enter="scope.set"
						)
		q-btn.close(flat round dense color="primary" icon='mdi-dots-vertical' size="sm" @click.stop) 
			q-menu
				q-list
					q-item(clickable)
						q-item-section Копировать
					q-item.text-negative(clickable @click="remove" )
						q-item-section Удалить

	.inside
		.inf Условия объединены по ИЛИ, вычисляются сверху вниз, срабатывает первое валидное.

		table.options-table(v-if="props.node.conditions.length")
			thead
				tr
					th Условие
					th Значение
					th

			tbody
				tr(v-for="row in props.node.conditions" :key="row.id")
					td
						q-input(v-model="row.condition" dense outlined)
					td
						q-input(v-model="row.value" dense outlined)
					td.actions
						q-btn(flat round dense icon="mdi-pencil-outline" color="primary" size="sm" @click="showEditDialog(row)")
						q-btn(flat round dense icon="mdi-delete-outline" color="negative" size="sm" @click="removeRow(row.id)")
							q-tooltip Удалить

		.text-center.q-mt-md
			q-btn(flat color="primary" icon="mdi-plus" label="Добавить условие" size="sm" @click="addRow")

		EditConditionsNodeDialog(
			v-model="editDialogOpen"
			:row="editingRow"
			@confirm="onEditConfirm"
		)

</template>

<style scoped lang="scss">
.inf {
	color: $grey-7;
	font-size: 0.75rem;
}
.project {
	color: #63808c;
	span {
		font-weight: 600;
		margin-left: 0.5rem;
		color: $primary;
	}
}
.my-expansion :deep(.q-expansion-item__container > .q-item .q-focus-helper) {
	display: none;
}
.my-expansion :deep(.q-expansion-item__container > .q-item:hover) {
	border-radius: 0.25rem;
	box-shadow: var(--shad0);
}
:deep(.q-expansion-item--expanded) {
	background: white;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
	border: 1px solid $secondary;
}

.inside {
	padding: 1rem;
	padding-top: 0;
}
.drag-handle {
	font-size: 1.3rem;
	cursor: grab;
	user-select: none;
	margin-right: 1rem;

	&:active {
		cursor: grabbing;
	}
}
span.editable {
	color: $primary;
	border-bottom: 1px dotted $primary;
	cursor: pointer;
}
.close {
	align-self: center;
}
:deep(.q-item__section--side) {
	padding-left: 0;
}
.options-table {
	width: 100%;
	border-collapse: collapse;

	th {
		text-align: left;
		font-weight: 500;
		color: #63808c;
		padding: 0.5rem;
		border-bottom: 1px solid #e0e0e0;
		font-size: 0.8rem;
	}

	td {
		padding: 0.25rem 0.25rem;
		vertical-align: middle;

		&.actions {
			white-space: nowrap;
			width: 1%;
		}
	}
}
</style>
