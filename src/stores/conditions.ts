import { uid } from 'quasar'
import { Kind } from '@/types/enum'

const str = [
	{ word: true, text: 'содержит', selected: false },
	{ word: true, text: 'не содержит', selected: false },
	{ word: true, text: 'начинается', selected: false },
	{ word: true, text: 'оканчивается', selected: false },
	{ word: true, text: 'равно', selected: false },
	{ word: true, text: 'не равно', selected: false },
	{ word: true, text: 'задано', selected: false },
	{ word: true, text: 'не задано', selected: false },
]
const datee = [
	{ date: true, text: 'диапазон', selected: false },
	{ date: true, text: 'позже', selected: false },
	{ date: true, text: 'позже или равно', selected: false },
	{ date: true, text: 'раньше', selected: false },
	{ date: true, text: 'раньше или равно', selected: false },
	{ date: true, text: 'равно', selected: false },
	{ date: true, text: 'не равно', selected: false },
	{ date: true, text: 'задано', selected: false },
	{ date: true, text: 'не задано', selected: false },
]
const dWords = [
	{ text: 'сегодня', selected: false, plus: true, day: 'дн.' },
	{ text: 'сейчас', selected: false, plus: true, day: 'ч.' },
	{ text: 'текущая неделя', selected: false },
	{ text: 'текущий месяц', selected: false },
	{ text: 'текущий квартал', selected: false },
	{ text: 'текущий год', selected: false },
]

const stat = [
	{ word: false, text: 'равно', selected: false },
	{ word: false, text: 'не равно', selected: false },
	{ word: false, text: 'задано', selected: false },
	{ word: false, text: 'не задано', selected: false },
]

const exec = [
	{ exe: true, text: 'Активные заявки', selected: false},
	{ exe: true, text: 'Завершенные заявки', selected: false},
	{ exe: true, text: 'Просроченные заявки', selected: false},
]


const manDetails = [
	{
		id: uid(),
		man: true,
		text: 'Я',
		kind: Kind.Key,
		selected: false,
	},
	{
		id: uid(),
		man: true,
		text: 'Мои подчиненные',
		kind: Kind.Key,
		selected: false,
	},
	{
		id: uid(),
		man: true,
		text: 'Мой руководитель',
		kind: Kind.Key,
		selected: false,
	},
	{
		id: uid(),
		man: true,
		text: 'Фамилия',
		kind: Kind.Text,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Имя',
		kind: Kind.Text,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Отчество',
		kind: Kind.Text,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Дата рождения',
		kind: Kind.Text,
		date: true,
		selected: false,
		children: datee,
	},
	{
		id: uid(),
		man: true,
		text: 'Должность',
		kind: Kind.Text,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Руководитель',
		kind: Kind.Man,
		selected: false,
		// children: manDetails,
	},
	{
		id: uid(),
		man: true,
		text: 'Местный телефон',
		kind: Kind.Phone,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Домашний телефон',
		kind: Kind.Phone,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Факс',
		kind: Kind.Phone,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Номер паспорта',
		kind: Kind.Text,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Паспорт выдан',
		kind: Kind.Text,
		date: true,
		selected: false,
		children: datee,
	},
	{
		id: uid(),
		man: true,
		text: 'Комната',
		kind: Kind.Text,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Сотовый телефон',
		kind: Kind.Phone,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'IP телефон',
		kind: Kind.Phone,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Значимость',
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Email',
		kind: Kind.Email,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Организация',
		kind: Kind.Org,
		selected: false,
	},
	{
		id: uid(),
		man: true,
		text: 'Является руководителем',
		kind: Kind.Bool,
		ruk: true,
		selected: false,
	},
]
const manKeys = [
	{
		id: uid(),
		selected: false,
		text: 'Я',
		kind: Kind.Key,
	},
	{
		id: uid(),
		selected: false,
		text: 'Мои подчиненные',
		kind: Kind.Key,
	},
	{
		id: uid(),
		selected: false,
		text: 'Мой руководитель',
		kind: Kind.Key,
	},
]

const execute = [
	{ execute: true, text: 'Срок', selected: false, children: datee},
	{ execute: true, text: 'Исполнитель', selected: false, children: manDetails},
	{ execute: true, text: 'Состояние', selected: false, children: exec},

]

export { str, datee, dWords, manDetails, manKeys, stat, exec, execute }
