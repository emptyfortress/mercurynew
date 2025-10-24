<script setup lang="ts">
import { useSave } from '@/stores/save'

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
</template>

<style scoped lang="scss"></style>
