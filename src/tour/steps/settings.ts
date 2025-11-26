import type { DriveStep } from 'driver.js'

const settingsSteps: DriveStep[] = [
	{
		element: '[data-tour="settings-form"]',
		popover: {
			title: 'Настройки',
			description: 'Здесь вы можете изменить параметры приложения.',
			side: 'right',
		},
	},
	{
		element: '[data-tour="settings-save"]',
		popover: {
			title: 'Сохранение',
			description: 'Нажмите, чтобы применить новые настройки.',
			side: 'bottom',
		},
	},
]

export default settingsSteps
