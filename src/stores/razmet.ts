import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRazmetStore = defineStore('razmet', () => {
	const projects = ref([
		{
			name: 'Документооборот',
			expanded: true,
			pagination: 1,
			rowsPerPage: 5,
			views: [
				{
					id: 'view-001',
					name: 'Общий список',
					type: 'Просмотр',
					author: 'Иван Петров',
					createdAt: '2026-03-15',
					isUsed: true,
				},
				{
					id: 'view-002',
					name: 'Просроченные документы',
					type: 'Редактирование',
					author: 'Анна Смирнова',
					createdAt: '2026-04-02',
					isUsed: true,
				},
				{
					id: 'view-003',
					name: 'Статистика',
					type: 'Создание',
					author: 'Иван Петров',
					createdAt: '2026-05-11',
					isUsed: false,
				},
			],
		},
		{
			name: 'Закупки',
			expanded: false,
			pagination: 1,
			rowsPerPage: 5,
			views: [
				{
					id: 'view-004',
					name: 'Активные тендеры',
					type: 'Просмотр',
					author: 'Олег Кузнецов',
					createdAt: '2026-02-20',
					isUsed: true,
				},
				{
					id: 'view-005',
					name: 'Аналитика закупок',
					type: 'Создание',
					author: 'Елена Волкова',
					createdAt: '2026-04-18',
					isUsed: false,
				},
			],
		},
		{
			name: 'Кадры',
			expanded: false,
			pagination: 1,
			rowsPerPage: 5,
			views: [
				{
					id: 'view-006',
					name: 'Сотрудники',
					type: 'Редактирование',
					author: 'Мария Иванова',
					createdAt: '2026-01-12',
					isUsed: true,
				},
				{
					id: 'view-007',
					name: 'Структура компании',
					type: 'Просмотр',
					author: 'Мария Иванова',
					createdAt: '2026-02-01',
					isUsed: true,
				},
				{
					id: 'view-008',
					name: 'Отпуска',
					type: 'Создание',
					author: 'Дмитрий Орлов',
					createdAt: '2026-05-30',
					isUsed: false,
				},
			],
		},
		{
			name: 'Продажи',
			expanded: false,
			pagination: 1,
			rowsPerPage: 5,
			views: [
				{
					id: 'view-009',
					name: 'Сделки',
					type: 'Редактирование',
					author: 'Алексей Морозов',
					createdAt: '2026-03-05',
					isUsed: true,
				},
				{
					id: 'view-010',
					name: 'Воронка продаж',
					type: 'Просмотр',
					author: 'Ольга Белова',
					createdAt: '2026-03-27',
					isUsed: true,
				},
			],
		},
		{
			name: 'Поддержка',
			expanded: false,
			pagination: 1,
			rowsPerPage: 5,
			views: [
				{
					id: 'view-011',
					name: 'Все обращения',
					type: 'Просмотр',
					author: 'Сергей Павлов',
					createdAt: '2026-01-25',
					isUsed: true,
				},
				{
					id: 'view-012',
					name: 'Очередь поддержки',
					type: 'Редактирование',
					author: 'Сергей Павлов',
					createdAt: '2026-04-10',
					isUsed: true,
				},
				{
					id: 'view-013',
					name: 'Отчеты SLA',
					type: 'Создание',
					author: 'Наталья Соколова',
					createdAt: '2026-06-01',
					isUsed: false,
				},
			],
		},
	])

	return { projects }
})
