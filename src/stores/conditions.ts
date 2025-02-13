import { uid } from 'quasar'
import { Kind } from '@/types/enum'

const str = [
	{ kind: Kind.Selector, word: true, text: 'содержит', value: 'содержит', label: 'содержит', selected: false },
	{ kind: Kind.Selector, word: true, text: 'не содержит', value: 'не содержит', label: 'не содержит', selected: false },
	{ kind: Kind.Selector, word: true, text: 'начинается', value: 'начинается', label: 'начинается', selected: false },
	{ kind: Kind.Selector, word: true, text: 'оканчивается', value: 'оканчивается', label: 'оканчивается', selected: false },
	{ kind: Kind.Selector, word: true, text: 'равно', value: 'равно', label: 'равно', selected: false },
	{ kind: Kind.Selector, word: true, text: 'не равно', value: 'не равно', label: 'не равно', selected: false },
	{ kind: Kind.Selector, word: true, text: 'задано', value: 'задано', label: 'задано', selected: false },
	{ kind: Kind.Selector, word: true, text: 'не задано', value: 'не задано', label: 'не задано', selected: false },
]
const datee = [
	{ kind: Kind.Selector, date: true, label: 'диапазон', value: 'диапазон', text: 'диапазон', selected: false },
	{ kind: Kind.Selector, date: true, label: 'позже', value: 'позже', text: 'позже', selected: false },
	{ kind: Kind.Selector, date: true, label: 'позже или равно', value: 'позже или равно', text: 'позже или равно', selected: false },
	{ kind: Kind.Selector, date: true, label: 'раньше', value: 'раньше', text: 'раньше', selected: false },
	{ kind: Kind.Selector, date: true, label: 'раньше или равно', value: 'раньше или равно', text: 'раньше или равно', selected: false },
	{ kind: Kind.Selector, date: true, label: 'равно', value: 'равно', text: 'равно', selected: false },
	{ kind: Kind.Selector, date: true, label: 'не равно', value: 'не равно', text: 'не равно', selected: false },
	{ kind: Kind.Selector, date: true, label: 'задано', value: 'задано', text: 'задано', selected: false },
	{ kind: Kind.Selector, date: true, label: 'не задано', value: 'не задано', text: 'не задано', selected: false },
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
	{ kind: Kind.Selector2, st: true, label: 'равно', value: 'равно', text: 'равно', selected: false },
	{ kind: Kind.Selector2, st: true, label: 'не равно', value: 'не равно', text: 'не равно', selected: false },
	{ kind: Kind.Selector2, st: true, label: 'задано', value: 'задано', text: 'задано', selected: false },
	{ kind: Kind.Selector2, st: true, label: 'не задано', value: 'не задано', text: 'не задано', selected: false },
]

const mystatus = [
	{ kind: Kind.Selector1, st: true, label: 'Подготовка', value: 'Подготовка', text: 'Подготовка', selected: false },
	{ kind: Kind.Selector1, st: true, label: 'На согласовании', value: 'На согласовании', text: 'На согласовании', selected: false },
	{ kind: Kind.Selector1, st: true, label: 'На доработке', value: 'На доработке', text: 'На доработке', selected: false },
	{ kind: Kind.Selector1, st: true, label: 'Согласовано', value: 'Согласовано', text: 'Согласовано', selected: false },
]

const exec = [
	{ exe: true, text: 'Активные заявки', selected: false },
	{ exe: true, text: 'Завершенные заявки', selected: false },
	{ exe: true, text: 'Просроченные заявки', selected: false },
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
		kind: Kind.Date,
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
	// {
	// 	id: uid(),
	// 	man: true,
	// 	text: 'Руководитель',
	// 	kind: Kind.Man,
	// 	selected: false,
	// 	// children: manDetails,
	// },
	{
		id: uid(),
		man: true,
		text: 'Местный телефон',
		kind: Kind.Text,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Домашний телефон',
		kind: Kind.Text,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'Факс',
		kind: Kind.Text,
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
		kind: Kind.Text,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		man: true,
		text: 'IP телефон',
		kind: Kind.Text,
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
		kind: Kind.Text,
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
	{ execute: true, text: 'Срок', selected: false, children: datee },
	{ execute: true, text: 'Исполнитель', selected: false, children: manDetails },
	{ execute: true, text: 'Состояние', selected: false, children: exec },

]

export { str, datee, dWords, manDetails, manKeys, stat, mystatus, exec, execute }
