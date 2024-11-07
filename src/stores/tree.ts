const myApps = [
	{
		id: 0,
		text: 'Мои приложения',
		descr: '',
		hidden: false,
		type: 0,
		selected: true,
		children: [
			{
				id: 3,
				text: 'Заявление на отпуск',
				card: '',
				descr: 'Согласование отпуска',
				hidden: false,
				selected: false,
				type: 1,
				version: '0.0.0',
				forms: [
					{
						id: 0,
						name: 'Создание',
						role: 'Инициатор',
						layout: [
							{
								x: 1,
								y: 0,
								w: 10,
								h: 4,
								i: 0,
								selected: false,
							},
						],
					},
				],
			},
		],
	},
]

const flatApp = [
	{
		id: '0',
		label: 'Приложение 0',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		type: 0,
		group: null
	},
	{
		id: '1',
		label: 'Приложение 1',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		type: 0,
		group: null
	},
	{
		id: '2',
		label: 'Приложение 2',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		type: 0,
		group: null
	},
	{
		id: '3',
		label: 'Приложение 3',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		type: 0,
		group: null
	},
	{
		id: '4',
		label: 'Приложение 4',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		type: 0,
		group: null
	},
	{
		id: '5',
		label: 'Приложение 5',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		type: 0,
		group: null
	},
]

const etaps = [
	{ id: 0, label: 'Создал заявку', selected: false },
	{ id: 1, label: 'Согласовать заявку', selected: false },
	{ id: 2, label: 'Исправить заявку', selected: false },
	{ id: 3, label: 'Рассмотреть заявку', selected: false },
	{ id: 4, label: 'Обработать отказ', selected: false },
	{ id: 5, label: 'Исполнить заявку', selected: false },
	{ id: 6, label: 'Принять результаты', selected: false },
	{ id: 7, label: 'Заявка отменена', selected: false },
	{ id: 8, label: 'Заявка выполнена', selected: false },
]
const forms = [
	{ id: 0, label: 'Создал заявку', selected: false },
	{ id: 1, label: 'Согласовать заявку', selected: false },
	{ id: 2, label: 'Исправить заявку', selected: false },
	{ id: 3, label: 'Рассмотреть заявку', selected: false },
	{ id: 4, label: 'Обработать отказ', selected: false },
	{ id: 5, label: 'Исполнить заявку', selected: false },
	{ id: 6, label: 'Принять результаты', selected: false },
	{ id: 7, label: 'Заявка отменена', selected: false },
	{ id: 8, label: 'Заявка выполнена', selected: false },
]

const requests = [
	{ id: 0, label: 'Все карточки', descr: 'все доступные карточки', long: '', selected: false },
	{ id: 1, label: 'Реестр 1', descr: 'Описание 1', long: '', selected: false },
	{ id: 2, label: 'Реестр 2', descr: 'Описание 2', long: '', selected: false },
	{ id: 3, label: 'Реестр 3', descr: 'Описание 3', long: '', selected: false },
	{ id: 4, label: 'Реестр 4', descr: 'Описание 4', long: '', selected: false },
]

export { myApps, etaps, forms, requests, flatApp }
