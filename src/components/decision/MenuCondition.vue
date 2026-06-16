<script setup lang="ts">
import SolutionRule from '@/components/decision/SolutionRule.vue'
import { ref } from 'vue'

const layouts = ref([
	{
		id: 1,
		label: 'По умолчанию',
		expanded: true,
		isActive: false,
		conditions: [
			{
				id: 2,
				mode: 'Любой',
				state: 'Любое',
				role: 'admin',
				device: 'Любое',
				layout: 'Меню админа',
			},
			{
				id: 3,
				mode: 'Любой',
				state: 'Любое',
				role: 'Пользователь',
				device: 'Мобильный',
				layout: 'Меню мобильное',
			},
			{
				id: 4,
				mode: 'Любой',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Меню по умолчанию',
			},
		],
	},
	{
		id: 5,
		label: 'КЭДО',
		isActive: false,
		conditions: [
			{
				id: 6,
				mode: 'Любой',
				state: 'Любое',
				role: 'admin',
				device: 'Любое',
				layout: 'Меню админа',
			},
			{
				id: 7,
				mode: 'Любой',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Меню КЭДО',
			},
		],
	},
	{
		id: 8,
		label: 'DVshowcase',
		isActive: false,
		conditions: [
			{
				id: 9,
				mode: 'Любой',
				state: 'Любое',
				role: 'admin',
				device: 'Любое',
				layout: 'Меню админа',
			},
			{
				id: 10,
				mode: 'Любой',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Меню по умолчанию',
			},
		],
	},
	{
		id: 11,
		label: 'test',
		isActive: false,
		conditions: [
			{
				id: 12,
				mode: 'Любой',
				state: 'Любое',
				role: 'Любая',
				device: 'Любое',
				layout: 'Меню по умолчанию',
			},
		],
	},
])

const remove = (id: number) => {
	layouts.value = layouts.value.filter((item: any) => item.id !== id)
}

const activateLayout = (activatedId: number, value: boolean) => {
	if (!value) return

	// Выключаем все остальные чекбоксы и сворачиваем их
	layouts.value.forEach((item) => {
		if (item.id !== activatedId) {
			item.isActive = false
			item.expanded = false
		}
	})

	// Находим активированный элемент и перемещаем его на первое место
	const index = layouts.value.findIndex((item) => item.id === activatedId)
	if (index > 0) {
		const [activated] = layouts.value.splice(index, 1)
		activated.expanded = true
		layouts.value.unshift(activated)
	} else {
		// Уже первый — просто раскрываем
		layouts.value[0].expanded = true
	}
}
</script>

<template lang="pug">

q-expansion-item.my-expansion(v-for="item in layouts" :key="item.id" switchToggleSide v-model="item.expanded")
	template(v-slot:header)
		q-item-section.text-bold.text-primary {{ item.label }}
		q-item-section условий: {{ item.conditions.length }}
		q-item-section
			q-checkbox(
				v-model='item.isActive',
				label='isActive',
				dense
				@update:modelValue="activateLayout(item.id, $event)"
			)
		q-item-section(side)
			q-btn(flat round icon="mdi-delete-outline" color="primary" @click.stop dense :disable='item.id == 8') 
				q-menu
					q-list
						q-item(clickable @click="remove(item.id)").pink
							q-item-section Удалить решение
	.inside
		SolutionRule(:condition='item.conditions')

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
