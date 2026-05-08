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
		user: 'Everyone',
		full: undefined,
		read: undefined,
		change: undefined,
		remove: undefined,
		own: undefined,
		special: undefined,
	},
	{
		user: 'Power user',
		full: undefined,
		read: undefined,
		change: undefined,
		remove: undefined,
		own: undefined,
		special: undefined,
	},
])

function getCheckboxColor(value: boolean): string {
	if (value === true) return 'teal'
	if (value === false) return 'pink'
	return 'grey-6'
}
</script>

<template lang="pug">
q-table(:rows="rows" :columns="columns" row-key="user" flat)
	template(v-slot:body-cell="props")
		q-td(:props="props")
			template(v-if="props.col.name === 'user'")
				| {{ props.value }}
			template(v-else)
				q-checkbox(
					dense,
					checked-icon='mdi-check-bold'
					unchecked-icon='mdi-close-thick'
					indeterminate-icon='mdi-checkbox-blank-outline'
					toggle-indeterminate
					v-model="props.row[props.col.field]"
					:color='getCheckboxColor(props.row[props.col.field])'
				)
	template(v-slot:bottom)
		.text-center.text-grey Dummy text in bottom slot
</template>

<style scoped lang="scss">
:deep(.q-checkbox__inner--falsy .q-icon) {
	color: var(--q-negative);
}
</style>
