<script setup lang="ts">
import { reactive, ref } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'

type ProcessVariable = {
	id: string
	name: string
	type: string
	value: string
	isCollection: boolean
	description: string
}

let suppressRowClick = false

const [variablesList, variables] = useDragAndDrop<ProcessVariable>(
	[
		{
			id: 'server-address',
			name: 'АдресСервера',
			type: 'Строка',
			value: 'http://dv-contracts',
			isCollection: false,
			description: '',
		},
		{
			id: 'document',
			name: 'Документ',
			type: 'Документ',
			value: 'Договорной документ',
			isCollection: false,
			description: '',
		},
	],
	{
		plugins: [animations()],
		onDragstart: () => {
			suppressRowClick = true
		},
		draggable: (element) => element.classList.contains('variable-row'),
		dragPlaceholderClass: 'ghost',
		synthDragPlaceholderClass: 'ghost',
	}
)

const editorOpen = ref(false)
const editingId = ref<string | null>(null)
const draft = reactive({
	name: '',
	type: 'Строка',
	isCollection: false,
	value: '',
	description: '',
})
const typeOptions = [
	'Строка',
	'Целое число',
	'Дробное число',
	'Дата и время',
	'Логический',
	'Документ',
]
let nextId = 1

function openEditor(variable?: ProcessVariable) {
	editingId.value = variable?.id ?? null
	Object.assign(draft, {
		name: variable?.name ?? '',
		type: variable?.type ?? 'Строка',
		value: variable?.value ?? '',
		isCollection: variable?.isCollection ?? false,
		description: variable?.description ?? '',
	})
	editorOpen.value = true
}

function onRowClick(variable: ProcessVariable) {
	if (!suppressRowClick) openEditor(variable)
}

function validateName(value: string) {
	if (!value.trim()) return 'Введите название переменной'
	return (
		!variables.value.some(
			(variable) => variable.id !== editingId.value && variable.name === value.trim()
		) || 'Переменная с таким названием уже существует'
	)
}

function saveVariable() {
	const values = { ...draft, name: draft.name.trim() }
	if (editingId.value) {
		variables.value = variables.value.map((variable) =>
			variable.id === editingId.value ? { ...variable, ...values } : variable
		)
	} else {
		variables.value = [...variables.value, { id: `variable-${nextId++}`, ...values }]
	}
	editorOpen.value = false
}

function copyVariable(variable: ProcessVariable) {
	openEditor(variable)
	editingId.value = null
	let name = `${variable.name}_копия`
	let suffix = 2
	while (variables.value.some((item) => item.name === name)) {
		name = `${variable.name}_копия${suffix++}`
	}
	draft.name = name
}

function removeVariable(id: string) {
	variables.value = variables.value.filter((variable) => variable.id !== id)
}
</script>

<template lang="pug">
.variables-settings-tab
	.text-caption.text-grey-9 Настройка переменных процесса.
	div
		q-markup-table.variables-table(flat dense wrap-cells)
			thead
				tr
					th.text-left Название
					th.text-left Тип
					th.text-center Коллекция
					th.text-left Значение
					th.text-left Описание
					th.actions-cell
			tbody(ref="variablesList")
				tr.variable-row(v-for="variable in variables" :key="variable.id" tabindex="0" @pointerdown="suppressRowClick = false" @click="onRowClick(variable)" @keydown.enter.self.prevent="openEditor(variable)" @keydown.space.self.prevent="openEditor(variable)")
					td.variable-name {{ variable.name }}
					td {{ variable.type }}
					td.text-center
						q-checkbox(:model-value="variable.isCollection" size="sm" dense disable)
					td.variable-value {{ variable.value || '—' }}
					td.variable-description {{ variable.description || '—' }}
					td.actions-cell.text-right(@click.stop @pointerdown.stop)
						q-btn(flat round dense size="sm" color="primary" icon="mdi-dots-vertical" title="Действия с переменной" @click.stop)
							q-menu(auto-close anchor="bottom right" self="top right")
								q-list(dense)
									q-item(clickable @click="openEditor(variable)")
										q-item-section(side)
											q-icon(name="mdi-pencil-outline" color="primary")
										q-item-section Редактировать
									q-item(clickable @click="copyVariable(variable)")
										q-item-section(side)
											q-icon(name="mdi-content-copy" color="primary")
										q-item-section Копировать
									q-separator
									q-item.text-negative(clickable @click="removeVariable(variable.id)")
										q-item-section(side)
											q-icon(name="mdi-delete-outline" color="negative")
										q-item-section Удалить
				tr(v-if="!variables.length")
					td.text-center.text-grey-7.q-pa-lg(colspan="6") Переменных пока нет. Добавьте первую переменную.
	.row.justify-center
		q-btn(flat dense color="primary" icon="mdi-plus" label="Добавить переменную" @click="openEditor()")

	q-dialog(v-model="editorOpen" backdrop-filter="blur(4px) saturate(150%)")
		q-card.variable-editor
			q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
			q-form(@submit="saveVariable")
				q-card-section
					.text-h6 {{ editingId ? 'Редактирование переменной' : 'Новая переменная' }}
				q-card-section.q-pt-none
					.column.q-gutter-md
						q-input(v-model="draft.name" label="Название" dense outlined autofocus :rules="[validateName]" lazy-rules hide-bottom-space)
						q-select(v-model="draft.type" :options="typeOptions" label="Тип" dense outlined options-dense)
						q-checkbox.text-black(v-model="draft.isCollection" label="Коллекция значений" dense)
						q-input(v-model="draft.value" label="Значение" dense outlined)
						q-input(v-model="draft.description" label="Описание" type="textarea" rows="3" dense outlined)
				q-card-actions(align="right")
					q-btn(flat color="primary" label="Отмена" v-close-popup)
					q-btn(unelevated color="primary" :label="editingId ? 'Сохранить' : 'Добавить'" type="submit")
</template>

<style scoped lang="scss">
.variables-settings-tab {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-width: 0;
	padding-bottom: 1rem;
	color: var(--q-primary);
}

.variables-table {
	border-color: var(--my-border-color);
	// background: var(--bg-panel);
	background: #fff;

	:deep(table) {
		min-width: 560px;
	}

	th,
	td {
		padding-left: 6px;
		padding-right: 6px;
	}

	th {
		background: var(--bgLight);
	}

	.actions-cell {
		position: sticky;
		right: 0;
		width: 44px;
		padding: 0 4px;
		background: #fff;
	}

	th.actions-cell {
		background: var(--bgLight);
	}
}

.variable-name,
.variable-value,
.variable-description {
	min-width: 130px;
	max-width: 220px;
	overflow-wrap: anywhere;
}

.variable-row {
	cursor: grab;
	user-select: none;

	&:active {
		cursor: grabbing;
	}
}

// Keep the table cells in the layout when the shared .ghost class hides descendants.
.variable-row.ghost > td {
	display: table-cell;
	background: inherit;
	color: transparent;

	&::before,
	&::after {
		display: none;
	}
}

.variable-editor {
	width: 440px;
	max-width: calc(100vw - 32px);
}
.q-table--dense .q-table th:last-child,
.q-table--dense .q-table td:last-child {
	padding-right: 0;
}
</style>
