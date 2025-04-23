// import type { set } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useKeys = defineStore('mykeys', () => {
	const keys = ref<MenuItem[][]>([])

	const isDragWindow = ref(false)
	const toggleDragWindow = () => {
		isDragWindow.value = !isDragWindow.value
	}
	const removeDragWindow = () => {
		isDragWindow.value = false
	}

	const hasParameters = computed(() => {
		return keys.value.filter((group) => group.some((item) => item.isPar === true))
	})

	const addItem = (e: MenuItem[]): void => {
		keys.value.push(e)
	}

	const columns = ref<PredCols[]>([
		{
			id: 0,
			active: true,
			label: 'Автор',
			name: 'author',
			field: 'author',
			align: 'left',
			sortable: true,
		},
		{
			id: 1,
			active: true,
			label: 'Дата начала отпуска',
			name: 'date',
			field: 'date',
			align: 'left',
			sortable: true,
		},
		{
			id: 2,
			active: true,
			label: 'Дата окончания отпуска',
			name: 'date1',
			field: 'date1',
			align: 'left',
			sortable: true,
		},
		{
			id: 3,
			active: true,
			label: 'Комментарий',
			name: 'comment',
			field: 'comment',
			align: 'left',
			sortable: true,
		},
		{
			id: 11,
			active: false,
			label: 'Состояние заявки',
			name: 'status',
			field: 'status',
			align: 'left',
			sortable: true,
		},
		{
			id: 4,
			active: false,
			label: 'Процесс завершен',
			name: 'finish',
			field: 'finish',
			align: 'left',
			sortable: true,
		},
		{
			id: 5,
			active: false,
			label: 'Процесс не завершен',
			name: 'notFinish',
			field: 'notFinish',
			align: 'left',
			sortable: true,
		},
		{
			id: 6,
			active: false,
			label: 'Планируемая дата завершения',
			name: 'planned',
			field: 'planned',
			align: 'left',
			sortable: true,
		},
		{
			id: 7,
			active: false,
			label: 'Просрочено',
			name: 'overdue',
			field: 'overdue',
			align: 'left',
			sortable: true,
		},
		{
			id: 8,
			active: false,
			label: 'Есть просроченный этап',
			name: 'etap',
			field: 'etap',
			align: 'left',
			sortable: true,
		},
		{
			id: 9,
			active: false,
			label: 'Текущий этап обработки',
			name: 'current',
			field: 'current',
			align: 'left',
			sortable: true,
		},
		{
			id: 10,
			active: false,
			label: 'Исполнитель текущего этапа',
			name: 'isp',
			field: 'isp',
			align: 'left',
			sortable: true,
		},
	])

	// columns update
	const updateCols = (list: PredCols[]) => {
		columns.value = list
	}

	const activeColumns = computed(() => {
		return columns.value.filter((col) => col.active)
	})

	const theme = ref(0)

	const hoverItem = ref<string | null>(null)

	const setHover = (e: null | string) => {
		hoverItem.value = e
	}

	const counter = ref(0)
	const increment = () => {
		counter.value += 1
	}

	return {
		keys,
		isDragWindow,
		hasParameters,
		columns,
		activeColumns,
		theme,
		hoverItem,
		counter,
		increment,
		setHover,
		toggleDragWindow,
		removeDragWindow,
		addItem,
		updateCols,
	}
})
