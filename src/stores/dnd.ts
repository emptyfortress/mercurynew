import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Kind, Newkind } from '@/types/enum'

interface TreeNode {
	id: string
	type: string
	text: string
	kind: Kind | null
	newkind?: Newkind | null
	children?: TreeNode[]
}

interface ExternalParamPayload {
	id: string
	text: string
}

export const useDndStore = defineStore('dnd', () => {
	const externalDragPayload = ref<any>(null)
	const columnData = ref<TreeNode[]>([])

	let colCounter = 0

	function addColumn() {
		colCounter++
		let newColumn = {
			id: `col-${Date.now()}-${colCounter}`,
			type: 'column',
			text: `Колонка ${colCounter}`,
			kind: null,
			newkind: null,
			children: [],
		}
		columnData.value?.push(newColumn)
	}

	const remove = (index: number) => {
		columnData.value.splice(index, 1)
	}

	function setExternalDragPayload(payload: any) {
		externalDragPayload.value = payload
	}

	function clearExternalDragPayload() {
		externalDragPayload.value = null
	}

	return {
		externalDragPayload,
		setExternalDragPayload,
		clearExternalDragPayload,
		columnData,
		addColumn,
		remove
	}
})
