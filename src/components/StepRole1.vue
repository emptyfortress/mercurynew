<script setup lang="ts">
import { ref } from 'vue'
import { uid } from 'quasar'
import StepRole2 from '@/components/StepRole2.vue'

const rolename = ref('')
const input1 = ref()

interface Myrole {
	id: string
	name: string
	trash: boolean
}

const add = () => {
	if (rolename.value.length > 0) {
		roles.value.push({
			id: uid(),
			name: rolename.value,
			trash: true
		})
		rolename.value = ''
		input1.value.focus()
	}
}
const destroy = (e: number) => {
	roles.value.splice(e, 1)
}

const emit = defineEmits(['next'])

const nexxt = () => {
	add()
	emit('next')
}
const roles = ref<Myrole[]>([])
</script>

<template lang="pug">
.twocol
	q-form(@submit='add')
		br
		q-markup-table(flat bordered)
			thead
				tr
					th.text-left Участники <span class="q-ml-lg">(принимают участие в процессе)</span>
					th

			tbody
				tr(v-if='roles.length == 0')
					td(colspan='2')
						.no Участники не заданы

				tr(v-else v-for="(role, index) in roles" :key="role.id")
					td {{ role.name }}
					td.text-right
						q-btn(v-if='role.trash' flat round icon="mdi-close" color="primary" @click='destroy(index)' size='sm') 

		.row.items-center.q-mt-md
			q-input(ref='input1' v-model="rolename" autofocus label='Участник процесса' dense outlined bg-color="white")
			q-btn(flat color="primary" label="Добавить" type='submit') 

	div
		StepRole2()

q-stepper-navigation
	q-btn(@click="nexxt" color="primary" label="Далее")
</template>

<style scoped lang="scss">
.twocol {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	justify-items: start;
	column-gap: 1rem;
	row-gap: 0.5rem;
}

.q-input {
	width: 300px;
	margin-bottom: 3px;
}

.q-table thead tr {
	height: 28px;
}

.hd {
	font-weight: 600;
	text-align: center;
}

.no {
	color: $negative;
}
</style>
