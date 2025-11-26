import type { DriveStep } from 'driver.js'

const dashboardSteps: DriveStep[] = [
	{
		element: '[data-tour="dash-header"]',
		popover: {
			title: 'Дэшборд',
			description: 'Основной заголовок дэшборда.',
			side: 'bottom',
		},
	},
	{
		element: '[data-tour="dash-chart"]',
		popover: {
			title: 'Графики',
			description: 'Здесь отображаются ключевые показатели.',
			side: 'left',
		},
	},
]

export default dashboardSteps
