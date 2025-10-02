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

export type NoneSelection = {
	kind: 'none'
}

export type Selection = BpmnSelection | TimelineSelection | NoneSelection

export const useSelectionStore = defineStore('selection', () => {
	const current = ref<Selection>({ kind: 'none' })

	const clear = () => {
		current.value = { kind: 'none' }
	}

	const selectBpmn = (element: any) => {
		current.value = { kind: 'bpmn', id: element.id, element }
	}

	const selectTimeline = (event: any) => {
		current.value = { kind: 'timeline', id: event.id, event }
	}

	return {
		current,
		clear,
		selectBpmn,
		selectTimeline,
	}
})
