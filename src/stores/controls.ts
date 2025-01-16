import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useControl = defineStore('control', () => {
	const editorControls = ref<Control[]>([ ])

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

	const removeControl = ((n: number) => {
		console.log(111)
		editorControls.value.splice(n, 1)
	})

	return {
		editorControls,
		select,
		deselect,
		addControl,
		removeControl,
	}
})
