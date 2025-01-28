<script setup lang="ts">
import { ref } from 'vue'
// import { useForms } from '@/stores/forms'
import { useStorage } from '@vueuse/core'
import { uid } from 'quasar'

const app = useStorage('app', localStorage)

interface Mystatus {
	id: string
	label: string
	value: string
}
const statuses = ref<Mystatus[]>([])

const destroy = (e: number) => {
	statuses.value.splice(e, 1)
}
const status = ref('')

const input = ref()

const add = () => {
	let tmp = {
		id: uid(),
		label: status.value,
		value: status.value
	}
	statuses.value.push(tmp)
	status.value = ''
	input.value.focus()
}

const emit = defineEmits(['next'])

const nexxt = () => {
	if (status.value !== '') {
		add()
	}

	emit('next')
}
</script>

<template lang="pug">
div В процессе обработки <span class='text-bold text-uppercase'>{{ app.card }}</span> может находиться в различных состояниях (статусах), например: подготовка, рассмотрение, согласование, архив и тп.

q-markup-table(flat bordered style="width: 500px;")
	thead
		tr
			th.text-left Статус
			th.text-rigth

	tbody
		tr(v-if='statuses.length == 0')
			td(colspan='2')
				.no Статусы не заданы.

		tr(v-for="(item, index) in statuses" :key="item.id")
			td
				span {{ item.label }}
			td.text-right
				q-btn(flat round icon="mdi-close" color="primary" @click='destroy(index)' size='sm') 

q-form(@submit='add')
	.row.items-center.q-gutter-x-sm
		q-input(ref='input' autofocus v-model="status" type="text" label='Статус' dense outlined bg-color="white")
		q-btn(flat color="primary" label="Добавить" type='submit') 

q-stepper-navigation
	q-btn(@click="nexxt" color="primary" label="Далее")
</template>

<style scoped lang="scss">
.q-list {
	margin-bottom: 1rem;
	max-width: 600px;
}

.q-input {
	width: 300px;
}

.no {
	color: $negative;
}

.q-markup-table {
	margin-top: 1rem;
	margin-bottom: 1rem;
}

.q-table thead tr {
	height: 28px;
}
</style>
