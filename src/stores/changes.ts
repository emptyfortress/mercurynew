import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChangesStore = defineStore('changes', () => {
	const hasChanges = ref(false)
	const countChanges = ref(0)

	function setHasChanges(value: boolean) {
		hasChanges.value = value
		countChanges.value += 1
	}

	return { hasChanges, countChanges, setHasChanges }
})
