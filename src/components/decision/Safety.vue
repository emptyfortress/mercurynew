<script setup lang="ts">
import { ref } from 'vue'

const columns = [
	{ name: 'user', label: 'Пользователь или группа', field: 'user', align: 'left' },
	{ name: 'full', label: 'Полный доступ', field: 'full', align: 'center' },
	{ name: 'read', label: 'Чтение', field: 'read', align: 'center' },
	{ name: 'change', label: 'Изменение', field: 'change', align: 'center' },
	{ name: 'remove', label: 'Удаление', field: 'remove', align: 'center' },
	{ name: 'own', label: 'Владение', field: 'own', align: 'center' },
	{ name: 'special', label: 'Особые', field: 'special', align: 'center' },
]

const rows = ref([
	{
		user: 'John Doe',
		full: false,
		read: false,
		change: false,
		remove: false,
		own: false,
		special: false,
	},
	{
		user: 'Jane Smith',
		full: false,
		read: false,
		change: false,
		remove: false,
		own: false,
		special: false,
	},
])
</script>

<template lang="pug">
q-table(:rows="rows" :columns="columns" row-key="user" flat)
	template(v-slot:body-cell="props")
		q-td(:props="props")
			template(v-if="props.col.name === 'user'")
				| {{ props.value }}
			template(v-else)
				q-checkbox(dense v-model="props.row[props.col.field]")
</template>

<style scoped lang="scss"></style>
