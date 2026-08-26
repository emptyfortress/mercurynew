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

	const externalDragPayload = ref<any>(null)

	function setExternalDragPayload(payload: any) {
		externalDragPayload.value = payload
	}

	function clearExternalDragPayload() {
		externalDragPayload.value = null
	}

	return {
		partitions,
		selectedIds,
		externalDragPayload,
		setExternalDragPayload,
		clearExternalDragPayload,
	}
})
