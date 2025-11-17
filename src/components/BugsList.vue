<script setup lang="ts">
import { useSave } from '@/stores/save'
import { useReducedMotion } from '@/composable/useReducedMotion'

const { userOverride } = useReducedMotion()

const animationOptions = [
	{ value: 'auto', label: 'Авто' },
	{ value: 'false', label: 'Вкл' },
	{ value: 'true', label: 'Откл' },
]

const store = useSave()
const emit = defineEmits(['close'])

// const list = [
// 	{ id: 0, icon: 'mdi-database-outline', label: 'Настройка баз данных', to: '' },
// 	{ id: 2, icon: 'mdi-source-branch', label: 'Управление версиями', to: '/version' },
// 	{ id: 1, icon: 'mdi-account-key', label: 'Права на публикацию', to: '' },
// 	{ id: 3, icon: 'mdi-script-text-outline', label: 'Журнал публикаций', to: '' },
// ]

const turn = () => {
	store.toggle()
	emit('close')
}
</script>

<template lang="pug">
q-list.q-mt-lg
	q-item(clickable to='/vars')
		q-item-section(avatar)
			q-icon(name="mdi-puzzle-outline" color="primary")
		q-item-section
			q-item-label Общие компоненты, палитра

	q-item(clickable to='/iconList')
		q-item-section(avatar)
			q-icon(name="mdi-image-outline" color="primary")
		q-item-section
			q-item-label Иконки

	q-item(clickable to='/timeline')
		q-item-section(avatar)
			q-icon(name="mdi-chart-gantt" color="primary")
		q-item-section
			q-item-label Ход исполнения

	q-item(clickable @click='turn')
		q-item-section(avatar)
			q-icon(name="mdi-account-circle" color="primary")
		q-item-section
			q-item-label Роза Львовна

	q-item.settings
		label Анимации: 
		q-select(v-model="userOverride" :options="animationOptions" dense emit-value map-options outlined)
</template>

<style scoped lang="scss">
.settings {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	:deep(.q-select) {
		width: 110px;
	}
	:deep(.q-field--dense .q-field__control, .q-field--dense .q-field__marginal) {
		height: 32px;
	}
	:deep(.q-field--auto-height.q-field--dense .q-field__native) {
		min-height: 32px;
	}
	:deep(
		.q-field--auto-height.q-field--dense .q-field__control,
		.q-field--auto-height.q-field--dense .q-field__native
	) {
		min-height: 32px;
	}

	:deep(.q-field--dense .q-field__marginal) {
		height: 32px;
	}
}
</style>
