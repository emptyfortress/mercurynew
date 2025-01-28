<script setup lang="ts">
import { ref } from 'vue'
import { uid } from 'quasar'


const rolename = ref('')

const roles = ref<any[]>([])
const input = ref()
const add = () => {
	if (rolename.value.length > 0) {
		roles.value.push({
			id: uid(),
			name: rolename.value,
			trash: true,
		})
		rolename.value = ''
		input.value.focus()
	}
}
const destroy = (e: number) => {
	roles.value.splice(e, 1)
}
</script>

<template lang="pug">
q-form(@submit='add')
	br
	q-markup-table(flat bordered)
		thead
			tr
				th.text-left Наблюдатели <span class="q-ml-lg">(все кто может видеть приложение)</span>
				th

		tbody
			tr(v-if='roles.length == 0')
				td(colspan='2')
					.no Наблюдатели не заданы

			tr(v-else v-for="(role, index) in roles" :key="role.id")
				td {{ role.name }}
				td.text-right
					q-btn(v-if='role.trash' flat round icon="mdi-close" color="primary" @click='destroy(index)' size='sm') 

	.row.items-center.q-mt-md
		q-input(ref='input' v-model="rolename" autofocus label='Наблюдатель' dense outlined bg-color="white")
		q-btn(flat color="primary" label="Добавить" type='submit') 
</template>

<style scoped lang="scss">
.q-input {
	width: 300px;
	margin-bottom: 3px;
}

.no {
	color: $negative;
}

.q-table thead tr {
	height: 28px;
}
</style>
