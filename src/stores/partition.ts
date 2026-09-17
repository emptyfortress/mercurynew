import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PartitionNode {
	id: string
	text: string
	main: boolean
	children: PartitionNode[]
	sourceColumnId?: string
	[key: string]: unknown
}

interface ColumnSource {
	id: string
	text: string
	parents?: string[]
}

export const usePartitionStore = defineStore('part', () => {
	const partitions = ref<PartitionNode[]>([])

	const selectedIds = ref<Set<string>>(new Set())

	const externalDragPayload = ref<any>(null)

	function setExternalDragPayload(payload: any) {
		externalDragPayload.value = payload
	}

	function clearExternalDragPayload() {
		externalDragPayload.value = null
	}

	function addPartitionForColumn(column: ColumnSource) {
		const partitionId = `partition-${column.id}`
		const parents = column.parents ?? []
		const duplicates = partitions.value.reduce<number[]>((indexes, partition, index) => {
			const sameParents =
				parents.length > 0 &&
				Array.isArray(partition.parents) &&
				partition.parents.length === parents.length &&
				partition.parents.every((parent, parentIndex) => parent === parents[parentIndex])

			if (
				partition.sourceColumnId &&
				(sameParents || partition.sourceColumnId === column.id || partition.id === partitionId)
			) {
				indexes.push(index)
			}
			return indexes
		}, [])

		if (duplicates.length) {
			for (let index = duplicates.length - 1; index > 0; index--) {
				partitions.value.splice(duplicates[index], 1)
			}
			return
		}

		partitions.value.push({
			id: partitionId,
			text: column.text,
			sourceColumnId: column.id,
			parents: [...parents],
			main: true,
			children: [],
			hidden: false,
			selected: false,
			psevdo: '',
		})
	}

	return {
		partitions,
		selectedIds,
		externalDragPayload,
		setExternalDragPayload,
		clearExternalDragPayload,
		addPartitionForColumn,
	}
})
