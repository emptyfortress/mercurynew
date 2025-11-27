import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import type { DriveStep } from 'driver.js'

// import homeSteps from '@/tour/steps/home'
import processSteps from '@/tour/steps/process'

const stepsMap: Record<string, DriveStep[]> = {
	// '/dashboard': dashoardSteps,
	// '/settings': settingsSteps,
	'/process': processSteps,
}

let instance: ReturnType<typeof driver> | null = null

export function useAppTour() {
	if (!instance) {
		instance = driver({
			showButtons: ['next', 'previous', 'close'], // какие кнопки показывать
			animate: true,
			overlayOpacity: 0.5,
			smoothScroll: true,
			popoverClass: 'driverjs-theme',
			showProgress: true,
			progressText: '{{current}} из {{total}}',
			nextBtnText: 'Дальше →',
			prevBtnText: '← Назад',
			doneBtnText: 'Завершить',
		})
	}

	const startTour = (route: RouteLocationNormalizedLoaded) => {
		const steps = stepsMap[route.path]

		if (!steps) {
			console.warn(`No tour steps for route: ${route.path}`)
			return
		}

		instance!.setSteps(steps)
		instance!.drive()
	}

	return { startTour }
}
