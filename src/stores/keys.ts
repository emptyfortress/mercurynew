import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useKeys = defineStore('mykeys', () => {
	const keys = ref<MenuItem[][]>([])

	const isDragWindow = ref(false)
	const toggleDragWindow = () => {
		isDragWindow.value = !isDragWindow.value
	}

	const hasParameters = computed(() => {
		return keys.value.filter((group) => group.some((item) => item.isPar === true))
	})

	const addItem = (e: MenuItem[]): void => {
		keys.value.push(e)
	}

	return {
		keys,
		isDragWindow,
		hasParameters,
		toggleDragWindow,
		addItem,
	}
})
