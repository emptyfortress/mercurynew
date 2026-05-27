<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

interface TreeElement {
	id: string
	text: string
	name?: string
	selected?: boolean
	hidden: boolean
	edit?: boolean
	type?: number
	children?: TreeElement[]
	sourceType?: 'folderData' | 'treeData'
	virtual?: boolean
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

	const folderData = ref([
		{
			id: 'root',
			text: 'Каталог папок',
			virtual: false,
			children: [
				{
					id: 'f0',
					text: 'Виртуальная папка',
					virtual: true,
				},
				{
					id: 'f1',
					text: 'Доверенность',
					virtual: false,
					children: [
						{ id: 'f1-1', text: 'Создать доверенность', virtual: false },
						{ id: 'f1-2', text: 'Журнал доверенностей', virtual: false },
					],
				},
				{
					id: 'f2',
					text: 'Договоры',
					virtual: false,
					children: [
						{ id: 'f2-1', text: 'Проекты договоров', virtual: false },
						{ id: 'f2-2', text: 'Подписанные договоры', virtual: false },
						{ id: 'f2-3', text: 'Архив', virtual: false },
					],
				},
				{
					id: 'f3',
					text: 'Документы',
					virtual: false,
					children: [
						{ id: 'f3-1', text: 'Входящие', virtual: false },
						{ id: 'f3-2', text: 'Исходящие', virtual: false },
					],
				},
				{
					id: 'f4',
					text: 'КЭДО',
					virtual: false,
					children: [
						{ id: 'f4-1', text: 'Заявления', virtual: false },
						{ id: 'f4-2', text: 'Приказы', virtual: false },
						{ id: 'f4-3', text: 'Архив КЭДО', virtual: false },
					],
				},
				{
					id: 'f5',
					text: 'Отчеты',
					virtual: false,
					children: [
						{ id: 'f5-1', text: 'Финансовые отчеты', virtual: false },
						{ id: 'f5-2', text: 'Аналитика', virtual: false },
					],
				},
				{
					id: 'f6',
					text: 'Папки подразделений',
					virtual: false,
					children: [
						{ id: 'f6-1', text: 'Отдел продаж', virtual: false },
						{ id: 'f6-2', text: 'Бухгалтерия', virtual: false },
						{ id: 'f6-3', text: 'HR', virtual: false },
					],
				},
				{
					id: 'f7',
					text: 'Папки пользователей',
					virtual: false,
					children: [
						{ id: 'f7-1', text: 'Мои документы', virtual: false },
						{ id: 'f7-2', text: 'Общие', virtual: false },
					],
				},
				{
					id: 'f8',
					text: 'Почтовый клиент',
					virtual: false,
					children: [
						{ id: 'f8-1', text: 'Входящие письма', virtual: false },
						{ id: 'f8-2', text: 'Отправленные', virtual: false },
						{ id: 'f8-3', text: 'Черновики', virtual: false },
					],
				},
				{
					id: 'f9',
					text: 'РЕШЕНИЯ',
					virtual: false,
					children: [
						{ id: 'f9-1', text: 'Текущие решения', virtual: false },
						{ id: 'f9-2', text: 'Архив решений', virtual: false },
					],
				},
				{
					id: 'f10',
					text: 'Служебные',
					virtual: false,
					children: [
						{ id: 'f10-1', text: 'Служебные записки', virtual: false },
						{ id: 'f10-2', text: 'Распоряжения', virtual: false },
					],
				},
				{
					id: 'f11',
					text: 'Структура папок',
					virtual: false,
					children: [
						{ id: 'f11-1', text: 'Шаблоны', virtual: false },
						{ id: 'f11-2', text: 'Настройки', virtual: false },
					],
				},
				{
					id: 'f12',
					text: 'Усовершенствованное согласование',
					virtual: false,
					children: [
						{ id: 'f12-1', text: 'Маршруты согласования', virtual: false },
						{ id: 'f12-2', text: 'История согласований', virtual: false },
						{ id: 'f12-3', text: 'Настройки', virtual: false },
					],
				},
				{
					id: 'f13',
					text: 'ЭДО',
					virtual: false,
					children: [
						{ id: 'f13-1', text: 'Входящие ЭДО', virtual: false },
						{ id: 'f13-2', text: 'Исходящие ЭДО', virtual: false },
					],
				},
				{
					id: 'f14',
					text: 'Экспериментальный',
					virtual: false,
					children: [
						{ id: 'f14-1', text: 'Тестовые функции', virtual: false },
						{ id: 'f14-2', text: 'Песочница', virtual: false },
						{ id: 'f14-3', text: 'Прототипы', virtual: false },
					],
				},
			],
		},
	])

	const viewData = ref([
		{
			id: '1',
			text: 'Представления',
			children: [
				{
					id: '1-1',
					text: 'Docsvision Showcase',
					children: [
						{
							id: '1-1-1',
							text: 'Задания',
							children: [
								{
									id: '1-1-1-1',
									text: 'Мои задания',
								},
								{
									id: '1-1-1-2',
									text: 'Просроченные задания',
								},
							],
						},
						{
							id: '1-1-2',
							text: 'Структура папок',
							children: [
								{
									id: '1-1-2-1',
									text: 'Календари сотрудников',
									children: [
										{
											id: '1-1-2-1-1',
											text: 'Календарь отдела продаж',
										},
									],
								},
								{
									id: '1-1-2-2',
									text: 'Отчет по сотрудникам',
									children: [
										{
											id: '1-1-2-2-1',
											text: 'Ежемесячный отчет',
										},
										{
											id: '1-1-2-2-2',
											text: 'Годовой отчет',
										},
									],
								},
							],
						},
					],
				},
			],
		},
		{
			id: '2',
			text: 'Документы',
			children: [
				{
					id: '2-1',
					text: 'Входящие документы',
				},
				{
					id: '2-2',
					text: 'Исходящие документы',
				},
			],
		},
		{
			id: '3',
			text: 'Задания',
			children: [
				{
					id: '3-1',
					text: 'Активные задания',
				},
				{
					id: '3-2',
					text: 'Архив заданий',
				},
			],
		},
		{
			id: '4',
			text: 'КЭДО',
			children: [
				{
					id: '4-1',
					text: 'Заявления сотрудников',
				},
				{
					id: '4-2',
					text: 'Кадровые документы',
				},
			],
		},
		{
			id: '5',
			text: 'МИД',
			children: [
				{
					id: '5-1',
					text: 'Межведомственные документы',
				},
			],
		},
		{
			id: '6',
			text: 'Отчеты',
			children: [
				{
					id: '6-1',
					text: 'Все задания - Диаграмма Динамика входящих',
					children: [
						{
							id: '6-1-1',
							text: 'Отчет за месяц',
						},
					],
				},
				{
					id: '6-2',
					text: 'Задания_Все задания Для диаграмм',
					children: [
						{
							id: '6-2-1',
							text: 'Статистика выполнения',
						},
						{
							id: '6-2-2',
							text: 'Сводный анализ',
						},
					],
				},
				{
					id: '6-3',
					text: 'Ознакомление',
					children: [
						{
							id: '6-3-1',
							text: 'Ознакомленные сотрудники',
						},
					],
				},
			],
		},
	])

	const menuData = ref([
		{
			id: 'root',
			text: 'Библиотека элементов',
			children: [
				{
					id: 'main',
					text: 'Кнопка / Главная',
					virtual: false,
					icon: 'mdi-button-cursor',
				},
				{
					id: 'conf',
					text: 'Кнопка / Настройки',
					virtual: false,
					icon: 'mdi-button-cursor',
				},
				{
					id: 'pin',
					text: 'Кнопка / Закрепить',
					icon: 'mdi-button-cursor',
					virtual: false,
					children: [],
				},
				{
					id: 'history',
					text: 'Кнопка / Недавние карточки',
					icon: 'mdi-button-cursor',
					virtual: false,
					children: [],
				},
				{
					id: 'search',
					text: 'Кнопка / Поиск',
					icon: 'mdi-button-cursor',
					virtual: false,
					children: [],
				},
				{
					id: 'divider',
					text: 'Разделитель',
					icon: 'mdi-minus',
					virtual: false,
					children: [],
				},
				{
					id: 'group',
					text: 'Группа',
					virtual: false,
					icon: 'mdi-folder-outline',
					children: [],
				},
				{
					id: 'button',
					text: 'Кнопка',
					virtual: false,
					children: [],
				},
				{
					id: 'folders',
					text: 'Каталог папок',
					virtual: false,
					children: [
						{
							id: 'f0',
							text: 'Виртуальная папка',
							virtual: true,
						},
						{
							id: 'f1',
							text: 'Доверенность',
							virtual: false,
							type: 0,
							children: [
								{ id: 'f1-1', text: 'Создать доверенность', type: 0, virtual: false },
								{ id: 'f1-2', text: 'Журнал доверенностей', type: 0, virtual: false },
							],
						},
						{
							id: 'f2',
							text: 'Договоры',
							virtual: false,
							type: 0,
							children: [
								{ id: 'f2-1', text: 'Проекты договоров', virtual: false, type: 0 },
								{ id: 'f2-2', text: 'Подписанные договоры', virtual: false, type: 0 },
								{ id: 'f2-3', text: 'Архив', virtual: false, type: 0 },
							],
						},
						{
							id: 'f3',
							text: 'Документы',
							virtual: false,
							type: 0,
							children: [
								{ id: 'f3-1', text: 'Входящие', virtual: false, type: 0 },
								{ id: 'f3-2', text: 'Исходящие', virtual: false, type: 0 },
							],
						},
						{
							id: 'f4',
							text: 'КЭДО',
							virtual: false,
							type: 0,
							children: [
								{ id: 'f4-1', text: 'Заявления', virtual: false, type: 0 },
								{ id: 'f4-2', text: 'Приказы', virtual: false, type: 0 },
								{ id: 'f4-3', text: 'Архив КЭДО', virtual: false, type: 0 },
							],
						},
						{
							id: 'f5',
							text: 'Отчеты',
							virtual: false,
							type: 0,
							children: [
								{ id: 'f5-1', text: 'Финансовые отчеты', virtual: false, type: 0 },
								{ id: 'f5-2', text: 'Аналитика', virtual: false, type: 0 },
							],
						},
						{
							id: 'f6',
							text: 'Папки подразделений',
							type: 0,
							virtual: false,
							children: [
								{ id: 'f6-1', text: 'Отдел продаж', virtual: false, type: 0 },
								{ id: 'f6-2', text: 'Бухгалтерия', virtual: false, type: 0 },
								{ id: 'f6-3', text: 'HR', virtual: false, type: 0 },
							],
						},
						{
							id: 'f7',
							text: 'Папки пользователей',
							type: 0,
							virtual: false,
							children: [
								{ id: 'f7-1', text: 'Мои документы', virtual: false, type: 0 },
								{ id: 'f7-2', text: 'Общие', virtual: false, type: 0 },
							],
						},
					],
				},
			],
		},
	])

	const menuPreview = ref([
		{
			id: 'glav',
			text: 'Главная',
			type: 'button',
			icon: 'mdi-home-roof',
		},
		{
			id: 'history',
			text: 'Недавние карточки',
			type: 'button',
			icon: 'mdi-history',
		},
		{
			id: 'search',
			text: 'Поиск',
			type: 'button',
			icon: 'mdi-magnify',
		},
	])

	const selectedMenuItem = ref<any>(null)

	const selectedMenuRow = useStorage('selectedMenuRow', null)

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
		return new Map(flatNodes.value.map((node) => [node.id, node]))
	})

	// Функция получения имени
	const getNameById = (id: string): string => {
		const node = nodesMap.value.get(id)
		if (id == '102') return 'Конструктор ролей'
		return node?.text || id
	}
	// Функция получения имени папки
	const getNameByFolderId = (id: string): string => {
		const node = nodesMap.value.get(id)
		if (id == '102') return 'Конструктор ролей'
		return node?.text || id
	}

	const getNodeById = (id: string) => {
		return nodesMap.value.get(id)
	}

	function updateTreeData(value: any[]) {
		treeData.value = value
	}

	function updateSelectedElement(updated: any) {
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
		folderData,
		viewData,
		menuData,
		menuPreview,
		selectedType,
		selectedElement,
		selectedMenuItem,
		selectedMenuRow,
		setSelectedElement,
		clearSelectedElement,
		updateTreeData,
		updateSelectedElement,
		selectedBranch,
		flatNodes,
		nodesMap,
		getNodeById,
		getNameById,
		getNameByFolderId,
	}
})
