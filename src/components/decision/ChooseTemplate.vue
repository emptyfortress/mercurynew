<script setup lang="ts">
import { ref } from 'vue'

const only = ref(false)

const list = ref([
	{
		id: 'r1',
		label: 'Отчет Задания за период',
		mod: false,
	},
	{
		id: 'r2',
		label: 'Отчет Документы на согласовании',
		mod: false,
	},
	{
		id: 'r3',
		label: 'Отчет Задания к исполнению',
		mod: false,
	},
	{
		id: 'r4',
		label: 'Отчет Документ на подписании',
		mod: false,
	},
])
</script>

<template lang="pug">
q-checkbox(v-model="only" dense label='В папке будут доступны только выбранные шаблоны')
q-separator(spaced)
q-list
	q-item(v-for="item in list" :key='item.id' clickable)
		q-item-section(side)
			q-checkbox(v-model='item.mod' dense)
		q-item-section {{ item.label }}
</template>

<style scoped lang="scss"></style>
