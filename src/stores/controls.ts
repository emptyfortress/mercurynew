import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useControl = defineStore('control', () => {
	const editorControls = ref<Control[]>([
		{
			id: 10,
			label: 'one',
			selected: false,
		},
		{
			id: 11,
			label: 'two',
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

	const addControl = ((e: Control) => {
		editorControls.value.push(e)
	})

	return {
		editorControls,
		select,
		deselect,
		addControl,
	}
})
