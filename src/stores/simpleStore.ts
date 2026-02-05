import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { uid } from 'quasar'

export interface TreeElement {
	id: string
	text: string
	name?: string
	selected?: boolean
	hidden: boolean
	edit?: boolean
	type?: number
	children?: TreeElement[]
}

export const useSimpleStore = defineStore('simpleStore', () => {
	const treeData = ref([
		{
			id: 'document',
			text: 'Документ',
			hidden: false,
			selected: false,
			type: 0,
			children: [
				{
					id: 'document.ud',
					text: 'Документ УД',
					hidden: false,
					selected: false,
					children: [
						{
							id: 'document.ud.outgoing',
							text: 'Исходящий',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.ud.request',
							text: 'Заявка',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.ud.ord',
							text: 'ОРД',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.ud.working',
							text: 'Рабочий',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.ud.incoming',
							text: 'Входящий',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.ud.contract',
							text: 'Договор',
							hidden: false,
							selected: false,
							children: [
								{
									id: 'document.ud.contract.act',
									text: 'Акт',
									hidden: false,
									selected: false,
									children: [],
								},
								{
									id: 'document.ud.contract.additional',
									text: 'Дополнительное соглашение',
									hidden: false,
									selected: false,
									children: [],
								},
							],
						},
						{
							id: 'document.ud.memo',
							text: 'Служебная записка',
							hidden: false,
							selected: false,
							children: [],
						},
					],
				},
				{
					id: 'document.file',
					text: 'Файл',
					hidden: false,
					selected: false,
					children: [],
				},
				{
					id: 'document.upd',
					text: 'УПД',
					hidden: false,
					selected: false,
					children: [
						{
							id: 'document.upd.outgoing',
							text: 'Исходящий УПД',
							hidden: false,
							selected: false,
							children: [
								{
									id: 'document.upd.outgoing.ukd.736',
									text: 'Исходящий УКД (736)',
									hidden: false,
									selected: false,
									children: [],
								},
								{
									id: 'document.upd.outgoing.fix',
									text: 'Исходящее исправление УПД',
									hidden: false,
									selected: false,
									children: [
										{
											id: 'document.upd.outgoing.fix.820',
											text: 'Исходящее исправление УПД (820)',
											hidden: false,
											selected: false,
											children: [],
										},
									],
								},
								{
									id: 'document.upd.outgoing.820',
									text: 'Исходящий УПД (820)',
									hidden: false,
									selected: false,
									children: [],
								},
								{
									id: 'document.upd.outgoing.970',
									text: 'Исходящий УПД (970)',
									hidden: false,
									selected: false,
									children: [],
								},
							],
						},
						{
							id: 'document.upd.incoming',
							text: 'Входящий УПД',
							hidden: false,
							selected: false,
							children: [
								{
									id: 'document.upd.incoming.formalized',
									text: 'Формализованный акт',
									hidden: false,
									selected: false,
									children: [
										{
											id: 'document.upd.incoming.formalized.820',
											text: 'Формализованный акт (820)',
											hidden: false,
											selected: false,
											children: [],
										},
									],
								},
								{
									id: 'document.upd.incoming.ukd.736',
									text: 'Входящий УКД (736)',
									hidden: false,
									selected: false,
									children: [],
								},
								{
									id: 'document.upd.incoming.970',
									text: 'Входящий УПД (970)',
									hidden: false,
									selected: false,
									children: [],
								},
							],
						},
					],
				},
				{
					id: 'document.invitation',
					text: 'Обмен приглашениями',
					hidden: false,
					selected: false,
					children: [
						{
							id: 'document.invitation.outgoing',
							text: 'Исходящее приглашение ЭДО',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.invitation.incoming',
							text: 'Входящее приглашение ЭДО',
							hidden: false,
							selected: false,
							children: [],
						},
					],
				},
				{
					id: 'document.mchd',
					text: 'МЧД',
					hidden: false,
					selected: false,
					children: [
						{
							id: 'document.mchd.power.002',
							text: 'Доверенность (версия 002)',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.mchd.substitution.002',
							text: 'Передоверие (версия 002)',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.mchd.power.emchd.1',
							text: 'Доверенность (версия ЕМЧД_1)',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.mchd.substitution.emchd.1',
							text: 'Передоверие (версия ЕМЧД_1)',
							hidden: false,
							selected: false,
							children: [],
						},
					],
				},
				{
					id: 'document.kedo',
					text: 'КЭДО',
					hidden: false,
					selected: false,
					children: [
						{
							id: 'document.kedo.hr',
							text: 'Кадровый документ',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.kedo.employee-request',
							text: 'Заявка сотрудника',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'document.kedo.staff-process',
							text: 'Кадровые процессы',
							hidden: false,
							selected: false,
							children: [
								{
									id: 'document.kedo.staff-process.department-calendar',
									text: 'Календарь отдела',
									hidden: false,
									selected: false,
									children: [],
								},
								{
									id: 'document.kedo.staff-process.personal-calendar',
									text: 'Личный календарь',
									hidden: false,
									selected: false,
									children: [],
								},
							],
						},
					],
				},
			],
		},

		{
			id: 'task',
			text: 'Задание',
			hidden: false,
			selected: false,
			type: 0,
			children: [
				{
					id: 'task.ud',
					text: 'Задание УД',
					hidden: false,
					selected: false,
					children: [
						{
							id: 'task.ud.execution',
							text: 'На исполнение',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'task.ud.review',
							text: 'На ознакомление',
							hidden: false,
							selected: false,
							children: [],
						},
					],
				},
				{
					id: 'task.ks',
					text: 'Задание КС',
					hidden: false,
					selected: false,
					children: [
						{
							id: 'task.ks.sign',
							text: 'На подписание',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'task.ks.consolidation',
							text: 'На консолидацию',
							hidden: false,
							selected: false,
							children: [
								{
									id: 'task.ks.consolidation.counterparty',
									text: 'Согласование с контрагентом',
									hidden: false,
									selected: false,
									children: [],
								},
								{
									id: 'task.ks.consolidation.contract',
									text: 'Консолидация Договора',
									hidden: false,
									selected: false,
									children: [],
								},
							],
						},
						{
							id: 'task.ks.approval',
							text: 'На согласование',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'task.ks.sign.mhd',
							text: 'На подписание МЧД',
							hidden: false,
							selected: false,
							children: [],
						},
						{
							id: 'task.ks.sign.kedo',
							text: 'На подписание КЭДО',
							hidden: false,
							selected: false,
							children: [],
						},
					],
				},
			],
		},
		{
			id: 'group',
			text: 'Группа заданий',
			hidden: false,
			selected: false,
			type: 0,
			children: [
				{
					id: 'group1',
					text: 'Не знаю что здесь',
					hidden: false,
					selected: false,
					children: [],
				},
			],
		},
	])

	const flatten = (nodes: TreeElement[]): TreeElement[] => {
		return nodes.reduce((acc: TreeElement[], node) => {
			acc.push(node)
			if (node.children && node.children.length > 0) {
				acc.push(...flatten(node.children))
			}
			return acc
		}, [])
	}

	// Оптимизация: создаем плоский массив только при изменении дерева
	const flatNodes = computed(() => flatten(treeData.value))
	// Оптимизация: создаем Map для мгновенного поиска O(1) вместо find() O(n)
	const nodesMap = computed(() => {
		return new Map(flatNodes.value.map((node) => [node.id, node.text]))
	})

	// Функция получения имени
	const getNameById = (id: string): string => {
		return nodesMap.value.get(id) || id
	}

	function updateTreeData(value: any[]) {
		treeData.value = value
	}

	const selectedType = ref<string | null>('Все')

	const selectedElement = ref<TreeElement | null>(null)

	function setSelectedElement(element: TreeElement | null) {
		selectedElement.value = element
	}

	function clearSelectedElement() {
		selectedElement.value = null
	}

	const selectedBranch = computed({
		get() {
			if (selectedType.value === 'Все') {
				return treeData.value
			}

			// ⚠️ только представление
			return treeData.value.filter((node) => node.text === selectedType.value)
		},

		set(value) {
			// ❗ he-tree всегда возвращает ПОЛНОЕ дерево
			treeData.value = value
		},
	})

	return {
		treeData,
		selectedType,
		selectedElement,
		setSelectedElement,
		clearSelectedElement,
		updateTreeData,
		selectedBranch,
		flatNodes,
		getNameById,
	}
})
