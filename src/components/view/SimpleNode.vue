<script setup lang="ts">
import type { SimpleElement } from './nodesTypes'

interface Props {
	node: SimpleElement
	stat: Stat
}

const props = defineProps<Props>()

const sectionOptions = ['Сотрудники_1', 'Сотрудники_2', 'Документы']
const fieldOptions = ['Имя', 'Фамилия', 'Отчество', 'Должность']
const valueTypeOptions = ['Строка', 'Число', 'Дата']
const functionOptions = [
	'Left(строка, длина)',
	'Right(строка, длина)',
	'Upper(строка)',
	'Lower(строка)',
]

const collapse = (stat: any) => {
	stat.open = false
}

const emit = defineEmits<{
	addFunction: [item: any]
	remove: [stat: Stat]
}>()

const remove = () => {
	emit('remove', props.stat)
}
</script>

<template lang="pug">
q-expansion-item.my-expansion(v-model="props.stat.open")
	template(v-slot:header)
		.drag-handle(@mousedown="collapse(props.stat)" @touchstart="collapse(props.stat)") ⠿

		q-item-section
			.project
				| Простой элемент:
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
					q-item(clickable @click="remove" )
						q-item-section.text-negative Удалить

	.inside
		q-btn-group(outline)
			q-btn(
				:outline="props.node.mode !== 'field'"
				:color="props.node.mode === 'field' ? 'primary' : 'grey-9'"
				label="Поле раздела"
				@click="props.node.mode = 'field'"
				size='sm'
			)
			q-btn(
				:outline="props.node.mode !== 'fixed'"
				:color="props.node.mode === 'fixed' ? 'primary' : 'grey-9'"
				label="Фиксированное значение"
				@click="props.node.mode = 'fixed'"
				size='sm'
			)

		.field-form(v-if="props.node.mode === 'field'")
			.row.q-col-gutter-md.q-mt-sm
				.col
					.text-bold.q-mb-xs Раздел
					q-select(v-model="props.node.section" dense outlined :options="sectionOptions")
				.col
					.text-bold.q-mb-xs Поле
					q-select(v-model="props.node.field" dense outlined :options="fieldOptions")

			.q-mt-md
				.text-bold.q-mb-xs Применить функцию
				q-select(v-model="props.node.func" dense outlined :options="functionOptions")

			.func-box.q-mt-sm(v-if="props.node.func")
				.row.items-center.q-gutter-sm.q-mb-sm
					span Длина:
					q-input(v-model="props.node.funcLength" dense outlined style="width: 80px")
				q-chip(square color="green-4" text-color="green-10")
					| Результат: '{{ props.node.preview?.[0] }}'

			q-btn.q-mt-sm(
				flat
				no-caps
				color="primary"
				icon="mdi-plus"
				label="Добавить ещё функцию (цепочка)"
				@click="emit('addFunction', props.node)"
			)

			.preview-box.q-mt-md
				| Предпросмотр значения: {{ props.node.preview }}

		.fixed-form(v-if="props.node.mode === 'fixed'")
			.row.q-col-gutter-md.q-mt-sm
				.col
					.text-bold.q-mb-xs  Тип значения
					q-select(v-model="props.node.valueType" dense outlined :options="valueTypeOptions")

				.col
					.text-bold.q-mb-xs Значение
					q-input(v-model="props.node.fixedValue" dense outlined clearable)
					.hint.q-mt-xs(v-if="props.node.fixedValue === ' '") (символ пробела)

			q-item.apply-func.q-mt-md(clickable @click="emit('addFunction', props.node)")
				q-item-section Применить функцию
				q-item-section(side)
					q-icon(name="mdi-plus")

			.preview-box.q-mt-md
				q-icon.q-mr-sm(name="mdi-eye")
				| Предпросмотр: '{{ props.node.fixedValue }}'
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

.close {
	align-self: center;
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
:deep(.q-item__section--side) {
	padding-left: 0;
}
</style>
