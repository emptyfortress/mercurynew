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
	children?: unknown[]
}

export const hasSameParents = (first: unknown, second: unknown) => {
	if (!Array.isArray(first) || !Array.isArray(second) || first.length === 0) {
		return false
	}

	return first.length === second.length && first.every((parent, index) => parent === second[index])
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
		const existingPartition = partitions.value.find(
			(partition) =>
				hasSameParents(partition.parents, parents) ||
				partition.sourceColumnId === column.id ||
				partition.id === partitionId
		)

		if (existingPartition) {
			return
		}

		partitions.value.push({
			id: partitionId,
			text: column.text,
			sourceColumnId: column.id,
			parents: [...parents],
			main: true,
			children: [],
			childs: column.children ?? [],
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
