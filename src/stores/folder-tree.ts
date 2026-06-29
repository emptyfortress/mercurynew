import { reactive } from 'vue'

export interface FolderNode {
	id: number
	text: string
	noTick?: boolean
	disabled?: boolean
	locked?: boolean
	children?: FolderNode[]
}

const tree = reactive([
	{
		id: 0,
		text: 'Область поиска',
		noTick: true,
		children: [
			{
				id: 1,
				text: 'Личная папка',
			},
			{
				id: 2,
				text: 'Папки',
				children: [
					{
						id: 3,
						text: 'Архив документов',
					},
					{
						id: 4,
						text: 'Документы общего пользования',
					},
					{
						id: 5,
						text: 'Карточки документов',
					},
					{
						id: 6,
						text: 'Категории документов',
					},
					{
						id: 7,
						text: 'Папки подразделений',
						children: [
							{
								id: 8,
								text: 'Бухгалтерия',
							},
							{
								id: 9,
								text: 'Дирекция',
							},
							{
								id: 10,
								text: 'Коммерческий отдел',
							},
							{
								id: 11,
								text: 'Отдел IT',
							},
							{
								id: 12,
								text: 'Отдел дизайна',
							},
							{
								id: 13,
								text: 'Отдел закупки сырья',
							},
							{
								id: 14,
								text: 'Отдел по работе с клиентами',
							},
							{
								id: 15,
								text: 'Секретариат',
							},
						],
					},
					{
						id: 16,
						text: 'Рабочие календари подразделений и сотрудников',
					},
					{
						id: 17,
						text: 'Шаблоны документов',
					},
				],
			},
			{
				id: 18,
				text: 'Шанина С. В.',
			},
		],
	},
])

export { tree }
