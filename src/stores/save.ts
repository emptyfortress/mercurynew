import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSave = defineStore('save', () => {
	const notsave = ref<boolean>(false)

	const toggle = () => {
		notsave.value = !notsave.value
	}

	return {
		notsave,
		toggle,
	}
})
