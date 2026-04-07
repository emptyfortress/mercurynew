<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
	select: [value: string]
}>()

const modelValue = defineModel<boolean>()
const search = ref('')

const employees = [
	{ id: '1', label: 'Иванов И. И.' },
	{ id: '2', label: 'Петрова А. С.' },
	{ id: '3', label: 'Сидоров Д. А.' },
	{ id: '4', label: 'Кузнецова М. В.' },
	{ id: '5', label: 'Смирнов А. Н.' },
]

function selectEmployee(emp: { id: string; label: string }) {
	emit('select', emp.label)
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card.employee-dialog
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Выбор сотрудника
		q-card-section
			q-input(v-model='search' outlined dense placeholder='Поиск...' clearable)
		q-card-section
			q-list(dense bordered separator)
				q-item.employee-item(
					v-for='emp in employees'
					:key='emp.id'
					clickable
					@click='selectEmployee(emp)'
				)
					q-item-section {{ emp.label }}
		q-card-actions(align='right')
			q-btn(flat label='Отмена' v-close-popup color='grey-7')
</template>

<style scoped lang="scss">
.employee-dialog {
	min-width: 400px;
}
.employee-item:hover {
	background: $primary;
	color: white;
}
</style>
