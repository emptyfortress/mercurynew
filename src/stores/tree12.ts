import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTree = defineStore('tree12', () => {
	const layout = ref<any[]>([])

	const isDragWindow = ref(false)
	const toggleDragWindow = () => {
		isDragWindow.value = !isDragWindow.value
	}

	const addItem = (e: any): void => {
		layout.value.push(e)
	}

	return {
		layout,
		isDragWindow,
		toggleDragWindow,
		addItem,
	}
})
