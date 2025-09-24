<script setup lang="ts">
const list = [
	{ id: 0, icon: 'mdi-database-outline', label: 'Настройка баз данных', to: '' },
	{ id: 2, icon: 'mdi-source-branch', label: 'Управление версиями', to: '/version' },
	{ id: 1, icon: 'mdi-account-key', label: 'Права на публикацию', to: '' },
	{ id: 3, icon: 'mdi-script-text-outline', label: 'Журнал публикаций', to: '' },
]
</script>

<template lang="pug">
q-list.q-mt-lg
	// q-item(clickable to='/bugs')
	// 	q-item-section(avatar)
	// 		q-icon(name="mdi-bug" color="primary")
	// 	q-item-section
	// 		q-item-label Баги
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
			q-item-label timeline-bpmn

	q-item(clickable to='/timeline1')
		q-item-section(avatar)
			q-icon(name="mdi-chart-gantt" color="primary")
		q-item-section
			q-item-label timeline-bpmn 1

	q-item(clickable to='/timeline0')
		q-item-section(avatar)
			q-icon(name="mdi-chart-gantt" color="primary")
		q-item-section
			q-item-label timeline-bpmn 0

	// br
	// q-separator
	// br
	// q-item(clickable, v-for="item in list", :key='item.id' :to='item.to')
	// 	q-item-section(avatar)
	// 		q-icon(:name="item.icon" color="primary")
	// 	q-item-section
	// 		q-item-label {{ item.label }}


</template>

<style scoped lang="scss"></style>
