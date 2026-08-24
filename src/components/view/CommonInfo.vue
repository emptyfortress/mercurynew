<script setup lang="ts">
import { Kind } from '@/types/enum'
import { ref } from 'vue'

interface Col {
	id: string
	type: string
	text: string
	kind: null
	newkind: null
	children: []
	sort: false
	order: string
	hide: boolean
	source?: string
}
const draft = defineModel<Col>('draft')

const options = [
	{ id: 1, label: 'Строка', value: Kind.String },
	{ id: 2, label: 'Текст', value: Kind.Text },
	{ id: 3, label: 'Дата', value: Kind.Date },
	{ id: 4, label: 'Организация', value: Kind.Org },
	{ id: 5, label: 'Сотрудник', value: Kind.Man },
	{ id: 6, label: 'Статус', value: Kind.Status },
	{ id: 7, label: 'Линк', value: Kind.Link },
	{ id: 8, label: 'Телефон', value: Kind.Phone },
	{ id: 9, label: 'Email', value: Kind.Email },
	{ id: 10, label: 'Число', value: Kind.Num },
	{ id: 11, label: 'Логический тип', value: Kind.Bool },
	{ id: 12, label: 'Таблица', value: Kind.Table },
	{ id: 13, label: 'Виртуальное поле', value: Kind.Virtual },
]

const html = ref(false)
</script>

<template lang="pug">
.grid2(v-if='draft')
	label Название:
	q-input(v-model="draft.text" dense outlined)
	label Тип данных:
	q-select(v-model="draft.kind" dense outlined :options="options" map-options emit-value)
	label
	q-checkbox(v-model='draft.hide' label='Скрыть колонку' dense)
	template(v-if='draft.kind == 0 || draft.kind == 1' )
		div
		q-checkbox(v-model='html' label='Отображать содержимое колонки как HTML' dense)
	template(v-if='draft.kind == 2' )
		div
		q-checkbox(v-model='html' label='Сортировать по чему-то там' dense)

</template>

<style scoped lang="scss">
.grid2 {
	display: grid;
	grid-template-columns: auto 1fr;
	// justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	margin-bottom: 2rem;
}
</style>
