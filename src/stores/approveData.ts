import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface TreeElement {
	id: string
	text: string
	text1?: string
	name?: string
	selected?: boolean
	hidden?: boolean
	edit?: boolean
	type?: number
	children?: TreeElement[]
	virtual?: boolean
	author?: string
	fields?: any[]
}

export const useApproveDataStore = defineStore('approveDataStore', () => {
	// === Data collections ===
	const treeData = ref<TreeElement[]>([
		{
			id: 'dogovor',
			text: 'Договоры',
			text1: '',
			selected: false,
			hidden: false,
			type: 0,
			author: 'System',
			fields: [],
			children: [
				{
					id: 'dogovor-1',
					text: 'Согласование договора поставки',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'dogovor-1-1', text: 'Проверка юридическим отделом', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'dogovor-1-2', text: 'Согласование финансовым отделом', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'dogovor-1-3', text: 'Утверждение руководителем', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
				{
					id: 'dogovor-2',
					text: 'Согласование договора аренды',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'dogovor-2-1', text: 'Проверка условий аренды', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'dogovor-2-2', text: 'Согласование с бухгалтерией', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
				{
					id: 'dogovor-3',
					text: 'Согласование дополнительного соглашения',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'dogovor-3-1', text: 'Проверка изменений', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'dogovor-3-2', text: 'Юридическое согласование', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'dogovor-3-3', text: 'Подписание руководителем', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
				{
					id: 'dogovor-4',
					text: 'Согласование договора подряда',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'dogovor-4-1', text: 'Проверка технического задания', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'dogovor-4-2', text: 'Согласование бюджета', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
			],
		},
		{
			id: 'sluj',
			text: 'Служебки',
			text1: '',
			selected: false,
			hidden: false,
			type: 0,
			author: 'System',
			fields: [],
			children: [
				{
					id: 'sluj-1',
					text: 'Согласование служебной записки на закупку',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'sluj-1-1', text: 'Проверка потребности', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'sluj-1-2', text: 'Согласование бюджета', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
				{
					id: 'sluj-2',
					text: 'Согласование служебной записки на командировку',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'sluj-2-1', text: 'Согласование руководителем', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'sluj-2-2', text: 'Проверка кадровой службой', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'sluj-2-3', text: 'Подтверждение бухгалтерией', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
				{
					id: 'sluj-3',
					text: 'Согласование служебной записки на премирование',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'sluj-3-1', text: 'Проверка KPI', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'sluj-3-2', text: 'Утверждение директором', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
			],
		},
		{
			id: 'ord',
			text: 'ОРД',
			text1: '',
			selected: false,
			hidden: false,
			type: 0,
			author: 'System',
			fields: [],
			children: [
				{
					id: 'ord-1',
					text: 'Согласование приказа',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'ord-1-1', text: 'Юридическая проверка', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'ord-1-2', text: 'Подписание руководителем', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
				{
					id: 'ord-2',
					text: 'Согласование распоряжения',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'ord-2-1', text: 'Проверка исполнителей', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'ord-2-2', text: 'Утверждение', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
				{
					id: 'ord-3',
					text: 'Согласование положения',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'ord-3-1', text: 'Экспертиза документа', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'ord-3-2', text: 'Утверждение', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
				{
					id: 'ord-4',
					text: 'Согласование регламента',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [
						{ id: 'ord-4-1', text: 'Согласование подразделениями', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
						{ id: 'ord-4-2', text: 'Финальное утверждение', text1: '', selected: false, hidden: false, type: 2, author: 'System', fields: [], children: [] },
					],
				},
			],
		},
	])

	const poiskData = ref<TreeElement[]>([
		{
			id: 'root',
			text: 'Поиски DV',
			text1: '',
			selected: false,
			hidden: false,
			type: 0,
			author: 'System',
			fields: [],
			children: [
				{
					id: 'dogovor',
					text: 'Договоры',
					selected: false,
					text1: 'Поиск договоров до 100 тыс. руб',
					hidden: false,
					type: 1,
					author: 'admin',
					fields: [],
				},
				{
					id: 'docs',
					text: 'Мои документы',
					selected: false,
					text1: 'Поиск моих документов. Я - автор',
					hidden: false,
					type: 1,
					author: 'user123',
					fields: [],
				},
			],
		},
	])

	// === State for selection and navigation ===
	const selectedElement = ref<TreeElement | null>(null)
	const currentNode = ref<any>(null)
	const selectedType = ref<string | null>('Все')
	const deleteRequest = ref(false)
	const duplicateRequest = ref(false)
	const folderMode = ref(false)

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
	function selectNode(node: any, simpleStore: any, router: any) {
		flatNodes.value.forEach((item: any) => (item.selected = false))
		node.selected = true
		node.sourceType = 'approve'
		simpleStore.setSelectedElement(node)
		simpleStore.setCurrentNode(node)
		router.push({
			name: 'start',
			params: { viewId: node.id },
		})
	}

	function removeNode(node: any, simpleStore: any) {
		updateTreeData(removeById(treeData.value, node.id))
		simpleStore.setCurrentNode(null)
		simpleStore.setSelectedElement(null)
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
			edit: false,
			author: 'System',
			fields: [],
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

	function getFirstNode() {
		return treeData.value[0]
	}

	// === Store control functions ===
	function toggleDelete() {
		deleteRequest.value = !deleteRequest.value
	}

	function toggleDuplicate() {
		duplicateRequest.value = !duplicateRequest.value
	}

	// === Computed for selection ===
	const selectedBranch = computed({
		get() {
			if (selectedType.value === 'Все') {
				return treeData.value
			}
			return treeData.value.filter((node) => node.text === selectedType.value)
		},
		set(value) {
			treeData.value = value
		},
	})

	// === Export ===
	return {
		// Data
		treeData,
		poiskData,
		selectedElement,
		currentNode,
		selectedType,
		deleteRequest,
		duplicateRequest,
		folderMode,
		// Tree utilities
		nodesMap,
		flatNodes,
		getNodeById,
		getNameById,
		getNameByFolderId,
		updateTreeData,
		updateSelectedElement,
		removeById,
		getFirstNode,
		// Node operations
		selectNode,
		removeNode,
		editNode,
		setText,
		toggleNode,
		addNode,
		openNode,
		// Store controls
		toggleDelete,
		toggleDuplicate,
		// Computed
		selectedBranch,
	}
})