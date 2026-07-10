<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSimpleStore } from '@/stores/simpleStore'

const route = useRoute()
const router = useRouter()
const store = useSimpleStore()

const getRouteTab = () => {
	const value = route.query.tab
	return Array.isArray(value) ? value[0] : value
}

const activeTab = computed({
	get: () => getRouteTab() || 'setup',
	set: (val: string) => {
		router.replace({
			query: {
				...route.query,
				tab: val,
			},
		})
	},
})

const projects = ref([
	{
		name: 'Документооборот',
		expanded: true,
		views: [
			{
				id: 'view-001',
				name: 'Общий список',
				type: 'просмотр',
				author: 'Иван Петров',
				createdAt: '2026-03-15',
				isUsed: true,
			},
			{
				id: 'view-002',
				name: 'Просроченные документы',
				type: 'редактирование',
				author: 'Анна Смирнова',
				createdAt: '2026-04-02',
				isUsed: true,
			},
			{
				id: 'view-003',
				name: 'Статистика',
				type: 'создание',
				author: 'Иван Петров',
				createdAt: '2026-05-11',
				isUsed: false,
			},
		],
	},
	{
		name: 'Закупки',
		expanded: false,
		views: [
			{
				id: 'view-004',
				name: 'Активные тендеры',
				type: 'просмотр',
				author: 'Олег Кузнецов',
				createdAt: '2026-02-20',
				isUsed: true,
			},
			{
				id: 'view-005',
				name: 'Аналитика закупок',
				type: 'создание',
				author: 'Елена Волкова',
				createdAt: '2026-04-18',
				isUsed: false,
			},
		],
	},
	{
		name: 'Кадры',
		expanded: true,
		views: [
			{
				id: 'view-006',
				name: 'Сотрудники',
				type: 'редактирование',
				author: 'Мария Иванова',
				createdAt: '2026-01-12',
				isUsed: true,
			},
			{
				id: 'view-007',
				name: 'Структура компании',
				type: 'просмотр',
				author: 'Мария Иванова',
				createdAt: '2026-02-01',
				isUsed: true,
			},
			{
				id: 'view-008',
				name: 'Отпуска',
				type: 'создание',
				author: 'Дмитрий Орлов',
				createdAt: '2026-05-30',
				isUsed: false,
			},
		],
	},
	{
		name: 'Продажи',
		expanded: false,
		views: [
			{
				id: 'view-009',
				name: 'Сделки',
				type: 'редактирование',
				author: 'Алексей Морозов',
				createdAt: '2026-03-05',
				isUsed: true,
			},
			{
				id: 'view-010',
				name: 'Воронка продаж',
				type: 'просмотр',
				author: 'Ольга Белова',
				createdAt: '2026-03-27',
				isUsed: true,
			},
		],
	},
	{
		name: 'Поддержка',
		expanded: true,
		views: [
			{
				id: 'view-011',
				name: 'Все обращения',
				type: 'просмотр',
				author: 'Сергей Павлов',
				createdAt: '2026-01-25',
				isUsed: true,
			},
			{
				id: 'view-012',
				name: 'Очередь поддержки',
				type: 'редактирование',
				author: 'Сергей Павлов',
				createdAt: '2026-04-10',
				isUsed: true,
			},
			{
				id: 'view-013',
				name: 'Отчеты SLA',
				type: 'создание',
				author: 'Наталья Соколова',
				createdAt: '2026-06-01',
				isUsed: false,
			},
		],
	},
])

const active = ref('Документооборот')
</script>

<template lang="pug">
div
	.zg
		|Разметки для вида
		span {{ store.selectedElement?.text }}
	q-tabs(v-model="activeTab" align="left" activeColor="primary" indicatorColor="primary")
		q-tab(name="setup" label="Разметки")
		q-tab(name="condition" label="Условия выбора разметок")

	q-tab-panels(v-model="activeTab" animated)
		q-tab-panel(name="setup")
			q-list
				q-expansion-item.my-expansion(v-for="item in projects" :key="item.name" v-model="item.expanded" switchToggleSide)
					template(v-slot:header)
						q-item-section
							.project
								|Проект:
								span {{ item.name}}
						q-item-section
							.project
								|Разметок:
								span {{ item.views.length}}
						q-item-section
							q-radio(v-model="active" :val="item.name" label="Активный проект")
</template>

<style scoped lang="scss">
.project {
	span {
		font-weight: 600;
		margin-left: 0.5rem;
	}
}
.zg {
	font-size: 1.2rem;
	span {
		margin-left: 1rem;
		font-weight: 600;
	}
}
.q-tab-panels {
	background: transparent;
	border-top: 1px solid #999;
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
</style>
