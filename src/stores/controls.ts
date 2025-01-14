import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useControl = defineStore('control', () => {
	const editorControls = ref<Control[]>([
		{
			id: 4,
			label: 'Control 0',
			selected: false,
		},
		{
			id: 5,
			label: 'Control 0',
			selected: false,
		},
	])

	const deselect = (() => {
		editorControls.value.map((el) => el.selected = false)
	})

	const select = ((item: Control) => {
		deselect()
		item.selected = true
	})

	return {
		editorControls,
		select,
		deselect,
	}
})
