import { ref } from 'vue'
import { defineStore } from 'pinia'

export type BpmnSelection = {
	type: 'bpmn'
	id: string
	element: any // можешь уточнить тип ModdleElement
}

export type TimelineSelection = {
	type: 'timeline'
	id: string
	event: any // твой MyEvent
}

export type Selection = BpmnSelection | TimelineSelection | null

export const useSelectionStore = defineStore('selection', () => {
	const current = ref<Selection>(null)

	function clear() {
		current.value = null
	}

	function selectBpmn(element: any) {
		current.value = { type: 'bpmn', id: element.id, element }
	}

	function selectTimeline(event: any) {
		current.value = { type: 'timeline', id: event.id, event }
	}

	return {
		current,
		clear,
		selectBpmn,
		selectTimeline,
	}
})
