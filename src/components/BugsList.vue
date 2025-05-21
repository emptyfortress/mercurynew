<script setup lang="ts">
const list = [
	{ id: 0, icon: 'mdi-database-outline', label: 'Настройка баз данных', to: '' },
	{ id: 2, icon: 'mdi-source-branch', label: 'Управление версиями', to: '' },
	{ id: 1, icon: 'mdi-account-key', label: 'Права на публикацию', to: '' },
	{ id: 3, icon: 'mdi-script-text-outline', label: 'Журнал публикаций', to: '' },
]
</script>

<template lang="pug">
q-list.q-mt-lg
	q-item(clickable, v-for="item in list", :key='item.id')
		q-item-section(avatar)
			q-icon(:name="item.icon" color="primary")
		q-item-section
			q-item-label {{ item.label }}

	// q-item(clickable to='/bugs')
	// 	q-item-section(avatar)
	// 		q-icon(name="mdi-bug" color="primary")
	// 	q-item-section
	// 		q-item-label Баги
	// q-item(clickable to='/vars')
	// 	q-item-section(avatar)
	// 		q-icon(name="mdi-puzzle-outline" color="primary")
	// 	q-item-section
	// 		q-item-label Общие компоненты

</template>

<style scoped lang="scss"></style>
