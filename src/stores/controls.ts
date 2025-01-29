import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


export const useControl = defineStore('control', () => {
	const editorControls = ref<Control[]>([])
	const clean = ref(0)

	const selectedControl = computed(() => {
		return editorControls.value.find((el: Control) => el.selected)
	})

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
		editorControls.value.splice(n, 1)
	})

	const removeAll = (() => {
		editorControls.value.length = 0
		clean.value += 1
	})

	const hideMode = ref(true)

	const toggleHideMode = (() => {
		hideMode.value = !hideMode.value
	})

	return {
		editorControls,
		selectedControl,
		clean,
		select,
		deselect,
		addControl,
		removeControl,
		removeAll,
		hideMode,
		toggleHideMode,
	}
})
