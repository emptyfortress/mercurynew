<script setup lang="ts">
import { ref } from 'vue'

const columns = [
	{ name: 'user', label: 'Пользователь или группа', field: 'user', align: 'left' },
	{ name: 'full', label: 'Полный доступ', field: 'full', align: 'left' },
	{ name: 'read', label: 'Чтение', field: 'read', align: 'left' },
	{ name: 'change', label: 'Изменение', field: 'change', align: 'left' },
	{ name: 'remove', label: 'Удаление', field: 'remove', align: 'left' },
	{ name: 'own', label: 'Владение', field: 'own', align: 'left' },
	{ name: 'special', label: 'Особые', field: 'special', align: 'left' },
]

const rows = [
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
]
</script>

<template lang="pug">
q-table(:rows="rows" :columns="columns" row-key="name" flat)
</template>

<style scoped lang="scss"></style>
