<script setup lang="ts" generic="T extends Row">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'

export interface Column {
	field: string
	label: string
	align: string
	type?: 'checkbox' | string
}

export interface Row {
	id: string | number
	[key: string]: unknown
}

const props = defineProps<{
	columns: Column[]
	rows: T[]
	selected?: T['id'] | null
	dragOver?: boolean
	canDropChecker?: () => boolean
	disableDragHighlight?: boolean
}>()

const dragState = ref<'none' | 'valid' | 'invalid'>('none')

const emit = defineEmits<{
	'update:rows': [rows: T[]]
	'update:selected': [id: T['id'] | null]
	removeRow: [row: T]
	edit: [row: T]
	'table-drop': []
}>()

onMounted(() => {
	document.addEventListener('dragover', handleDocumentDragOver, true)
})
onBeforeUnmount(() => {
	document.removeEventListener('dragover', handleDocumentDragOver, true)
})

function isPointerOverTbody(e: DragEvent): boolean {
	if (!tbodyRef.value) return false
	const el = document.elementFromPoint(e.clientX, e.clientY)
	return !!el && tbodyRef.value.contains(el)
}

function handleDocumentDragOver(e: DragEvent) {
	if (props.disableDragHighlight || isInternalDrag.value) {
		dragState.value = 'none'
		return
	}
	if (!isPointerOverTbody(e)) {
		dragState.value = 'none'
		return
	}
	const valid = props.canDropChecker ? props.canDropChecker() : true
	dragState.value = valid ? 'valid' : 'invalid'
}

function handleWindowDragStart(e: DragEvent) {
	if (!tbodyRef.value) return
	if (tbodyRef.value.contains(e.target as Node)) {
		isInternalDrag.value = true
	}
}

function handleWindowDrop(e: DragEvent) {
	if (isInternalDrag.value) return
	if (!isPointerOverTbody(e)) return

	e.stopPropagation()
	e.preventDefault()
	dragState.value = 'none'

	if (props.disableDragHighlight) return
	const valid = props.canDropChecker ? props.canDropChecker() : true
	if (!valid) return
	emit('table-drop')
}

function handleWindowDragOverCapture(e: DragEvent) {
	if (!props.disableDragHighlight || !e.dataTransfer) return
	if (!isPointerOverTbody(e)) return

	e.preventDefault()
	e.stopPropagation()
	e.dataTransfer.dropEffect = 'none'
	dragState.value = 'none'
}

function handleWindowDragEnd() {
	isInternalDrag.value = false
}

onMounted(() => {
	document.addEventListener('dragover', handleDocumentDragOver, true)
	window.addEventListener('drop', handleWindowDrop, true)
	window.addEventListener('dragstart', handleWindowDragStart, true)
	window.addEventListener('dragend', handleWindowDragEnd, true)
	window.addEventListener('dragover', handleWindowDragOverCapture, true) // capture вместо bubble
})
onBeforeUnmount(() => {
	document.removeEventListener('dragover', handleDocumentDragOver, true)
	window.removeEventListener('drop', handleWindowDrop, true)
	window.removeEventListener('dragstart', handleWindowDragStart, true)
	window.removeEventListener('dragend', handleWindowDragEnd, true)
	window.removeEventListener('dragover', handleWindowDragOverCapture, true)
})

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'row-ghost',
	sortable: true,
	dragHandle: '.drag-handle',
}

const [tbodyRef, rows] = useDragAndDrop<Row>(props.rows, config)

watch(rows, (val) => emit('update:rows', val as T[]))

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

function selectRow(row: Row, e: MouseEvent) {
	if ((e.target as HTMLElement).closest('.drag-handle, button, input, .q-checkbox')) return
	emit('update:selected', props.selected === row.id ? null : (row.id as T['id']))
}

const remove = (row: Row) => {
	emit('removeRow', row as T)
}

const edit = (row: Row) => {
	emit('edit', row as T)
}

const isInternalDrag = ref(false)
</script>

<template lang="pug">
table.dnd-table
	thead
		tr
			th.handle-col
			th(v-for="col in columns" :key="col.field") {{ col.label }}
			th.actions

	tbody(
		ref="tbodyRef"
		:class="{ 'tbody-drag-valid': dragState === 'valid', 'tbody-drag-invalid': dragState === 'invalid' }"
	)
		tr(
			v-for="row in rows",
			:key="row.id"
			:class="{ 'row-selected': selected === row.id }"
			@click="selectRow(row, $event)"
		)
			td.handle-col
				span.drag-handle ⠿
			td(v-for="col in columns" :key="col.field" :class="calcClass(col.align)")
				slot(:name="`cell-${col.field}`" :row="row" :col="col")
					q-checkbox(v-if="col.type === 'checkbox'" v-model="row[col.field]" dense)
					template(v-else) {{ row[col.field] }}
			td
				.action
					q-btn(flat round icon="mdi-pencil-outline" color="secondary" @click.stop="edit(row)" dense size="sm") 
					q-btn(flat round icon="mdi-close" color="secondary" dense size="sm") 
						q-menu
							q-list
								q-item.pink(clickable @click.stop="remove(row)")
									q-item-section Убрать

</template>

<style lang="scss" scoped>
.dnd-table {
	width: 100%;
	border-collapse: collapse;
	thead {
		background: var(--bgLight);
	}
	tbody {
		background: var(--bgLight);
		&.tbody-drag-valid {
			background: rgb(72 176 76 / 38%);
		}
		&.tbody-drag-invalid {
			// background: rgb(72 176 76 / 38%);
			background: rgba(244, 67, 54, 0.5);
		}
	}

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
		cursor: pointer;
		&.row-selected {
			background: var(--selection);
		}
	}
}

:deep(.row-ghost) {
	height: 39px;
	background: hsl(213 38% 81% / 1) !important;
	* {
		opacity: 0;
	}
}

.action {
	width: 100%;
	display: inline-flex;
	justify-content: end;
	gap: 0.5rem;
}

.handle-col {
	width: 32px;
}

.drag-handle {
	cursor: grab;
	user-select: none;

	&:active {
		cursor: grabbing;
	}
}
</style>
