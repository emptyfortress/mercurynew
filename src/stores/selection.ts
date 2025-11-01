import { defineStore } from 'pinia'
import { ref } from 'vue'
import { goodFinish, badFinish } from '@/stores/events'

export type BpmnSelection = {
	kind: 'bpmn'
	id: string
	type: string
	name: string
	lane?: string
	finished?: string
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
	const programmaticSelectId = ref<string | null>(null)

	const selectedLateFilter = ref<boolean>(false)

	const selectedForecast = ref<boolean>(false)
	const forecastEvents = ref<MyEvent[]>([])

	const loadForecastEvents = async () => {
		if (current.value && current.value.kind == 'bpmn') {
			if (current.value.id == 'Event_1yi1uuk') {
				forecastEvents.value = badFinish
			} else {
				forecastEvents.value = goodFinish
			}
		}
	}

	// прячем выходные на таймлайне
	const hideWeekends = ref(true)

	const toggleWeekends = () => {
		hideWeekends.value = !hideWeekends.value
	}

	const clear = () => {
		current.value = null
		selectedForecast.value = false
	}

	const clearForecast = () => {
		selectedForecast.value = false
	}

	const selectBpmn = (element: any) => {
		current.value = {
			kind: 'bpmn',
			id: element.id,
			type: 'bpmn:Task',
			name: element.name,
			lane: element.lanes[0].name,
			finished: element.finished,
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
		programmaticSelectId,
		clear,
		selectBpmn,
		selectTimeline,
		selectedLateFilter,
		hideWeekends,
		toggleWeekends,
		selectedForecast,
		clearForecast,
		loadForecastEvents,
		forecastEvents,
	}
})
