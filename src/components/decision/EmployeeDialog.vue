<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
	select: [value: string]
	'select-item': [value: { id: string; label: string }]
}>()

const modelValue = defineModel<boolean>()
const search = ref<string | null>('')

const employees = [
	{ id: '1', label: 'Иванов И. И.' },
	{ id: '2', label: 'Петрова А. С.' },
	{ id: '3', label: 'Сидоров Д. А.' },
	{ id: '4', label: 'Кузнецова М. В.' },
	{ id: '5', label: 'Смирнов А. Н.' },
]

const filteredEmployees = computed(() => {
	const query = (search.value ?? '').trim().toLocaleLowerCase('ru')
	return employees.filter((employee) => employee.label.toLocaleLowerCase('ru').includes(query))
})

function selectEmployee(emp: { id: string; label: string }) {
	emit('select', emp.label)
	emit('select-item', { ...emp })
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)" @before-show="search = ''")
	q-card.employee-dialog
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Выбор сотрудника
		q-card-section
			q-input(v-model='search' outlined dense placeholder='Поиск...' clearable)
		q-card-section
			q-list(dense bordered separator)
				q-item.employee-item(
					v-for='emp in filteredEmployees'
					:key='emp.id'
					clickable
					@click='selectEmployee(emp)'
				)
					q-item-section {{ emp.label }}
				q-item(v-if="!filteredEmployees.length")
					q-item-section.text-grey-7 Сотрудники не найдены
		q-card-actions(align='right')
			q-btn(flat label='Отмена' v-close-popup color='grey-7')
</template>

<style scoped lang="scss">
.employee-dialog {
	width: 440px;
	max-width: calc(100vw - 32px);
}
.employee-item:hover {
	background: $primary;
	color: white;
}
</style>
