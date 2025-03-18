import { defineStore } from 'pinia'
import { computed, ref, } from 'vue'

interface GridItem {
	x: number,
	y: number,
	w: number,
	h: number,
	i: string
	data?: any[]
}

export const useTree = defineStore('tree12', () => {

	const layout = ref<GridItem[]>([])

	const isDragWindow = ref(false)
	const toggleDragWindow = (() => {
		isDragWindow.value = !isDragWindow.value
	})

	const colNum = ref<number>(12)
	const index = ref<number>(2)

	const addGridItem = (e: any): void => {
		layout.value.push({
			x: 0, // Always starts at the leftmost position
			y: layout.value.length + (colNum.value || 12), // Puts it at the bottom
			w: 2,
			h: 1,
			i: index.value.toString(), // Convert number to string
			data: e
		})
		index.value++ // Ensure key is always unique
	}


	return {
		layout,
		isDragWindow,
		toggleDragWindow,
		addGridItem,
	}
})
