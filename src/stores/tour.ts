import { defineStore } from 'pinia'
import { ref } from 'vue'

// Тип одного шага согласно vue-stage-play
export interface TourStep {
	target: string
	content: string
	placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
	padding?: number
	skipIfNotFound?: boolean
	highlight?: boolean
}

export const useTourStore = defineStore('tour', () => {
	// --------------------------
	// STATE
	// --------------------------
	const steps = ref<TourStep[]>([])

	// --------------------------
	// ACTIONS
	// --------------------------
	function addSteps(newSteps: TourStep[]) {
		steps.value.push(...newSteps)
	}

	function clearSteps() {
		steps.value = []
	}

	return {
		steps,
		addSteps,
		clearSteps,
	}
})
