import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface TreeElement {
	id: string
	text: string
	text1?: string
	name?: string
	selected?: boolean
	hidden?: boolean
	open?: boolean
	edit?: boolean
	type: number
	children?: TreeElement[]
	virtual?: boolean
	author?: string
	fields?: any[]
	template?: boolean
}

export const useApproveStore = defineStore('approveStore', () => {
	// === Data collections ===

	const treeData1 = ref<TreeElement[]>([
		{
			id: 'template',
			text: 'Типовые образцы',
			text1: '',
			selected: false,
			hidden: false,
			type: 0,
			fields: [],
			children: [],
		},
	])
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
						{
							id: 'dogovor-1-1',
							text: 'Проверка юридическим отделом',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							template: true,
							fields: [],
							children: [
								{
									id: 'dogovor-1-1-1',
									text: 'Получение документа',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-1-1-2',
									text: 'Правовая экспертиза',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									template: true,
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-1-1-3',
									text: 'Формирование заключения',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
						{
							id: 'dogovor-1-2',
							text: 'Согласование финансовым отделом',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'dogovor-1-2-1',
									text: 'Проверка бюджета',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-1-2-2',
									text: 'Расчёт условий оплаты',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-1-2-3',
									text: 'Согласование сметы',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
						{
							id: 'dogovor-1-3',
							text: 'Утверждение руководителем',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'dogovor-1-3-1',
									text: 'Рассмотрение документа',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-1-3-2',
									text: 'Подписание',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
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
						{
							id: 'dogovor-2-1',
							text: 'Проверка условий аренды',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'dogovor-2-1-1',
									text: 'Анализ условий договора',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-2-1-2',
									text: 'Проверка кадастровых данных',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-2-1-3',
									text: 'Согласование ставки аренды',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
						{
							id: 'dogovor-2-2',
							text: 'Согласование с бухгалтерией',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'dogovor-2-2-1',
									text: 'Проверка расчётов',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-2-2-2',
									text: 'Формирование платёжного графика',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
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
						{
							id: 'dogovor-4-1',
							text: 'Проверка технического задания',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'dogovor-4-1-1',
									text: 'Анализ требований',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-4-1-2',
									text: 'Согласование объёма работ',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
						{
							id: 'dogovor-4-2',
							text: 'Согласование бюджета',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'dogovor-4-2-1',
									text: 'Расчёт стоимости',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-4-2-2',
									text: 'Проверка сметы',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'dogovor-4-2-3',
									text: 'Утверждение бюджета',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
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
						{
							id: 'ord-1-1',
							text: 'Юридическая проверка',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'ord-1-1-1',
									text: 'Проверка соответствия законодательству',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'ord-1-1-2',
									text: 'Формирование замечаний',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
						{
							id: 'ord-1-2',
							text: 'Подписание руководителем',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'ord-1-2-1',
									text: 'Рассмотрение приказа',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'ord-1-2-2',
									text: 'Подписание',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
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
						{
							id: 'ord-2-1',
							text: 'Проверка исполнителей',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'ord-2-1-1',
									text: 'Определение ответственных лиц',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'ord-2-1-2',
									text: 'Согласование сроков исполнения',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
						{
							id: 'ord-2-2',
							text: 'Утверждение',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'ord-2-2-1',
									text: 'Финальная проверка',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'ord-2-2-2',
									text: 'Утверждение распоряжения',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
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
						{
							id: 'ord-3-1',
							text: 'Экспертиза документа',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'ord-3-1-1',
									text: 'Анализ содержания',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'ord-3-1-2',
									text: 'Проверка на соответствие стандартам',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
						{
							id: 'ord-3-2',
							text: 'Утверждение',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'ord-3-2-1',
									text: 'Рассмотрение положения',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'ord-3-2-2',
									text: 'Подписание',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
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
						{
							id: 'ord-4-1',
							text: 'Согласование подразделениями',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'ord-4-1-1',
									text: 'Рассылка на согласование',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'ord-4-1-2',
									text: 'Сбор замечаний подразделений',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
						{
							id: 'ord-4-2',
							text: 'Финальное утверждение',
							text1: '',
							selected: false,
							hidden: false,
							type: 2,
							author: 'System',
							fields: [],
							children: [
								{
									id: 'ord-4-2-1',
									text: 'Проверка итоговой версии',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
								{
									id: 'ord-4-2-2',
									text: 'Утверждение регламента',
									text1: '',
									selected: false,
									hidden: false,
									type: 3,
									author: 'System',
									fields: [],
									children: [],
								},
							],
						},
					],
				},
			],
		},
		{
			id: 'unsort',
			text: 'Unsorted',
			text1: '',
			selected: false,
			hidden: false,
			type: 0,
			author: 'System',
			fields: [],
			children: [
				{
					id: 'unsort1',
					text: 'Этап-потеряшка',
					text1: '',
					selected: false,
					hidden: false,
					type: 3,
					author: 'System',
					fields: [],
					children: [],
				},
				{
					id: 'unsort2',
					text: 'Этап подготовительный',
					text1: '',
					selected: false,
					hidden: false,
					type: 3,
					author: 'System',
					fields: [],
					children: [],
				},
				{
					id: 'unsort3',
					text: 'Некое согласование',
					text1: '',
					selected: false,
					hidden: false,
					type: 1,
					author: 'System',
					fields: [],
					children: [],
				},
				{
					id: 'unsort4',
					text: 'Маршрут Иванович',
					text1: '',
					selected: false,
					hidden: false,
					type: 2,
					author: 'System',
					fields: [],
					children: [],
				},
			],
		},
	])
	// === State for selection and navigation ===
	const selectedElement = ref<TreeElement | null>(null)
	const currentNode = ref<any>(null)
	const deleteRequest = ref(false)
	const duplicateRequest = ref(false)

	// === Chip list state ===
	const list = ref([
		{
			id: 0,
			label: 'Согласования',
			selected: true,
		},
		{
			id: 1,
			label: 'Типовые образцы',
			selected: false,
		},
	])

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

	// === Store control functions ===
	function toggleDelete() {
		deleteRequest.value = !deleteRequest.value
	}

	function toggleDuplicate() {
		duplicateRequest.value = !duplicateRequest.value
	}

	// === Chip selection ===
	function selectChip(id: number) {
		list.value.forEach((item) => (item.selected = item.id === id))
	}

	const activeTreeData = computed(() => {
		const selectedChip = list.value.find((item) => item.selected)
		return selectedChip?.id === 1 ? treeData1.value : treeData.value
	})

	return {
		treeData,
		treeData1,
		selectedElement,
		currentNode,
		deleteRequest,
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
	}
})
