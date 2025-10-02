import { defineStore } from 'pinia'
import { ref } from 'vue'

export type BpmnSelection = {
	kind: 'bpmn'
	id: string
	element: any // можешь уточнить тип ModdleElement
}

export type TimelineSelection = {
	kind: 'timeline'
	id: string
	event: any // твой MyEvent
}

export type Selection = BpmnSelection | TimelineSelection | null

export const useSelectionStore = defineStore('selection', () => {
	const current = ref<Selection>(null)

	const clear = () => {
		current.value = null
	}

	const selectBpmn = (element: any) => {
		current.value = { kind: 'bpmn', id: element.id, element }
	}

	const selectTimeline = (event: any) => {
		// console.log(event)
		// current.value = { type: 'timeline', id: event.id, event }
		// console.log('event.id =', event.id, event)
		current.value = { kind: 'timeline', id: event.id, event }
		// console.log('current set ->', current.value)
	}

	return {
		current,
		clear,
		selectBpmn,
		selectTimeline,
	}
})
