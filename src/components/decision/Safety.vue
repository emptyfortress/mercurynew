<script setup lang="ts">
import { ref } from 'vue'

const columns = [
	{ name: 'name', label: 'Name', field: 'name', align: 'left' },
	{ name: 'age', label: 'Age', field: 'age', align: 'left' },
	{ name: 'email', label: 'Email', field: 'email', align: 'left' },
	{ name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
	{ name: 'city', label: 'City', field: 'city', align: 'left' },
	{ name: 'status', label: 'Status', field: 'status', align: 'left' },
	{ name: 'role', label: 'Role', field: 'role', align: 'left' },
]

const rows = [
	{
		name: 'John Doe',
		age: 28,
		email: 'john@example.com',
		phone: '555-1234',
		city: 'New York',
		status: 'Active',
		role: 'Admin',
	},
	{
		name: 'Jane Smith',
		age: 34,
		email: 'jane@example.com',
		phone: '555-5678',
		city: 'Los Angeles',
		status: 'Inactive',
		role: 'User',
	},
]
</script>

<template lang="pug">
q-table(:rows="rows" :columns="columns" row-key="name")
</template>

<style scoped lang="scss"></style>
