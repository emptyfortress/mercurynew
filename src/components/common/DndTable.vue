<script setup lang="ts">
import { watch } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'

interface Column {
	field: string
	label: string
	align: string
	type?: 'checkbox'
}

interface Row {
	id: string | number
	[key: string]: unknown
}

const props = defineProps<{
	columns: Column[]
	rows: Row[]
}>()

const emit = defineEmits<{
	'update:rows': [rows: Row[]]
}>()

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'row-ghost',
	sortable: true,
	dragHandle: '.drag-handle',
}

const [tbodyRef, rows] = useDragAndDrop<Row>(props.rows, config)

watch(rows, (val) => emit('update:rows', val))
watch(
	() => props.rows,
	(val) => {
		if (val !== rows.value) rows.value = val
	}
)

const calcClass = (e: string) => {
	switch (e) {
		case 'left':
			return 'text-left'
		case 'center':
			return 'text-center'
		case 'right':
			return 'text-right'
		default:
			return 'text-left'
	}
}
</script>

<template lang="pug">
table.dnd-table
	thead
		tr
			th.handle-col
			th(v-for="col in columns" :key="col.field") {{ col.label }}
			th.actions
	tbody(ref="tbodyRef")
		tr(v-for="row in rows" :key="row.id")
			td.handle-col
				span.drag-handle ⠿
			td(v-for="col in columns" :key="col.field" :class="calcClass(col.align)")
				q-checkbox(v-if="col.type === 'checkbox'" v-model="row[col.field]" dense)
				span(v-else) {{ row[col.field] }}
			td.action
				q-btn(flat round icon="mdi-pencil-outline" color="secondary" @click="" dense size="sm") 
				q-btn(flat round icon="mdi-close" color="secondary" @click="" dense size="sm") 
</template>

<style lang="scss" scoped>
.dnd-table {
	width: 100%;
	border-collapse: collapse;

	th {
		font-size: 11px;
		text-align: left;
		padding: 8px 12px;
		border-bottom: 1px solid var(--q-separator-color, #e0e0e0);
		color: #555;
	}
	td {
		padding: 8px 12px;
		border-bottom: 1px solid var(--q-separator-color, #e0e0e0);
		font-size: 13px;
	}
	tr {
		background: var(--bgLight);
	}
}
:deep(.row-ghost) {
	height: 39px;
	background: hsl(213 38% 81% / 1) !important;
	* {
		opacity: 0;
	}
}

.handle-col {
	width: 32px;
}
.action {
	display: flex;
	width: 62px;
	text-align: right;
}

.drag-handle {
	cursor: grab;
	user-select: none;

	&:active {
		cursor: grabbing;
	}
}
</style>
