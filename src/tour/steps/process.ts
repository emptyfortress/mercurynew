import type { DriveStep } from 'driver.js'

const processSteps: DriveStep[] = [
	{
		element: '[data-tour="back-button"]',
		popover: {
			title: 'Назад',
			description: 'Вернуться на предыдущую страницу',
			side: 'right',
			align: 'start',
		},
	},
	{
		element: '[data-tour="home"]',
		popover: {
			title: 'Главная',
			description: 'Вернуться на главную страницу',
			side: 'right',
			align: 'start',
		},
	},
	{
		element: '[data-tour="toolbar-main"]',
		popover: {
			title: 'Боковое меню',
			description:
				'Разделы конструктора. Здесь происходит переключение между различными редакторами.',
			side: 'right',
		},
	},
	{
		element: '[data-tour="mini-button"]',
		popover: {
			title: 'Развернуть меню',
			description: 'Показать текст в кнопках бокового меню.',
			side: 'right',
			align: 'end',
		},
	},
	{
		element: '[data-tour="bpmn-diagram"]',
		popover: {
			title: 'BPMN',
			description: 'Диаграмма вашего процесса',
			side: 'bottom',
			align: 'center',
		},
	},
	{
		element: '[data-tour="role-ini"]',
		popover: {
			title: 'Дорожка роли',
			description: 'Дорожка роли инициатора',
			side: 'bottom',
			align: 'start',
		},
	},
	{
		element: '[data-tour="bpmn-etap"]',
		popover: {
			title: 'Этап процесса',
			description: 'Один из этапов процесса',
			side: 'top',
			align: 'start',
		},
	},
	{
		element: '[data-tour="bpmn-roles"]',
		popover: {
			title: 'Роли-наблюдатели',
			description: 'Роли, которые не участвуют в процессе',
			side: 'top',
			align: 'start',
		},
	},
	{
		element: '[data-tour="footer-main"]',
		popover: {
			title: 'Редактируемая версия',
			description: 'Иформация о версии',
			side: 'top',
			align: 'start',
		},
	},
	{
		element: '[data-tour="footer-save"]',
		popover: {
			title: 'Изменения',
			description: 'Сохранение изменений',
			side: 'top',
			align: 'end',
		},
	},
]

export default processSteps
