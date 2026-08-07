import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { TreeElement } from '@/components/condition/conditionTypes'
import { FileType } from '@/components/condition/conditionTypes'

export const useApproveStore = defineStore('approveStore', () => {
	// === Data collections ===

	const treeData = ref<TreeElement[]>([
		{
			id: 'root',
			text: 'Папки',
			filetype: FileType.Folder,
			open: true,
			children: [
				{
					id: 'soglasovanie-test',
					text: 'Согласование-тест',
					filetype: FileType.Folder,
					children: [
						{
							id: 'approval-test-1',
							text: 'Согласование договора поставки',
							filetype: FileType.Approving,
							children: [],
							open: true,
						},
						{
							id: 'approval-test-1-route-1',
							text: 'Основной маршрут',
							filetype: FileType.Route,
							children: [],
							open: true,
						},
						{
							id: 'approval-test-1-route-1-stage-1',
							text: 'Подготовка документа',
							filetype: FileType.Stage,
							children: [],
							open: true,
						},
						{
							id: 'approval-test-1-route-1-stage-2',
							text: 'Проверка юристом',
							filetype: FileType.Stage,
							children: [],
						},
						{
							id: 'approval-test-1-route-1-stage-3',
							text: 'Утверждение руководителем',
							filetype: FileType.Stage,
							children: [],
						},
						{
							id: 'approval-test-1-route-2',
							text: 'Ускоренный маршрут',
							filetype: FileType.Route,
							children: [],
						},
						{
							id: 'approval-test-1-route-2-stage-1',
							text: 'Проверка документа',
							filetype: FileType.Stage,
							children: [],
						},
						{
							id: 'approval-test-1-route-2-stage-2',
							text: 'Согласование руководителем',
							filetype: FileType.Stage,
							children: [],
						},
						{
							id: 'approval-test-1-route-2-stage-3',
							text: 'Подписание',
							filetype: FileType.Stage,
							children: [],
						},
					],
				},
				{
					id: 'konstruktor-soglasovaniy',
					text: 'Конструктор согласований',
					filetype: FileType.Folder,
					children: [
						{
							id: 'dogovory',
							text: 'Договоры',
							filetype: FileType.Folder,
							children: [
								{
									id: 'approval-contract-1',
									text: 'Типовой договор поставки',
									filetype: FileType.Approving,
									children: [],
								},
								{
									id: 'approval-contract-1-route-1',
									text: 'Стандартный маршрут',
									filetype: FileType.Route,
									children: [],
								},
								{
									id: 'approval-contract-1-route-1-stage-1',
									text: 'Подготовка',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-test-1-route-2-stage-1',
									text: 'Проверка документа',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-1-route-1-stage-2',
									text: 'Юридическая экспертиза',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-1-route-1-stage-3',
									text: 'Финансовое согласование',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-1-route-1-stage-4',
									text: 'Подписание',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-1-route-2',
									text: 'Маршрут для филиалов',
									filetype: FileType.Route,
									children: [],
								},
								{
									id: 'approval-contract-1-route-2-stage-1',
									text: 'Подготовка',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-1-route-2-stage-2',
									text: 'Согласование филиалом',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-1-route-2-stage-3',
									text: 'Утверждение директором',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-2',
									text: 'Договор аренды',
									filetype: FileType.Approving,
									children: [],
								},
								{
									id: 'approval-contract-2-route-1',
									text: 'Основной маршрут',
									filetype: FileType.Route,
									children: [],
								},
								{
									id: 'approval-contract-2-route-1-stage-1',
									text: 'Проверка документа',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-2-route-1-stage-2',
									text: 'Юридическое согласование',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-2-route-1-stage-3',
									text: 'Подписание',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-2-route-2',
									text: 'Экспресс-маршрут',
									filetype: FileType.Route,
									children: [],
								},
								{
									id: 'approval-contract-2-route-2-stage-1',
									text: 'Проверка',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-2-route-2-stage-2',
									text: 'Подписание',
									filetype: FileType.Stage,
									children: [],
								},
								{
									id: 'approval-contract-2-route-2-stage-3',
									text: 'Регистрация',
									filetype: FileType.Stage,
									children: [],
								},
							],
						},
						{
							id: 'archive',
							text: 'Архив',
							filetype: FileType.Folder,
							children: [],
						},
					],
				},
				{
					id: 'papki-podrazdeleniy',
					text: 'Папки подразделений',
					filetype: FileType.Folder,
					children: [
						{
							id: 'otdel-kadrov',
							text: 'Отдел кадров',
							filetype: FileType.Folder,
							children: [
								{
									id: 'file1',
									text: 'Анкета сотрудника.txt',
									filetype: FileType.Text,
									children: [],
								},
								{
									id: 'file2',
									text: 'Должностные_обязанности.docx',
									filetype: FileType.Word,
									children: [],
								},
							],
						},
					],
				},
			],
		},
	])

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
	function selectNode(stat: Stat, router: any) {
		flatNodes.value.forEach((item: any) => (item.selected = false))
		stat.data.selected = true
		// node.sourceType = 'approve'
		selectedElement.value = stat.data
		currentNode.value = stat
		router.push({
			name: 'start',
			params: { viewId: stat.data.id },
		})
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

	function filterTreeByChips(treeData: TreeElement[], selectedChips: Chip[]): TreeElement[] {
		// чип id: 0 ("Все") выбран — возвращаем исходное дерево как есть
		if (selectedChips.some((chip) => chip.id === 0)) {
			return treeData
		}

		const selectedTypes = new Set(selectedChips.map((chip) => chip.id))

		function filterNodes(nodes: TreeElement[]): TreeElement[] {
			return nodes.reduce<TreeElement[]>((acc, node) => {
				const filteredChildren = node.children ? filterNodes(node.children) : []
				const matchesSelf = node.filetype !== undefined && selectedTypes.has(node.filetype)

				if (matchesSelf || filteredChildren.length > 0) {
					acc.push({
						...node,
						children: filteredChildren,
					})
				}

				return acc
			}, [])
		}

		return filterNodes(treeData)
	}
	const activeTreeData = computed(() => {
		return filterTreeByChips(treeData.value, selectedChips.value)
	})

	// killme
	const typovoy = ref(true)

	return {
		typovoy,
		treeData,
		selectedElement,
		currentNode,
		deleteRequest,
		addRequest,
		addCopy,
		addTemp,
		duplicateRequest,
		list,
		activeTreeData,
		nodesMap,
		flatNodes,
		getNodeById,
		getNameById,
		getNameByFolderId,
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
	}
})
