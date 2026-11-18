import type { ICatalogNode, IProject } from './Types'

export const PROJECT_CATALOG: ICatalogNode[] = [
	{
		id: 'cards', label: 'Карточки', kind: 'group', children: [
			{
				id: 'base', label: 'Базовые объекты', kind: 'group', children: [
					{
						id: 'document', label: 'Документ', kind: 'view', children: [
							{ id: 'document-create', label: 'Создание документа', kind: 'layout' },
							{ id: 'document-view', label: 'Просмотр документа', kind: 'layout' },
							{ id: 'document-edit', label: 'Редактирование документа', kind: 'layout' },
						],
					},
					{
						id: 'task', label: 'Задание', kind: 'view', children: [
							{ id: 'task-execute', label: 'На исполнение', kind: 'layout' },
							{ id: 'task-read', label: 'Ознакомление УД (просмотр / редактирование)', kind: 'layout' },
						],
					},
				],
			},
			{
				id: 'office', label: 'Делопроизводство', kind: 'group', children: [
					{
						id: 'contract', label: 'Договор', kind: 'view', children: [
							{ id: 'contract-create', label: 'Создание договора', kind: 'layout' },
							{ id: 'contract-approve', label: 'Согласование договора с контрагентом', kind: 'layout' },
							{ id: 'contract-view', label: 'Просмотр договора', kind: 'layout' },
						],
					},
					{ id: 'incoming', label: 'Входящий документ', kind: 'view', children: [] },
				],
			},
		],
	},
	{
		id: 'directories', label: 'Справочники', kind: 'group', children: [
			{
				id: 'partners', label: 'Контрагенты', kind: 'view', children: [
					{ id: 'partners-list', label: 'Список контрагентов', kind: 'layout' },
					{ id: 'partners-details', label: 'Карточка контрагента', kind: 'layout' },
				],
			},
			{
				id: 'edi', label: 'Настройки оператора ЮЗДО', kind: 'view', children: [
					{ id: 'edi-operators', label: 'Операторы', kind: 'layout' },
					{ id: 'edi-departments', label: 'Подразделения контрагента', kind: 'layout' },
				],
			},
		],
	},
	{
		id: 'workspace', label: 'Рабочая область', kind: 'group', children: [
			{
				id: 'webframe', label: 'WebFrame', kind: 'group', children: [
					{
						id: 'home', label: 'Главная страница', kind: 'view', children: [
							{ id: 'home-default', label: 'Главная страница по умолчанию', kind: 'layout' },
							{ id: 'home-manager', label: 'Рабочая область руководителя', kind: 'layout' },
						],
					},
					{
						id: 'menu', label: 'Основное меню', kind: 'view', children: [
							{ id: 'menu-default', label: 'Меню по умолчанию', kind: 'layout' },
							{ id: 'menu-contracts', label: 'Меню работы с договорами', kind: 'layout' },
						],
					},
				],
			},
		],
	},
]

export const DEMO_PROJECTS: IProject[] = [
	{
		id: 'demo-stand', name: 'Демонстрационный стенд', version: '1.0', icon: '',
		mode: 'supplier', canChangeMode: true,
		layoutIds: ['document-create', 'task-read', 'home-manager'],
	},
	{
		id: 'contracts', name: 'Управление договорами', version: '2.1', icon: '',
		mode: 'supplier', canChangeMode: true,
		layoutIds: ['contract-create', 'contract-approve', 'menu-contracts'],
	},
	{
		id: 'base-solution', name: 'Базовое решение', version: '5.5.17', icon: '',
		mode: 'customer', canChangeMode: false,
		layoutIds: ['document-view', 'task-execute', 'home-default', 'menu-default'],
	},
	{
		id: 'edi-solution', name: 'Интеграция с операторами ЭДО', version: '1.2', icon: '',
		mode: 'customer', canChangeMode: true,
		layoutIds: ['edi-operators'],
	},
]
