import { uid } from 'quasar'
import { Kind } from '@/types/enum'

const zero = [
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Тема',
		kind: Kind.String,
		type: 1,
		level: 1,
		selected: false,
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Номер',
		kind: Kind.Num,
		type: 1,
		level: 1,
		selected: false,
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Дата регистрации',
		kind: Kind.Date,
		type: 1,
		level: 1,
		selected: false,
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Регистратор',
		kind: Kind.Man,
		type: 1,
		level: 1,
		selected: false,
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Подготовил',
		kind: Kind.Man,
		type: 1,
		level: 1,
		selected: false,
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Содержание',
		kind: Kind.Text,
		type: 1,
		level: 1,
		selected: false,
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Согласующие',
		kind: Kind.Man,
		type: 1,
		level: 1,
		selected: false,
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Подписывают',
		kind: Kind.Man,
		type: 1,
		level: 1,
		selected: false,
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Получатели',
		kind: Kind.Org,
		type: 1,
		level: 1,
		selected: false,
		children: [
			{
				id: uid(),
				parents: ['Документ', 'Исходящий', 'Получатели'],
				text: 'Контактное лицо',
				kind: Kind.Man,
				type: 1,
				level: 2,
				selected: false,
			},
			{
				id: uid(),
				parents: ['Документ', 'Исходящий', 'Получатели'],
				text: 'Организация',
				kind: Kind.Org,
				type: 1,
				level: 2,
				selected: false,
			},
			{
				id: uid(),
				parents: ['Документ', 'Исходящий', 'Получатели'],
				text: 'Телефон',
				kind: Kind.Phone,
				type: 1,
				level: 2,
				selected: false,
			},
			{
				id: uid(),
				parents: ['Документ', 'Исходящий', 'Получатели'],
				text: 'Email',
				kind: Kind.Email,
				type: 1,
				level: 2,
				selected: false,
			},
		],
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Состояние',
		kind: Kind.Status,
		type: 1,
		level: 1,
		selected: false,
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Заданиe',
		kind: Kind.Link,
		type: 1,
		level: 1,
		selected: false,
	},
	{
		id: uid(),
		parents: ['Документ', 'Исходящий'],
		text: 'Группа заданий',
		kind: Kind.Link,
		type: 1,
		level: 1,
		selected: false,
	},
]

export { zero }
