<script setup lang="ts">
import type { OptionsNode as OptionsNodeType, OptionRow } from './nodesTypes'

interface Props {
	node: OptionsNodeType
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

// Ensure options array exists
if (!props.node.options) {
	props.node.options = [] as OptionRow[]
}

let rowCounter = 0
const genId = () => `row_${Date.now()}_${rowCounter++}`

const addRow = () => {
	props.node.options.push({ id: genId(), value: '', label: '' })
}

const removeRow = (id: string) => {
	const idx = props.node.options.findIndex((r: OptionRow) => r.id === id)
	if (idx !== -1) props.node.options.splice(idx, 1)
}
</script>

<template lang="pug">
q-expansion-item.my-expansion(v-model="props.stat.open")
	template(v-slot:header)
		.drag-handle(@mousedown="collapse(props.stat)" @touchstart="collapse(props.stat)") ⠿

		q-item-section
			.project
				| Набор вариантов:
				span.editable(@click.stop) {{ props.node.name }}
					q-popup-edit(v-model="props.node.name" v-slot="scope")
						q-input(
							v-model="scope.value"
							dense
							autofocus
							@keyup.enter="scope.set"
						)
		q-btn.close(flat round dense color="primary" icon='mdi-dots-vertical' size="sm") 
			q-menu
				q-list
					q-item(clickable)
						q-item-section Копировать
					q-item.text-negative(clickable @click.stop="remove" )
						q-item-section Удалить

	.inside
		.field-select.q-mb-md
			.label.text-bold Поле-источник:
			q-select(
				v-model="props.node.sourceField"
				:options="props.node.sourceFieldOptions || []"
				dense
				outlined
				emit-value
				map-options
				style="min-width: 260px"
			)

		table.options-table
			thead
				tr
					th Значение поля
					th Отображаемое значение
					th

			tbody
				tr(v-for="row in props.node.options" :key="row.id")
					td
						q-input(v-model="row.value" dense outlined)
					td
						q-input(v-model="row.label" dense outlined)
					td.actions
						q-btn(flat round dense icon="mdi-function" color="primary" size="sm" @click="")
							q-tooltip Добавить функцию
						q-btn(flat round dense icon="mdi-delete-outline" color="negative" size="sm" @click="removeRow(row.id)")
							q-tooltip Удалить

		q-btn.q-mt-sm(flat color="primary" icon="mdi-plus" label="Добавить строку" size="sm" @click="addRow")
		q-btn.q-mt-sm(flat color="primary" icon="mdi-function" label="Добавить функцию" size="sm" @click="")

		.default-value-bar.q-mt-md.q-pa-sm.row.items-center
			q-icon.q-mr-sm(name="mdi-alert" color="warning" size="sm")
			.text-grey-8 Если значение не найдено (по умолчанию):
			q-input.q-ml-sm(v-model="props.node.defaultValue" dense outlined style="max-width: 100px")
</template>

<style scoped lang="scss">
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
.field-select {
	display: flex;
	align-items: center;
	gap: 0.75rem;

	.label {
		font-size: 0.9rem;
	}
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

.default-value-bar {
	font-size: 0.8rem;
	background: #fff8e1;
	border: 1px solid #ffe4a3;
	border-radius: 0.25rem;
	display: grid;
	grid-template-columns: auto 1fr auto;
	// justify-items: start;
	// align-items: stretch;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
</style>
