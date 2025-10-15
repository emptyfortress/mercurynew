function addDays(baseDate: Date, days: number) {
	const date = new Date(baseDate)
	date.setDate(date.getDate() + days)
	return date
}

function addWorkDays(baseDate: Date, workDays: number) {
	const date = new Date(baseDate)
	let remaining = Math.abs(workDays)
	const direction = workDays >= 0 ? 1 : -1

	while (remaining > 0) {
		date.setDate(date.getDate() + direction)
		const day = date.getDay()
		if (day !== 0 && day !== 6) {
			// 0 — воскресенье, 6 — суббота
			remaining--
		}
	}
	return date
}

const now = new Date()

const events = [
	{
		id: 1,
		sideId: 'Event_1t7b10m',
		role: 'Инициатор',
		name: 'Создал заявку',
		fio: 'Орлов П.С.',
		start: addWorkDays(now, -16),
		end: addWorkDays(now, -16),
		type: 'point',
		className: 'start',
		editable: false,
	},
	{
		id: 2,
		sideId: 'Activity_13ysreu',
		role: 'Руководитель',
		name: 'Согласовать заявку',
		fio: 'Соколов С.П.',
		start: addWorkDays(now, -15),
		end: addWorkDays(now, -12),
		type: 'range',
		editable: false,
	},
	{
		id: 3,
		sideId: 'Activity_0kpt2qn',
		role: 'Инициатор',
		fio: 'Орлов П.С.',
		name: 'Исправить заявку',
		start: addWorkDays(now, -12),
		end: addWorkDays(now, -7),
		type: 'range',
		editable: false,
	},
	{
		id: 4,
		sideId: 'Activity_13ysreu',
		role: 'Руководитель',
		name: 'Согласовать заявку',
		fio: 'Соколов С.П.',
		start: addWorkDays(now, -7),
		end: addWorkDays(now, -4),
		type: 'range',
		editable: false,
	},
	{
		id: 5,
		sideId: 'Activity_0vjxzxe',
		role: 'Рассматривающий',
		fio: 'Воронин A.A.',
		name: 'Рассмотреть заявку',
		start: addWorkDays(now, -4),
		end: now,
		type: 'range',
		current: true,
		editable: {
			updateTime: true,
			updateGroup: false,
			remove: false,
		},
	},
]

const goodFinish: MyEvent[] = [
	{
		id: 6,
		sideId: 'Activity_1xr02p6',
		role: 'Исполнитель',
		fio: 'Соловьев Б.Я.',
		name: 'Исполнить заявку',
		start: now,
		end: addWorkDays(now, 3),
		type: 'range',
		className: 'forecast-item item-6',
		editable: { updateTime: true, updateGroup: false, remove: false },
	},
	{
		id: 7,
		sideId: 'Activity_1rqtd62',
		role: 'Инициатор',
		fio: 'Соколов С.П.',
		name: 'Принять результаты',
		start: addWorkDays(now, 3),
		end: addWorkDays(now, 5),
		type: 'range',
		className: 'forecast-item item-7',
		editable: { updateTime: true, updateGroup: false, remove: false },
	},
	{
		id: 8,
		sideId: 'Event_1wwtnaa',
		role: 'Инициатор',
		fio: 'Орлов П.С.',
		name: 'Заявка выполнена',
		start: addWorkDays(now, 5),
		end: addWorkDays(now, 5),
		type: 'point',
		className: 'start item-8',
		editable: { updateTime: false, updateGroup: false, remove: false },
	},
]

const badFinish: MyEvent[] = [
	{
		id: 9,
		sideId: 'Activity_0obo0kc',
		role: 'Инициатор',
		fio: '',
		name: 'Обработать отказ',
		start: now,
		end: addWorkDays(now, 1),
		type: 'range',
		className: 'forecast-item item-9',
	},
	{
		id: 10,
		sideId: 'Event_1yi1uuk',
		role: 'Инициатор',
		fio: 'Орлов П.С.',
		name: 'Заявка отменена',
		start: addWorkDays(now, 1),
		end: addWorkDays(now, 1),
		type: 'point',
		className: 'start item-10',
	},
]

const goodHightlights = ['Flow_18z4ruq', 'Flow_1il0hqn', 'Flow_1w67ag7', 'Flow_14xgday']
const badHightlights = ['Flow_18z4ruq', 'Flow_0y6nr5i', 'Flow_1vjwrgg', 'Flow_1y5q21t']

export { events, goodFinish, badFinish, goodHightlights, badHightlights }
