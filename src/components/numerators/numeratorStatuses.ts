import type {
	INumerator, INumeratorNumberRow, INumeratorNumberTarget, INumeratorStatusQuery,
	NumeratorNumberOperation, NumeratorNumberStatus, NumeratorOccupancy,
} from './types'

export const NUMBER_STATUSES: { value: NumeratorNumberStatus; label: string; color: string }[] = [
	{ value: 'free', label: 'Свободен', color: 'green-1' },
	{ value: 'occupied', label: 'Занят', color: 'orange-2' },
	{ value: 'reserved', label: 'Зарезервирован', color: 'blue-1' },
	{ value: 'nonexistent', label: 'Не существует', color: 'grey-3' },
]

export function getNumberStatus(
	numerator: INumerator, occupancy: NumeratorOccupancy, target: INumeratorNumberTarget
): NumeratorNumberStatus {
	const { number, zoneId } = target
	if (!Number.isSafeInteger(number) || numerator.lowerBound === null ||
		numerator.upperBound === null || number < numerator.lowerBound ||
		number > numerator.upperBound) return 'nonexistent'
	if (occupancy[zoneId]?.includes(number)) return 'occupied'
	if (numerator.ranges.some((range) => range.lowerBound !== null && range.upperBound !== null &&
		number >= range.lowerBound && number <= range.upperBound)) return 'reserved'
	return 'free'
}

export function getStatusQueryError(numerator: INumerator, query: INumeratorStatusQuery) {
	const { lowerBound: lower, upperBound: upper } = query
	if (lower === null || upper === null || !Number.isSafeInteger(lower) ||
		!Number.isSafeInteger(upper)) return 'Укажите целые числа в границах запроса'
	if (lower > upper) return 'Начало запроса должно быть не больше конца'
	if (!query.statuses.length) return 'Выберите хотя бы один статус'
	const zones = numerator.zones.filter((zone) => query.zoneId === null || zone.id === query.zoneId)
	if (!zones.length) return 'В выбранном нумераторе нет сохранённых зон для запроса'
	if ((upper - lower + 1) * zones.length > 1000) {
		return 'Запрос ограничен 1000 номерами с учётом всех зон. Уменьшите диапазон или выберите зону.'
	}
	return ''
}

export function queryNumberStatuses(
	numerator: INumerator, occupancy: NumeratorOccupancy, query: INumeratorStatusQuery
): INumeratorNumberRow[] {
	if (getStatusQueryError(numerator, query)) return []
	return numerator.zones.filter((zone) => query.zoneId === null || zone.id === query.zoneId)
		.flatMap((zone) => Array.from({ length: query.upperBound! - query.lowerBound! + 1 }, (_, i) => {
			const target = { zoneId: zone.id, number: query.lowerBound! + i }
			return { ...target, key: `${zone.id}:${target.number}`, zoneName: zone.name,
				status: getNumberStatus(numerator, occupancy, target) }
		})).filter((row) => query.statuses.includes(row.status))
}

export function applyNumberOperation(
	numerator: INumerator, occupancy: NumeratorOccupancy,
	operation: NumeratorNumberOperation, targets: INumeratorNumberTarget[]
): NumeratorOccupancy {
	const result = Object.fromEntries(Object.entries(occupancy).map(([id, numbers]) => [id, [...numbers]]))
	const sourceStatus = operation === 'occupy' ? 'free' : 'occupied'
	for (const target of targets) {
		if (!numerator.zones.some((zone) => zone.id === target.zoneId) ||
			getNumberStatus(numerator, result, target) !== sourceStatus) continue
		const numbers = result[target.zoneId] ?? []
		result[target.zoneId] = operation === 'occupy' ? [...numbers, target.number]
			: numbers.filter((number) => number !== target.number)
	}
	return result
}

export function formatNumberRuns(values: number[]) {
	const numbers = [...new Set(values)].sort((a, b) => a - b)
	const parts: string[] = []
	for (let i = 0; i < numbers.length; i++) {
		const start = numbers[i]!
		let end = start
		while (i + 1 < numbers.length && numbers[i + 1] === end + 1) end = numbers[++i]!
		parts.push(start === end ? String(start) : `${start}–${end}`)
	}
	return parts.join(', ')
}
