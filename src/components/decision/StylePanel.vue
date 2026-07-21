<script setup lang="ts">
import { ref } from 'vue'

const font = ref('8.25 pt, MS Sans Serif')
const line = ref('Нет')
const vid = ref('Сплошная')

const check = ref([
	{ label: 'Показывать значок типа карточки', val: false },
	{ label: 'Показывать область группировки', val: false },
	{ label: 'Запретить предварительный просмотр', val: false },
	{ label: 'Позволять изменять размеры строки', val: false },
	{ label: 'Отключить масштабирование ширины колонок', val: false },
	{ label: 'Не скрывать группируемые колонки', val: false },
])
</script>

<template lang="pug">
fieldset
	legend Заголовки колонок
	.grid
		q-btn(unelevated color="primary" label="Шрифт..." size="sm") 
		q-input.input(v-model="font" dense outlined)

fieldset
	legend Строки таблицы
	.grid
		q-btn(unelevated color="primary" label="Шрифт..." size="sm") 
		q-input.input(v-model="font" dense outlined)

fieldset
	legend Линии таблицы
	.grid
		label Линии:
		q-select.input(v-model="line" dense outlined)
		label Вид линий:
		q-select.input(v-model="vid" dense outlined)

fieldset
	legend Настройки
	.column.q-gutter-y-sm
		q-checkbox(v-for="item in check" :key="item.label" v-model='item.val' :label='item.label' dense)
</template>

<style lang="scss" scoped>
fieldset {
	border: 1px solid var(--my-border-color);
	padding: 0.5rem 1rem;
	margin-bottom: 1rem;
}
legend {
	padding: 0 0.5rem;
	color: $blue-grey-7;
}
.input {
	width: 300px;
}
.grid {
	display: grid;
	grid-template-columns: 100px 1fr;
	column-gap: 1rem;
	row-gap: 0.5rem;
	align-items: center;
}
</style>
