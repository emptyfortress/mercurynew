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
}
const list = ref<SimpleElement[]>([])

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
	list.value.push({
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
	})
}
</script>

<template lang="pug">
.mygrid
	label Тип результата:
	q-select(v-model="result" dense outlined :options="options")
	div
.text-bold Элементы вычисляемого поля

q-list
	q-expansion-item.my-expansion(
		v-for="item in list",
		:key="item.id",
		v-model="item.expanded"
	)
		template(v-slot:header)
			.drag-handle ⠿

			q-item-section
				.project
					|Простой элемент:
					span.editable(@click.stop) {{ item.name }}
						q-popup-edit(v-model="item.name" v-slot="scope")
							q-input(
								v-model="scope.value"
								dense
								autofocus
								@keyup.enter="scope.set"
							)

		.inside
			q-btn-group(outline)
				q-btn(
					:outline="item.mode !== 'field'"
					:color="item.mode === 'field' ? 'primary' : 'grey-9'"
					label="Поле раздела"
					@click="item.mode = 'field'"
					size='sm'
				)
				q-btn(
					:outline="item.mode !== 'fixed'"
					:color="item.mode === 'fixed' ? 'primary' : 'grey-9'"
					label="Фиксированное значение"
					@click="item.mode = 'fixed'"
					size='sm'
				)
			
			.field-form(v-if="item.mode === 'field'")
				.row.q-col-gutter-md.q-mt-sm
					.col
						.text-bold.q-mb-xs Раздел
						q-select(v-model="item.section" dense outlined :options="sectionOptions")
					.col
						.text-bold.q-mb-xs Поле
						q-select(v-model="item.field" dense outlined :options="fieldOptions")

				.q-mt-md
					.text-bold.q-mb-xs Применить функцию
					q-select(v-model="item.func" dense outlined :options="functionOptions")

				.func-box.q-mt-sm(v-if="item.func")
					.row.items-center.q-gutter-sm.q-mb-sm
						span Длина:
						q-input(v-model="item.funcLength" dense outlined style="width: 80px")
					q-chip(square color="green-1" text-color="green-9")
						| Результат: '{{ item.preview?.[0] }}'

				q-btn.q-mt-sm(
					flat
					no-caps
					color="primary"
					icon="mdi-plus"
					label="Добавить ещё функцию (цепочка)"
					@click="addFunction(item)"
				)

				.preview-box.q-mt-md
					| Предпросмотр значения: {{ item.preview }}

			.fixed-form(v-if="item.mode === 'fixed'")
				.text-bold.q-mt-md.q-mb-xs Тип значения
				q-select(v-model="item.valueType" dense outlined :options="valueTypeOptions")

				.text-bold.q-mt-sm.q-mb-xs Значение
				q-input(v-model="item.fixedValue" dense outlined clearable)
				.hint.q-mt-xs(v-if="item.fixedValue === ' '") (символ пробела)

				q-item.apply-func.q-mt-md(clickable @click="addFunction(item)")
					q-item-section Применить функцию
					q-item-section(side)
						q-icon(name="mdi-plus")

				.preview-box.q-mt-md
					q-icon.q-mr-sm(name="mdi-eye")
					| Предпросмотр: '{{ item.fixedValue }}'

q-btn(flat icon="mdi-plus" color="primary" label="Добавить элемент" size="sm") 
	q-menu
		q-list
			q-item(clickable @click="addSimpleElement" v-close-popup)
				q-item-section Простой элемент
			q-item(clickable)
				q-item-section Набор вариантов
			q-item(clickable)
				q-item-section Набор условий
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
