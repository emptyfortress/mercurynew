import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { TreeElement } from '@/components/condition/conditionTypes'
import { treeDataSource } from './approveTreeData_fixed'

export const useApproveStore = defineStore('approveStore', () => {
	const treeData = ref<TreeElement[]>(treeDataSource)

	// === State for selection and navigation ===
	const selectedElement = ref<TreeElement | null>(null)
	const currentNode = ref<any>(null)
	const deleteRequest = ref(false)
	const duplicateRequest = ref(false)
	const addRequest = ref(false)

	// === Computed properties for tree operations ===
	const flatten = (nodes: TreeElement[]): TreeElement[] => {
		return nodes.reduce((acc: TreeElement[], node) => {
			acc.push(node)
			if (node.children && node.children.length > 0) {
				acc.push(...flatten(node.children))
			}
			return acc
		}, [])
	}

	const flatNodes = computed(() => flatten(treeData.value))
	const nodesMap = computed(() => new Map(flatNodes.value.map((node) => [node.id, node])))

	const nodesByParentId = computed(() => {
		const map = new Map<string, TreeElement[]>()
		for (const node of flatNodes.value) {
			if (!node.parentId?.length) {
				continue
			}
			for (const pid of node.parentId) {
				let children = map.get(pid)
				if (!children) {
					children = []
					map.set(pid, children)
				}
				children.push(node)
			}
		}
		return map
	})

	const getParentsInfo = (parentId: string[] | undefined): { name: string; id: string }[] => {
		if (!parentId?.length) return []
		return parentId
			.map((id) => flatNodes.value.find((node) => node.id === id))
			.filter((node): node is TreeElement => !!node)
			.map((node) => ({ name: node.text, id: node.id }))
	}

	const getChildren = (parentId: string): TreeElement[] => nodesByParentId.value.get(parentId) ?? []

	// === Tree utilities ===
	const getNodeById = (id: string): TreeElement | undefined => nodesMap.value.get(id)

	const getNameById = (id: string): string => {
		const node = nodesMap.value.get(id)
		return node?.text || ''
	}

	const getNameByFolderId = (id: string): string => {
		const node = nodesMap.value.get(id)
		return node?.text || ''
	}

	// === Node manipulation ===
	function updateTreeData(value: TreeElement[]) {
		treeData.value = value
	}

	function updateSelectedElement(updated: TreeElement) {
		function walk(nodes: TreeElement[]): boolean {
			for (let i = 0; i < nodes.length; i++) {
				if (nodes[i].id === updated.id) {
					nodes[i] = { ...nodes[i], ...updated }
					return true
				}
				const children = nodes[i].children
				if (children && children.length > 0 && walk(children)) {
					return true
				}
			}
			return false
		}
		walk(treeData.value)
	}

	/**
	 * Recursively remove a node with the given id from the tree.
	 */
	function removeById(array: TreeElement[], id: string): TreeElement[] {
		return array
			.filter((item) => item.id !== id)
			.map((item) => {
				if (item.children && item.children.length > 0) {
					item.children = removeById(item.children, id)
				}
				return item
			})
	}

	// === Node operations ===
	function selectNode(stat: Stat) {
		flatNodes.value.forEach((item: any) => (item.selected = false))
		stat.data.selected = true
		selectedElement.value = stat.data
		currentNode.value = stat
	}

	function removeNode(node: any) {
		updateTreeData(removeById(treeData.value, node.id))
		currentNode.value = null
		selectedElement.value = null
	}

	function editNode(node: any) {
		node.edit = true
	}

	function setText(node: any, event: any) {
		node.text = event.target.value
		node.edit = false
	}

	function toggleNode(node: any) {
		node.open = !node.open
	}

	function addNode(parent: any, text: string, type: number = 1, isVirtual: boolean = false) {
		const newNode: TreeElement = {
			id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			text: text,
			text1: '',
			selected: false,
			hidden: false,
			type: type,
			virtual: isVirtual,
			children: [],
			author: 'System',
			template: false,
		}
		if (parent.children) {
			parent.children.push(newNode)
		}
		return newNode
	}

	function openNode(nodeId: string) {
		const node = nodesMap.value.get(nodeId)
		if (node) {
			node.selected = true
			node.open = true
		}
	}

	// === Store control functions ===

	const addTemp = ref<null | TreeElement>(null)
	const addCopy = ref(false)

	function toggleAdd(e: null | TreeElement) {
		addTemp.value = e
		addRequest.value = !addRequest.value
	}

	function toggleDelete() {
		deleteRequest.value = !deleteRequest.value
	}

	function toggleDuplicate() {
		duplicateRequest.value = !duplicateRequest.value
	}

	// === Chip list state ===
	type Chip = {
		id: number
		label: string
		selected: boolean
	}

	const list = ref<Chip[]>([
		{
			id: 0,
			label: 'Все',
			selected: true,
		},
		{
			id: 1,
			label: 'Согласования',
			selected: false,
		},
		{
			id: 2,
			label: 'Маршруты',
			selected: false,
		},
		{
			id: 3,
			label: 'Этапы',
			selected: false,
		},
	])
	// === Chip selection ===
	function selectChip(id: number) {
		if (id === 0) {
			list.value.forEach((chip) => (chip.selected = chip.id === 0))
			return
		}

		const zeroChip = list.value.find((chip) => chip.id === 0)
		if (zeroChip) zeroChip.selected = false

		const target = list.value.find((chip) => chip.id === id)
		if (target) target.selected = !target.selected

		const hasOtherSelected = list.value.some((chip) => chip.id !== 0 && chip.selected)
		if (!hasOtherSelected && zeroChip) zeroChip.selected = true
	}

	const selectedChips = computed(() => list.value.filter((item) => item.selected))

	return {
		treeData,
		selectedElement,
		currentNode,
		deleteRequest,
		addRequest,
		addCopy,
		addTemp,
		duplicateRequest,
		list,
		nodesMap,
		flatNodes,
		selectedChips,
		getNodeById,
		getNameById,
		getNameByFolderId,
		getChildren,
		updateTreeData,
		updateSelectedElement,
		removeById,
		selectNode,
		removeNode,
		editNode,
		setText,
		toggleNode,
		addNode,
		openNode,
		toggleDelete,
		toggleDuplicate,
		selectChip,
		toggleAdd,
		getParentsInfo,
	}
})
