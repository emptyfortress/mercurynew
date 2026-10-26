import type { ProcessVariable } from './processVariables'

export const processValueTypes = [
	'Строка', 'Целое число', 'Дробное число', 'Логический', 'Дата и время', 'Сотрудник DV',
] as const

export type ProcessValueType = typeof processValueTypes[number]
export type LiteralProcessValue = { source: 'literal'; value: string | number | boolean }
export type ProcessValue =
	| null
	| { source: 'variable'; variableId: string }
	| LiteralProcessValue
	| { source: 'directory'; directory: 'employees'; itemId: string; label: string }

export function parseLiteralInput(type: ProcessValueType, input: string): LiteralProcessValue | null {
	if (type === 'Строка') return { source: 'literal', value: input }
	const text = input.trim().replace(',', '.')
	const pattern = type === 'Целое число' ? /^[+-]?\d+$/ : /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/
	if (type !== 'Целое число' && type !== 'Дробное число') return null
	if (!pattern.test(text)) return null
	const value = Number(text)
	if (!Number.isFinite(value) || (type === 'Целое число' && !Number.isSafeInteger(value))) return null
	return { source: 'literal', value }
}

export function isLocalDateTime(value: string): boolean {
	const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value)
	if (!match) return false
	const date = new Date(value)
	const [, year, month, day, hour, minute, second = '0'] = match
	return date.getFullYear() === Number(year) && date.getMonth() + 1 === Number(month)
		&& date.getDate() === Number(day) && date.getHours() === Number(hour)
		&& date.getMinutes() === Number(minute) && date.getSeconds() === Number(second)
}

export function matchingVariables(variables: ProcessVariable[], type: ProcessValueType): ProcessVariable[] {
	return variables.filter((variable) => variable.type === type && !variable.isCollection)
}

export function processValueError(value: ProcessValue, type: ProcessValueType, variables: ProcessVariable[]): string {
	if (value === null) return ''
	if (value.source === 'variable') {
		return matchingVariables(variables, type).some((variable) => variable.id === value.variableId)
			? '' : 'Переменная недоступна'
	}
	if (value.source === 'directory') {
		return type === 'Сотрудник DV' && value.directory === 'employees' && value.itemId && value.label
			? '' : 'Значение не соответствует типу'
	}
	const literal = value.value
	const valid = type === 'Строка' ? typeof literal === 'string'
		: type === 'Целое число' ? typeof literal === 'number' && Number.isSafeInteger(literal)
		: type === 'Дробное число' ? typeof literal === 'number' && Number.isFinite(literal)
		: type === 'Логический' ? typeof literal === 'boolean'
		: type === 'Дата и время' ? typeof literal === 'string' && isLocalDateTime(literal)
		: false
	return valid ? '' : 'Значение не соответствует типу'
}

export function processValueLabel(value: Exclude<ProcessValue, null>, variables: ProcessVariable[], type: ProcessValueType): string {
	if (value.source === 'variable') return variables.find((variable) => variable.id === value.variableId)?.name ?? 'Переменная недоступна'
	if (value.source === 'directory') return value.label
	if (typeof value.value === 'boolean') return value.value ? 'Да' : 'Нет'
	if (value.value === '') return 'Пустая строка'
	return type === 'Дата и время' ? String(value.value).replace('T', ' ') : String(value.value)
}
