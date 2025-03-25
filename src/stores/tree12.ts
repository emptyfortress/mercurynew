import { defineStore } from 'pinia'
import { computed, ref, } from 'vue'

// interface GridItem {
// 	x: number,
// 	y: number,
// 	w: number,
// 	h: number,
// 	i: string
// 	data?: any[]
// }

export const useTree = defineStore('tree12', () => {

	const layout = ref<any[]>([])

	const isDragWindow = ref(false)
	const toggleDragWindow = (() => {
		isDragWindow.value = !isDragWindow.value
	})

	const addItem = (e: any): void => {
		layout.value.push(e)
	}

	return {
		layout,
		isDragWindow,
		toggleDragWindow,
		addItem,
	}
})
