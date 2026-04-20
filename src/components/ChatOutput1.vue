<script setup lang="ts">
import type { QTableProps } from 'quasar'

const cols: QTableProps['columns'] = [
	{
		name: 'name',
		required: true,
		label: 'Название поля',
		align: 'left',
		field: 'name',
		sortable: true,
	},
	{
		name: 'type',
		required: true,
		label: 'Тип поля',
		align: 'left',
		field: 'type',
		sortable: true,
	},
]
const rows = [
	{
		id: 0,
		name: 'Автор',
		type: 'Строка справочника',
	},
	{
		id: 1,
		name: 'Дата начала командировки',
		type: 'Дата',
	},
	{
		id: 2,
		name: 'Дата окончания командировки',
		type: 'Дата',
	},
	{
		id: 3,
		name: 'Цель поездки',
		type: 'Строка',
	},
	{
		id: 4,
		name: 'Город/страна',
		type: 'Строка',
	},
	{
		id: 5,
		name: 'Аванс',
		type: 'Boolean',
	},
	{
		id: 6,
		name: 'Сумма аванса',
		type: 'Number',
	},
]
</script>

<template lang="pug">
div Отличная задача! Все ясно, давай сразу приступим к делу. Прежде, чем начать, надо определиться с рядом вопросов.

br
q-separator
h2 1. Выберем название приложения:
ul
	li Командировки
	// li Приложение "Командировки"
	// li BusinessTrip
	// li Другой вариант

br
q-separator
h2 2. Краткое описание приложения
ul
	li Простое приложение учета и согласования командировок сотрудников.

br
q-separator
h2 3. Придумаем название для карточки:
ul
	li Командировка
	// li BusinessTripCard

br
q-separator
h2 4. Определим поля карточки
.q-mb-md Наша карточка может содержать следующие поля:

q-table(
	flat
	bordered
	dense
	:columns='cols'
	:rows='rows'
	:rows-per-page-options=[0]
	hide-bottom
)


br
h2 🧭 Дальше
div Если тебя все устраивает - нажми "Создать приложение", либо уточни, что неверно.
br
br
// ol
// 	li 👉 Нарисуем BPMN схему процесса
// 	li 👉 Создадим карточку и форму заявки на командировку
// 	li 👉 Сразу сделаем полный скелет приложения и будем дорабатывать по шагам.

</template>
<style scoped lang="scss">
h1 {
	font-size: 1.5rem;
	font-weight: 600;
	line-height: 4rem;
}
h2 {
	font-size: 1.2rem;
	font-weight: 600;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	line-height: 1.2;
	// padding-bottom: 0.5rem;
	span {
		font-weight: 400;
		font-size: 0.8rem;
		margin-left: 1rem;
	}
}
:deep(.q-table thead) {
	background: #ccc;
}
</style>
