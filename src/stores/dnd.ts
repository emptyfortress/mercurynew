import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ExternalParamPayload {
	id: string
	text: string
}

export const useDndStore = defineStore('dnd', () => {
	const externalDragPayload = ref<any>(null)

	function setExternalDragPayload(payload: any) {
		externalDragPayload.value = payload
	}

	function clearExternalDragPayload() {
		externalDragPayload.value = null
	}

	return { externalDragPayload, setExternalDragPayload, clearExternalDragPayload }
})
