import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFlip = defineStore('flip', () => {

	const lastState = ref<any>()

	const setLastState = ((e: any) => {
		lastState.value = e
	})

	return {
		lastState,
		setLastState
	}
})
