import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Part {
	id: string
	label: string
	parentId: string
	main: boolean
}

export const usePartitionStore = defineStore('part', () => {
	const partitions = ref<Part[]>([])

	const selectedIds = ref<Set<string>>(new Set())

	return {
		partitions,
		selectedIds,
	}
})
