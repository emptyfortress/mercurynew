<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const roles = reactive([
	{ selected: false, id: 'admin', label: 'Администратор' },
	{ selected: false, id: 'manager', label: 'Автор' },
	{ selected: false, id: 'executor', label: 'Исполнитель' },
	{ selected: false, id: 'observer', label: 'Наблюдатель' },
	{ selected: false, id: 'auditor', label: 'Аудитор' },
	{ selected: false, id: 'developer', label: 'Разработчик' },
	{ selected: false, id: 'analyst', label: 'Аналитик' },
	{ selected: false, id: 'guest', label: 'Гость' },
])
</script>

<template lang="pug">
.chips-container
	q-chip(
		v-for='chip in roles'
		:key='chip.id'
		v-model:selected='chip.selected'
	) {{ chip.label }}
</template>

<style scoped lang="scss">
.chips-container {
	display: flex;
	flex-wrap: wrap;
}
:deep(.q-chip--selected) {
	background: $primary;
	color: white;
	i {
		color: white;
	}
}
</style>
