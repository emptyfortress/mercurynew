import { uid } from 'quasar'

const mystatus = [
	{ id: uid(), label: 'Подготовка', value: 'Подготовка' },
	{ id: uid(), label: 'На согласовании', value: 'На согласовании' },
	{ id: uid(), label: 'На доработке', value: 'На доработке' },
	{ id: uid(), label: 'Согласовано', value: 'Согласовано' },
]
const stat = [
	{ id: uid(), label: 'равно', value: 'равно', isSpecial: true, children: mystatus },
	{ id: uid(), label: 'не равно', value: 'не равно', isSpecial: true, children: mystatus },
	{ id: uid(), label: 'задано', value: 'задано' },
	{ id: uid(), label: 'не задано', value: 'не задано' },
	{ id: uid(), label: 'один из', value: 'один из', isSpecial: true, children: mystatus },
]
const datee = [
	{ date: true, id: uid(), label: 'диапазон', value: 'диапазон' },
	{ date: true, id: uid(), label: 'позже', value: 'позже' },
	{ date: true, id: uid(), label: 'позже или равно', value: 'позже или равно' },
	{ date: true, id: uid(), label: 'раньше', value: 'раньше' },
	{ date: true, id: uid(), label: 'раньше или равно', value: 'раньше или равно' },
	{ date: true, id: uid(), label: 'равно', value: 'равно' },
	{ date: true, id: uid(), label: 'не равно', value: 'не равно' },
	{ date: true, id: uid(), label: 'задано', value: 'задано' },
	{ date: true, id: uid(), label: 'не задано', value: 'не задано' },
]
const str = [
	{ id: uid(), label: 'содержит', value: 'содержит', isSpecial: true },
	{ id: uid(), label: 'не содержит', value: 'не содержит', isSpecial: true },
	{ id: uid(), label: 'начинается', value: 'начинается', isSpecial: true },
	{ id: uid(), label: 'оканчивается', value: 'оканчивается', isSpecial: true },
	{ id: uid(), label: 'равно', value: 'равно', isSpecial: true },
	{ id: uid(), label: 'не равно', value: 'не равно', isSpecial: true },
	{ id: uid(), label: 'задано', value: 'задано', isSpecial: true },
	{ id: uid(), label: 'не задано', value: 'не задано', isSpecial: true },
]

const manDetails2 = [
	{ id: uid(), label: 'Я', isKey: true },
	{ id: uid(), label: 'Мои подчиненные', isKey: true },
	{ id: uid(), label: 'Мой руководитель', isKey: true },
	{ id: 'fio', label: 'Иванов', isPeople: true },
	{ id: '2', label: 'Петров', isPeople: true },
	{ id: '3', label: 'Сидоров', isPeople: true },
	{ id: '4', label: 'Смирнов', isPeople: true },
	{ id: '5', label: 'Кузнецов', isPeople: true },
	{ id: '6', label: 'Попов', isPeople: true },
	{ id: '7', label: 'Лебедев', isPeople: true },
	{ id: '8', label: 'Козлов', isPeople: true },
	{ id: '9', label: 'Новиков', isPeople: true },
	{ id: '10', label: 'Морозов', isPeople: true },
	{ id: '11', label: 'Волков', isPeople: true },
	{ id: '12', label: 'Соловьёв', isPeople: true },
	{ id: '13', label: 'Васильев', isPeople: true },
	{ id: '14', label: 'Зайцев', isPeople: true },
	{ id: '15', label: 'Павлов', isPeople: true },
	{ id: '16', label: 'Семёнов', isPeople: true },
	{ id: '17', label: 'Голубев', isPeople: true },
	{ id: '18', label: 'Виноградов', isPeople: true },
	{ id: '19', label: 'Богданов', isPeople: true },
	{ id: '20', label: 'Воробьёв', isPeople: true },
	{ id: '21', label: 'Фёдоров', isPeople: true },
	{ id: '22', label: 'Михайлов', isPeople: true },
	{ id: '23', label: 'Беляев', isPeople: true },
	{ id: '24', label: 'Тарасов', isPeople: true },
	{ id: '25', label: 'Белов', isPeople: true },
	{ id: '26', label: 'Комаров', isPeople: true },
	{ id: '27', label: 'Орлов', isPeople: true },
	{ id: '28', label: 'Киселёв', isPeople: true },
	{ id: '29', label: 'Макаров', isPeople: true },
	{ id: '30', label: 'Николаев', isPeople: true },
]

const manDetails1 = [
	{ id: uid(), label: 'равно', value: 'равно', isSpecial: true, children: manDetails2 },
	{ id: uid(), label: 'не равно', value: 'не равно', isSpecial: true, children: manDetails2 },
	{ id: uid(), label: 'один из', value: 'один из', isSpecial: true, children: manDetails2 },
	{ id: uid(), label: 'задано', value: 'задано' },
	{ id: uid(), label: 'не задано', value: 'не задано' },
	{ id: 'fio', label: 'Фамилия', children: str },
	{ id: uid(), label: 'Имя', children: str },
	{ id: uid(), label: 'Отчество', children: str },
	{ id: uid(), label: 'Дата рождения', children: datee },
	{ id: uid(), label: 'Должность', children: str },
	{ id: uid(), label: 'Местный телефон', children: str },
	{ id: uid(), label: 'Домашний телефон', children: str },
	{ id: uid(), label: 'Факс', children: str },
	{ id: uid(), label: 'Номер паспорта', children: str },
	{ id: uid(), label: 'Паспорт выдан', children: datee },
	{ id: uid(), label: 'Комната', children: str },
	{ id: uid(), label: 'Сотовый телефон', children: str },
	{ id: uid(), label: 'IP телефон', children: str },
	{ id: uid(), label: 'Значимость', children: str },
	{ id: uid(), label: 'Email', children: str },
	{ id: uid(), label: 'Организация' },
	{ id: uid(), label: 'Является руководителем' },
]

const exec = [
	{ value: 'Все', id: uid(), label: 'Все' },
	{ value: 'Незавершено', id: uid(), label: 'Незавершено' },
	{ value: 'Завершено', id: uid(), label: 'Завершено' },
]
const execute = [
	{ id: uid(), label: 'Срок', value: 'Срок', children: datee },
	{ id: uid(), label: 'Исполнитель', value: 'Исполнитель', children: manDetails1 },
	{ id: uid(), label: 'Состояние ?', value: 'Состояние ?', children: exec },
	{ id: uid(), label: 'Текущий этап', value: 'Текущий этап' },
]
const zero = [
	{ id: uid(), label: 'Автор', children: manDetails1 },
	{ id: uid(), label: 'Название', children: str },
	{ id: uid(), label: 'Описание', children: str },
	{ id: uid(), label: 'Дата начала отпуска', children: datee },
	{ id: uid(), label: 'Дата окончания отпуска', children: datee },
	{ id: uid(), label: 'Комментарий', children: str },
	{ id: uid(), label: 'Статус', children: stat },
	{ id: uid(), label: 'Исполнение', children: execute },
]

export { zero }
