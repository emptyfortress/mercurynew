import type { DriveStep } from 'driver.js'

const homeSteps: DriveStep[] = [
	{
		element: '[data-tour="home-title"]',
		popover: {
			title: 'Главный заголовок',
			description: 'Это заголовок главной страницы.',
			side: 'top',
			align: 'center',
		},
	},
	{
		element: '[data-tour="home-stats"]',
		popover: {
			title: 'Статистика',
			description: 'Блок со статистикой.',
			side: 'right',
		},
	},
	{
		element: '[data-tour="dash-title"]',
		popover: {
			title: 'Дэшборд',
			description: 'Основной заголовок дэшборда.',
			side: 'bottom',
		},
	},
	{
		element: '[data-tour="dash-stats"]',
		popover: {
			title: 'Графики',
			description: 'Здесь отображаются ключевые показатели.',
			side: 'left',
		},
	},
]

export default homeSteps
