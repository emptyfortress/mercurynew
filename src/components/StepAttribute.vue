<script setup lang="ts">
import { ref } from 'vue'
import { uid } from 'quasar'
import { useStorage } from '@vueuse/core'

const app = useStorage('app', localStorage)

const attributes = ref<any[]>([])


const name = ref('')
const type = ref('Строка')

const calcType = (e: string) => {
	switch (e) {
		case 'Строка':
			return 'text'
		case 'Текст':
			return 'textarea'
		case 'Дата':
			return 'date'
		default:
			return 'select'
	}
}

const addField = () => {
	let tmp = {
		id: uid(),
		name: name.value,
		type: calcType(type.value),
		typ: type.value,
		visible: true,
		readonly: false,
		selected: false,
		options: ['Иванов', 'Петров', 'Орлов'],
	}
	attributes.value.push(tmp)
	name.value = ''
	input.value.focus()
}
const destroy = (e: number) => {
	attributes.value.splice(e, 1)
}

const options = ['Строка', 'Текст', 'Дата', 'Ссылка на справочник']

const input = ref()
</script>

<template lang="pug">
div Добавьте в <span class='text-bold text-uppercase'>{{ app.card }}</span> необходимые поля. Поля нужны для отображения информации, которую заполняют участники процесса. Например: Автор, Срок выполнения, Проверяющий и тд. Также у полей задается тип: строка, дата, номер, сотрудник
q-markup-table(flat bordered style="width: 500px;")
	thead
		tr
			th.text-left Название
			th.text-left Тип
			th.text-right

	tbody
		tr(v-if='attributes.length == 0')
			td(colspan='3')
				.no Поля не заданы.

		tr(v-else v-for="(attr, index) in attributes" :key="attr.id")
			td {{ attr.name }}
			td {{ attr.typ }}
			td.text-right
				q-btn(flat round icon="mdi-close" color="primary" @click='destroy(index)' size='sm') 


q-form(@submit='addField')
	.row.items-center.q-gutter-x-sm
		q-input(ref='input' autofocus v-model="name" label='Название поля' dense outlined bg-color="white")
		q-select(v-model="type" label='Тип поля' dense outlined bg-color="white" :options='options')
		q-btn(flat color="primary" label="Добавить" type='submit') 

div Поля необходимо будет разместить на формы позднее, при их настройке.

</template>

<style scoped lang="scss">
.q-select,
.q-input {
	width: 200px;
}

.q-table thead tr {
	height: 28px;
}

.no {
	color: $negative;
}

.q-markup-table {
	margin-top: 1rem;
	margin-bottom: 1rem;
}
</style>
