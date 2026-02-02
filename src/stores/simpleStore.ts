import { defineStore } from 'pinia'

export interface TreeElement {
	id: number
	text: string
	name?: string
	descr?: string
	selected?: boolean
	hidden?: boolean
	type: number
	edit?: boolean
}

export const useSimpleStore = defineStore('simpleStore', () => {
	const selectedElement = ref<TreeElement | null>(null)

	function setSelectedElement(element: TreeElement | null) {
		selectedElement.value = element
	}

	function clearSelectedElement() {
		selectedElement.value = null
	}

	return {
		selectedElement,
		setSelectedElement,
		clearSelectedElement,
	}
})
