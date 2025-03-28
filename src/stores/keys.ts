import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useKeys = defineStore('mykeys', () => {
	const keys = ref<MenuItem[][]>([])

	const isDragWindow = ref(false)
	const toggleDragWindow = () => {
		isDragWindow.value = !isDragWindow.value
	}

	const addItem = (e: MenuItem[]): void => {
		keys.value.push(e)
	}

	return {
		keys,
		isDragWindow,
		toggleDragWindow,
		addItem,
	}
})
