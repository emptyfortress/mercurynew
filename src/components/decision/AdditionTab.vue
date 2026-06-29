<script setup lang="ts">
import { ref } from 'vue'

const check1 = ref(false)
const check2 = ref(false)
const check3 = ref(false)
const check4 = ref(false)
const check5 = ref(false)
const check6 = ref(false)
const check7 = ref(false)

const labels = [
	'Добавить к результатам поиска карточки, принадлежащие к одной теме обработки с найденным',
	'Добавить к результатам поиска карточки, связанные с найденными карточками',
	'Искать в архивированных карточках',
	'Искать в удаленных карточках',
	'Включить в результаты поиска все карточки указанных типов из выбранных папок без ограничений на их атрибуты',
	'Отключить проверку прав',
	'Изменение на уровне БД',
]

const step1 = ref(2)
const step2 = ref(2)
const step21 = ref('Все')
const step22 = ref('Все')
</script>

<template lang="pug">
.q-pa-md
	.col-12
		.text-bold Дополнительные настройки
	div
		q-checkbox(v-model="check3" :label="labels[2]")
	div
		q-checkbox(v-model="check4" :label="labels[3]")
	div
		q-checkbox(v-model="check5" :label="labels[4]")
	div
		q-checkbox(v-model="check1" :label="labels[0]")
		.myflex(v-if='check1')
			div не более, чем в
			q-input(dense v-model="step1" type="number" outlined)
			div шагах
	div
		q-checkbox(v-model="check2" :label="labels[1]")
		.myflex(v-if='check2')
			div не более, чем
			q-input(dense v-model="step2" type="number" outlined)
			div ссылками
			q-select.q-ml-xl(dense outlined v-model="step21" label="Тип ссылок")
			q-select(dense outlined v-model="step22" label="Направление")
	div
		q-checkbox(v-model="check6" :label="labels[5]")
	div
		q-checkbox(v-model="check7" :label="labels[6]")

</template>

<style scoped lang="scss">
.q-input {
	width: 60px;
}
.myflex {
	margin-left: 3rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	.q-select {
		width: 200px;
	}
}
</style>
