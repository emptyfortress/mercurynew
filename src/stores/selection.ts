import { defineStore } from 'pinia'
import { ref } from 'vue'

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
	const programmaticSelectId = ref<number | null>(null)

	const selectedLateFilter = ref<boolean>(false)
	const selectedRouteFilter = ref<string | null>(null)

	// прячем выходные на таймлайне
	const hideWeekends = ref(true)

	const toggleWeekends = () => {
		hideWeekends.value = !hideWeekends.value
	}

	const clear = () => {
		current.value = null
		selectedLateFilter.value = false
	}

	const clearLateFilter = () => {
		selectedLateFilter.value = false
	}

	// Сбрасывает только route-фильтр
	const clearRouteFilter = () => {
		selectedRouteFilter.value = null
	}

	// Toggle-логика для route-фильтра (одиночный выбор, повторный клик — сброс)
	const selectRouteFilter = (filter: string) => {
		selectedRouteFilter.value = selectedRouteFilter.value === filter ? null : filter
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

	const selectById = (id: number) => {
		programmaticSelectId.value = id
	}

	return {
		current,
		programmaticSelectId,
		clear,
		selectBpmn,
		selectTimeline,
		selectById,
		selectedLateFilter,
		selectedRouteFilter,
		selectRouteFilter,
		clearRouteFilter,
		clearLateFilter,
		hideWeekends,
		toggleWeekends,
	}
})
