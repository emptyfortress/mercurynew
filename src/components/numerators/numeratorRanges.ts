import type { INumeratorDraft, INumeratorRange } from './types'

export function getNumeratorRangeError(
	range: INumeratorRange,
	ranges: INumeratorRange[],
	bounds: INumeratorDraft
) {
	if (!range.owner?.trim()) return 'Выберите владельца диапазона'
	const { lowerBound: lower, upperBound: upper } = range
	if (lower === null || upper === null ||
		!Number.isSafeInteger(lower) || !Number.isSafeInteger(upper)) {
		return 'Укажите целые числа в обеих границах диапазона'
	}
	if (lower > upper) return 'Начало диапазона должно быть не больше конца'
	if (bounds.lowerBound !== null && lower < bounds.lowerBound ||
		bounds.upperBound !== null && upper > bounds.upperBound) {
		return 'Диапазон должен находиться внутри общих границ нумератора'
	}
	if (ranges.some((other) => other.id !== range.id &&
		other.lowerBound !== null && other.upperBound !== null &&
		Number.isSafeInteger(other.lowerBound) && Number.isSafeInteger(other.upperBound) &&
		other.lowerBound <= other.upperBound &&
		lower <= other.upperBound && upper >= other.lowerBound)) {
		return 'Диапазон пересекается с другим диапазоном'
	}
	return ''
}
