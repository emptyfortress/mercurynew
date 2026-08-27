<script setup lang="ts">
import { ref } from 'vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'

const result = ref()
const options = [
	'Строка',
	'Строка Unicode',
	'Дата и время',
	'Целое число',
	'Дробное число',
	'Идентификатор',
	'Да / нет',
]

let nextId = 1

interface SimpleElement {
	id: number
	name: string
	type: string
	expanded: boolean
	mode: 'field' | 'fixed'
	section: string
	field: string
	func: string
	funcLength: null | number
	preview: string
	valueType: string
	fixedValue: string
	children: SimpleElement[]
}
const list = ref<SimpleElement[]>([])
const tree = ref()

const addFunction = (item: any) => {
	console.log('add function chain', item)
}
const sectionOptions = ['Сотрудники_1', 'Сотрудники_2', 'Документы']
const fieldOptions = ['Имя', 'Фамилия', 'Отчество', 'Должность']
const valueTypeOptions = ['Строка', 'Число', 'Дата']
const functionOptions = [
	'Left(строка, длина)',
	'Right(строка, длина)',
	'Upper(строка)',
	'Lower(строка)',
]

const addSimpleElement = () => {
	tree.value.add({
		id: nextId++,
		type: 'simple',
		name: 'Новый элемент',
		expanded: false,
		mode: 'field',
		section: '',
		field: '',
		func: '',
		funcLength: null,
		preview: '',
		valueType: '',
		fixedValue: '',
		children: [],
	})
}
const addOptionsSet = () => {
	tree.value.add({
		id: nextId++,
		type: 'options',
		name: 'Набор вариантов',
		expanded: false,
		children: [],
	})
}

const addConditionsSet = () => {
	tree.value.add({
		id: nextId++,
		type: 'conditions',
		name: 'Набор условий',
		expanded: false,
		children: [],
	})
}
</script>

<template lang="pug">
.mygrid
	label Тип результата:
	q-select(v-model="result" dense outlined :options="options")
	div
.text-bold Элементы вычисляемого поля

Draggable(
	ref="tree",
	treeLine,
	v-model="list",
	:indent="40"
	class='mtl-tree'
)
	template(#default="{ node, stat }")
		q-expansion-item.my-expansion(v-model="stat.open")
			template(v-slot:header)
				.drag-handle ⠿

				q-item-section
					.project
						|Простой элемент:
						span.editable(@click.stop) {{ node.name }}
							q-popup-edit(v-model="node.name" v-slot="scope")
								q-input(
									v-model="scope.value"
									dense
									autofocus
									@keyup.enter="scope.set"
								)

			.inside
				q-btn-group(outline)
					q-btn(
						:outline="node.mode !== 'field'"
						:color="node.mode === 'field' ? 'primary' : 'grey-9'"
						label="Поле раздела"
						@click="node.mode = 'field'"
						size='sm'
					)
					q-btn(
						:outline="node.mode !== 'fixed'"
						:color="node.mode === 'fixed' ? 'primary' : 'grey-9'"
						label="Фиксированное значение"
						@click="node.mode = 'fixed'"
						size='sm'
					)
				
				.field-form(v-if="node.mode === 'field'")
					.row.q-col-gutter-md.q-mt-sm
						.col
							.text-bold.q-mb-xs Раздел
							q-select(v-model="node.section" dense outlined :options="sectionOptions")
						.col
							.text-bold.q-mb-xs Поле
							q-select(v-model="node.field" dense outlined :options="fieldOptions")

					.q-mt-md
						.text-bold.q-mb-xs Применить функцию
						q-select(v-model="node.func" dense outlined :options="functionOptions")

					.func-box.q-mt-sm(v-if="node.func")
						.row.items-center.q-gutter-sm.q-mb-sm
							span Длина:
							q-input(v-model="node.funcLength" dense outlined style="width: 80px")
						q-chip(square color="green-1" text-color="green-9")
							| Результат: '{{ node.preview?.[0] }}'

					q-btn.q-mt-sm(
						flat
						no-caps
						color="primary"
						icon="mdi-plus"
						label="Добавить ещё функцию (цепочка)"
						@click="addFunction(node)"
					)

					.preview-box.q-mt-md
						| Предпросмотр значения: {{ node.preview }}

				.fixed-form(v-if="node.mode === 'fixed'")
					.text-bold.q-mt-md.q-mb-xs Тип значения
					q-select(v-model="node.valueType" dense outlined :options="valueTypeOptions")

					.text-bold.q-mt-sm.q-mb-xs Значение
					q-input(v-model="node.fixedValue" dense outlined clearable)
					.hint.q-mt-xs(v-if="node.fixedValue === ' '") (символ пробела)

					q-item.apply-func.q-mt-md(clickable @click="addFunction(node)")
						q-item-section Применить функцию
						q-item-section(side)
							q-icon(name="mdi-plus")

					.preview-box.q-mt-md
						q-icon.q-mr-sm(name="mdi-eye")
						| Предпросмотр: '{{ node.fixedValue }}'

q-btn(flat icon="mdi-plus" color="primary" label="Добавить элемент" size="sm") 
	q-menu
		q-list
			q-item(clickable @click="addSimpleElement" v-close-popup)
				q-item-section Простой элемент
			q-item(clickable @click="addOptionsSet" v-close-popup)
				q-item-section Набор вариантов
			q-item(clickable @click="addConditionsSet" v-close-popup)
				q-item-section Набор условий
			q-separator
			q-item(clickable @click="addGroup" v-close-popup)
				q-item-section Группа
</template>

<style scoped lang="scss">
.project {
	span {
		font-weight: 600;
		margin-left: 0.5rem;
	}
}
.group {
	padding: 0.25rem 1rem;
	background: var(--bgLight);
	border: var(--border);
}
.node {
	padding: 0.25rem 1rem;
}
.mygrid {
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.q-select {
	width: 100%;
}
.q-expansion-item {
	background: var(--bgLight);
	border-radius: 0.25rem;
	margin-bottom: 0.5rem;
	cursor: pointer;
	border: var(--border);
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
.func-box {
	background: var(--bgLight);
	border-radius: 0.5rem;
	padding: 0.75rem 1rem;
}
.preview-box {
	background: var(--bgLight);
	border-radius: 0.5rem;
	padding: 0.6rem 1rem;
	color: $grey-8;
}
span.editable {
	color: $primary;
	border-bottom: 1px dotted $primary;
	cursor: pointer;
}
.apply-func {
	border: var(--border);
	border-radius: 0.5rem;
	padding: 0;
	min-height: 2.75rem;
}
.hint {
	color: $grey-6;
	font-size: 0.8rem;
}
</style>
