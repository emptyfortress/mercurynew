import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePanels = defineStore('panels', () => {
	const diag = ref(false)
	const setDiag = (state: boolean) => {
		diag.value = state
	}

	const right = ref(false)
	const left = ref(false)

	const setLeft = (state: boolean) => {
		left.value = state
	}
	const setRight = (state: boolean) => {
		right.value = state
	}
	return {
		diag,
		left,
		right,
		setLeft,
		setRight,
		setDiag,
	}
})
