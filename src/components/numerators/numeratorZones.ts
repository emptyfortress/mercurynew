import type { INumeratorZoneSettings } from './types'

export function createZoneSettings(): INumeratorZoneSettings {
	return {
		period: 'none', interval: 1, firstZoneDate: '', weekday: 1, dayOfMonth: 1, month: 1,
	}
}

export function getZoneSettingsError(settings: INumeratorZoneSettings) {
	if (settings.period === 'none') return ''
	if (!['day', 'week', 'month', 'year'].includes(settings.period)) {
		return 'Выберите период смены зон'
	}
	if (settings.interval === null || !Number.isSafeInteger(settings.interval) ||
		settings.interval < 1) return 'Интервал должен быть целым числом от 1'
	const date = settings.firstZoneDate
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) ||
		new Date(date).toISOString().slice(0, 10) !== date) return 'Укажите дату первой зоны'
	if (settings.period === 'week' &&
		(!Number.isInteger(settings.weekday) || settings.weekday < 1 || settings.weekday > 7)) {
		return 'Выберите день недели'
	}
	if (['month', 'year'].includes(settings.period)) {
		const day = settings.dayOfMonth
		if (day === null || !Number.isInteger(day) || day < 1 || day > 31) {
			return 'День месяца должен быть целым числом от 1 до 31'
		}
		if (settings.period === 'year') {
			if (!Number.isInteger(settings.month) || settings.month < 1 || settings.month > 12) {
				return 'Выберите месяц'
			}
			const days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
			if (day > days[settings.month - 1]!) return 'В выбранном месяце нет такого дня'
		}
	}
	return ''
}
