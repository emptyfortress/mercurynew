import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fields } from '@/stores/fields-poisk'

export interface PartitionNode {
	id: string
	text: string
	main: boolean
	children: PartitionNode[]
	sourcePartitionId?: string
	[key: string]: unknown
}

interface FieldSource {
	id: string
	text: string
	parents?: string[]
	drag?: boolean
	children?: FieldSource[]
	[key: string]: unknown
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

	function findSourcePartition(field: FieldSource) {
		const path = field.parents
		if (!path?.length) return null

		let nodes = fields as FieldSource[]
		let partition: FieldSource | undefined
		for (const label of path) {
			partition = nodes.find((node) => node.text === label)
			if (!partition) return null
			nodes = partition.children ?? []
		}

		return partition
	}

	function addPartitionForField(field: FieldSource) {
		const sourcePartition = findSourcePartition(field)
		const path = field.parents ?? []
		if (!sourcePartition || !path.length) return

		const text = path[path.length - 1]
		const parents = path.slice(0, -1)
		const existingPartition = partitions.value.find(
			(partition) =>
				partition.text === text &&
				Array.isArray(partition.parents) &&
				partition.parents.length === parents.length &&
				partition.parents.every((parent, index) => parent === parents[index])
		)

		if (existingPartition) {
			return
		}

		partitions.value.push({
			id: `partition-${sourcePartition.id}`,
			text,
			sourcePartitionId: sourcePartition.id,
			parents,
			main: true,
			children: [],
			childs: (sourcePartition.children ?? []).filter((child) => child.drag),
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
		addPartitionForField,
	}
})
