<script setup lang="ts">
import { ref } from 'vue'
import SolutionRule from '@/components/decision/SolutionRule.vue'

const layouts = ref([
	{
		id: 0,
		label: 'Управление делами',
		expanded: true,
		conditions: [
			{
				mode: 'Создание',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Исходящий УД (создание)',
			},
			{
				mode: 'Редактирование',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Исходящий УД (создание)',
			},
			{
				mode: 'Просмотр',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Исходящий УД (создание)',
			},
		],
	},
	{
		id: 1,
		label: 'Договоры',
		conditions: [
			{
				mode: 'Создание',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Договоры (создание)',
			},
			{
				mode: 'Редактирование',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Договоры (создание)',
			},
			{
				mode: 'Просмотр',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Договоры (создание)',
			},
		],
	},
	{
		id: 2,
		label: 'Стандартное',
		conditions: [
			{
				mode: 'Создание',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Стандарт (создание)',
			},
			{
				mode: 'Редактирование',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Стандарт (создание)',
			},
			{
				mode: 'Просмотр',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Стандарт (создание)',
			},
		],
	},
])

const remove = (id: number) => {
	layouts.value = layouts.value.filter((item: any) => item.id !== id)
}
const createDialog = ref(false)

const createApp = () => {
	if (appName.value.trim()) {
		let tmp = {
			id: Date.now(),
			label: appName.value.trim(),
			conditions: [],
		}
		layouts.value.push(tmp)
		createDialog.value = false
	}
}

const appName = ref('')
const sel = ref('')
// const fuck = ref([true, false, false])
</script>

<template lang="pug">
q-btn.q-mb-md(flat color="primary" label="Добавить решение" icon="mdi-plus-circle" @click="createDialog = !createDialog") 
q-expansion-item.my-expansion(v-for="item in layouts" :key="item.id" switchToggleSide v-model="item.expanded")
	template(v-slot:header)
		q-item-section {{ item.label }}
		q-item-section
		q-item-section правил: {{ item.conditions.length }}
		q-item-section(side)
			q-btn(flat round icon="mdi-delete-outline" color="primary" @click.stop dense) 
				q-menu
					q-list
						q-item(clickable @click="remove(item.id)").pink
							q-item-section Удалить
	.inside
		SolutionRule(:condition='item.conditions')
		q-btn(flat icon="mdi-plus-circle" color="primary" label="Добавить условие" @click="") 


q-dialog(v-model="createDialog" persistent backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 350px")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Добавить решение
			q-input.q-mt-md(
				v-model="appName"
				label="Название"
				dense
				outlined
				autofocus
				@keyup.enter="createApp"
			)
			q-select.q-mt-md(v-model="sel" outlined dense label="Решение" :options="['решение1', 'решение2','решение3']")
		q-card-actions(align="right")
			q-btn(flat label="Отмена" v-close-popup)
			q-btn(unelevated color="primary" label="Создать" @click="createApp")
</template>

<style scoped lang="scss">
.text-h6 span {
	font-size: 1rem;
	margin-left: 1rem;
}
.q-expansion-item {
	background: var(--bgLight);
	border-radius: 0.25rem;
	margin-bottom: 0.5rem;
	cursor: pointer;
}

.my-expansion :deep(.q-expansion-item__container > .q-item .q-focus-helper) {
	display: none;
}
.my-expansion :deep(.q-expansion-item__container > .q-item:hover) {
	border-radius: 0.25rem;
	box-shadow: var(--shad0);
}
.q-expansion-item--expanded {
	background: #fff;
}

.inside {
	padding: 1rem;
}
</style>
