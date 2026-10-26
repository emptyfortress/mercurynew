<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { createProcessVariable, defaultAdditionalSettings, type ProcessVariable } from '../processVariables'
import { instance, processVariables } from '../singleMonitorLayoutState'

let suppressRowClick = false

const [variablesList, variables] = useDragAndDrop<ProcessVariable>(
	[...processVariables.value],
	{
		plugins: [animations()],
		onDragstart: () => {
			suppressRowClick = true
		},
		draggable: (element) => element.classList.contains('variable-row'),
		dragPlaceholderClass: 'ghost',
		synthDragPlaceholderClass: 'ghost',
		onSort: ({ values }) => { processVariables.value = [...values] },
	}
)

const editorOpen = ref(false)
watch(processVariables, (items) => { variables.value = [...items] })
watch(() => instance.value.id, () => { editorOpen.value = false })
const advancedExpanded = ref(false)
const editingId = ref<string | null>(null)
const draft = reactive({
	name: '',
	type: 'Строка',
	isCollection: false,
	isRequired: false,
	...defaultAdditionalSettings,
	value: '',
	collectionValues: [] as { id: number; value: string }[],
	description: '',
})
const typeOptions = [
	'Строка',
	'Целое число',
	'Дробное число',
	'Дата и время',
	'Логический',
	'Документ',
	'Сотрудник DV',
]
let nextCollectionValueId = 1

function openEditor(variable?: ProcessVariable) {
	editingId.value = variable?.id ?? null
	advancedExpanded.value = false
	Object.assign(draft, {
		name: variable?.name ?? '',
		type: variable?.type ?? 'Строка',
		value: variable?.value ?? '',
		collectionValues: (variable?.collectionValues ?? []).map((value) => ({
			id: nextCollectionValueId++,
			value,
		})),
		isCollection: variable?.isCollection ?? false,
		isRequired: variable?.isRequired ?? false,
		saveHistory: variable?.saveHistory ?? defaultAdditionalSettings.saveHistory,
		addedAtRuntime: variable?.addedAtRuntime ?? defaultAdditionalSettings.addedAtRuntime,
		copyOnCreate: variable?.copyOnCreate ?? defaultAdditionalSettings.copyOnCreate,
		hiddenFromParent: variable?.hiddenFromParent ?? defaultAdditionalSettings.hiddenFromParent,
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
		!processVariables.value.some(
			(variable) => variable.id !== editingId.value && variable.name === value.trim()
		) || 'Переменная с таким названием уже существует'
	)
}

function saveVariable() {
	const values = {
		...draft,
		name: draft.name.trim(),
		collectionValues: draft.collectionValues.map((item) => item.value),
	}
	if (editingId.value) {
		processVariables.value = processVariables.value.map((variable) =>
			variable.id === editingId.value ? { ...variable, ...values } : variable
		)
	} else {
		processVariables.value = [...processVariables.value, {
			...createProcessVariable(values.name, values.type),
			...values,
		}]
	}
	editorOpen.value = false
}

function copyVariable(variable: ProcessVariable) {
	openEditor(variable)
	editingId.value = null
	let name = `${variable.name}_копия`
	let suffix = 2
	while (processVariables.value.some((item) => item.name === name)) {
		name = `${variable.name}_копия${suffix++}`
	}
	draft.name = name
}

function removeVariable(id: string) {
	processVariables.value = processVariables.value.filter((variable) => variable.id !== id)
}

function addCollectionValue(value = '') {
	draft.collectionValues.push({ id: nextCollectionValueId++, value })
}

function onCollectionChange(enabled: boolean) {
	if (enabled && !draft.collectionValues.length && draft.value) {
		addCollectionValue(draft.value)
	}
}

function variableValue(variable: ProcessVariable) {
	if (!variable.isCollection) return variable.value || '—'
	return variable.collectionValues.map((value) => value || '—').join('; ') || '—'
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
					th.text-center Обяз.
					th.text-left Значение
					// th.text-left Описание
					th.actions-cell
			tbody(ref="variablesList")
				tr.variable-row(v-for="variable in variables" :key="variable.id" tabindex="0" @pointerdown="suppressRowClick = false" @click="onRowClick(variable)" @keydown.enter.self.prevent="openEditor(variable)" @keydown.space.self.prevent="openEditor(variable)")
					td.variable-name {{ variable.name }}
					td {{ variable.type }}
					td.text-center
						q-checkbox(:model-value="variable.isCollection" size="sm" dense disable)
					td.text-center
						q-checkbox(:model-value="variable.isRequired" size="sm" dense disable)
					td.variable-value {{ variableValue(variable) }}
					// td.variable-description {{ variable.description || '—' }}
					td.actions-cell.text-right(@click.stop @pointerdown.stop)
						q-btn(flat round dense size="sm" color="primary" icon="mdi-dots-vertical" title="Действия с переменной" @click.stop)
							q-menu(auto-close anchor="bottom right" self="top right")
								q-list(dense)
									q-item(clickable @click="openEditor(variable)")
										q-item-section(side)
											q-icon(name="mdi-pencil-outline" color="primary" size='16px')
										q-item-section Редактировать
									q-item(clickable @click="copyVariable(variable)")
										q-item-section(side)
											q-icon(name="mdi-content-copy" color="primary" size='16px')
										q-item-section Копировать
									q-separator
									q-item.text-negative(clickable @click="removeVariable(variable.id)")
										q-item-section(side)
											q-icon(name="mdi-delete-outline" color="negative"  size='16px')
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
						.row.justify-between
							q-checkbox.text-black(v-model="draft.isRequired" label="Обязательная" dense)
							q-checkbox.text-black(v-model="draft.isCollection" label="Коллекция значений" dense @update:model-value="onCollectionChange")
						div(v-if="draft.isCollection")
							.text-subtitle2.q-mb-sm Значения коллекции
							q-list.collection-values(v-if="draft.collectionValues.length" bordered separator)
								q-item(v-for="(item, index) in draft.collectionValues" :key="item.id" dense)
									q-item-section
										q-input(v-model="item.value" :label="`Значение ${index + 1}`" dense outlined hide-bottom-space @keydown.enter.prevent="addCollectionValue()")
									q-item-section(side)
										q-btn(flat round dense size="sm" color="secondary" icon="mdi-close" title="Удалить значение" @click="draft.collectionValues.splice(index, 1)")
											q-tooltip Удалить значение
							.text-caption.text-grey-7(v-else) В коллекции пока нет значений.
							q-btn.q-mt-sm(flat dense color="primary" icon="mdi-plus" label="Добавить значение" @click="addCollectionValue()")
						q-input(v-else v-model="draft.value" label="Значение" dense outlined)
						q-input(v-model="draft.description" label="Описание" type="textarea" rows="3" dense outlined)
						q-expansion-item.variable-advanced(v-model="advancedExpanded" label="Дополнительно" dense expand-separator header-class="text-primary")
							.column.q-gutter-sm.q-pa-sm
								q-checkbox.text-black(v-model="draft.saveHistory" label="Сохранять историю значений при исполнении бизнес-процесса" dense)
								q-checkbox.text-black(:model-value="draft.isRequired" label="Значение переменной должно быть задано при создании экземпляра бизнес-процесса" dense disable)
								q-checkbox.text-black(v-model="draft.addedAtRuntime" label="Переменная была добавлена при выполнении бизнес-процесса" dense)
								q-checkbox.text-black(:model-value="draft.isCollection" label="Коллекция значений" dense disable)
								q-checkbox.text-black(v-model="draft.copyOnCreate" label="Создавать копию значения переменной при создании экземпляра бизнес-процесса" dense)
								q-checkbox.text-black(v-model="draft.hiddenFromParent" label="Скрыта от родительского процесса" dense)
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

.variable-advanced {
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
	font-size: 0.8rem;
	line-height: 1.1;
}

.collection-values {
	max-height: 240px;
	overflow-y: auto;
	border-color: var(--my-border-color);
	border-radius: var(--rad);

	.q-item {
		padding: 6px 8px;
	}
}
.q-table--dense .q-table th:last-child,
.q-table--dense .q-table td:last-child {
	padding-right: 0;
}
</style>
