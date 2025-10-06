import { defineStore } from 'pinia'
import { ref } from 'vue'

export type BpmnSelection = {
	kind: 'bpmn'
	id: string
	type: string
	name: string
}

export type TimelineSelection = {
	kind: 'timeline'
	id: number
	sideId: string
	className: string
	name: string
	fio: string
	role: string
	type: string
	start: any
	end: any
}

export type Selection = TimelineSelection | BpmnSelection | null

export const useSelectionStore = defineStore('selection', () => {
	const current = ref<Selection>(null)

	const clear = () => {
		current.value = null
	}

	const selectBpmn = (element: any) => {
		current.value = {
			kind: 'bpmn',
			id: element.id,
			type: 'bpmn:Task',
			name: element.name,
		}
	}

	const selectTimeline = (event: any) => {
		current.value = {
			kind: 'timeline',
			id: event.id,
			sideId: event.sideId,
			className: event.className,
			name: event.name,
			fio: event.fio,
			role: event.role,
			type: event.type,
			start: event.start,
			end: event.end,
		}
	}

	return {
		current,
		clear,
		selectBpmn,
		selectTimeline,
	}
})
