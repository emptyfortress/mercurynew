import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewStore = defineStore('view', () => {
	const viewOpen = ref(false)

	function toggleView() {
		viewOpen.value = !viewOpen.value
	}

	return { viewOpen, toggleView }
})
