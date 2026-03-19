<script setup lang="ts">
import { ref } from 'vue'
import Chips from '@/components/decision/Chips.vue'

const tab = ref<'role' | 'state' | 'operation'>('role')

const isDirty = ref(true)

const roles = [
	{ id: 'admin', label: 'Администратор' },
	{ id: 'manager', label: 'Менеджер' },
	{ id: 'executor', label: 'Исполнитель' },
	{ id: 'observer', label: 'Наблюдатель' },
	{ id: 'auditor', label: 'Аудитор' },
	{ id: 'developer', label: 'Разработчик' },
	{ id: 'analyst', label: 'Аналитик' },
	{ id: 'guest', label: 'Гость' },
]
</script>

<template lang="pug">
q-page(padding)
	.container
		.row.justify-between
			.text-h6 Матрица доступа
			.q-gutter-x-sm(v-if='isDirty')
				q-btn(flat round icon="mdi-lock" color="primary") 
					q-tooltip Блокировка активна
				q-btn(@click="" flat color="primary" label="Отмена")
				q-btn(@click="" color="primary" label="Сохранить")
		
		q-tabs(v-model='tab' class='q-mt-md' align='left')
			q-tab(name='role' label='Роль')
			q-tab(name='state' label='Состояние')
			q-tab(name='operation' label='Операция')
		
		q-tab-panels(v-model='tab' animated)
			q-tab-panel(name='role')
				Chips(chip='roles')

			q-tab-panel(name='state')
				.text-body2 Контент вкладки Состояние

			q-tab-panel(name='operation')
				.text-body2 Контент вкладки Операция
</template>

<style scoped lang="scss">
.container {
	// max-width: 1200px;
	margin: 0 2rem;
}
</style>
