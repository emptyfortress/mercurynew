import type {
	INumeratorAffix,
	INumeratorCondition,
	INumeratorRuleVariant,
	NumerationFieldType,
	NumerationOperator,
} from './types'

const BASE_OPERATORS: { label: string; value: NumerationOperator }[] = [
	{ label: 'Равно', value: 'equals' },
	{ label: 'Не равно', value: 'notEquals' },
]
const EMPLOYEE_OPERATORS: { label: string; value: NumerationOperator }[] = [
	{ label: 'В подразделении', value: 'inDepartment' },
	{ label: 'Не в подразделении', value: 'notInDepartment' },
	{ label: 'В дочернем подразделении', value: 'inChildDepartment' },
]

export function getConditionOperators(type?: NumerationFieldType) {
	return type === 'employee' ? [...BASE_OPERATORS, ...EMPLOYEE_OPERATORS] : BASE_OPERATORS
}

export function createRuleVariant(): INumeratorRuleVariant {
	return {
		id: crypto.randomUUID(),
		numeratorId: null,
		conditions: [],
		prefix: { mode: 'text', text: '', xslt: '' },
		suffix: { mode: 'text', text: '', xslt: '' },
	}
}

export function createCondition(): INumeratorCondition {
	return { id: crypto.randomUUID(), field: null, operator: 'equals', value: null }
}

export function isValidCondition(condition: INumeratorCondition, cardType: string | null) {
	const { field, value, operator } = condition
	if (!field || field.cardType !== cardType) return false
	if (!getConditionOperators(field.type).some((option) => option.value === operator)) return false
	if (value === null || value === undefined) return false
	if (field.type === 'number') return typeof value === 'number' && Number.isFinite(value)
	if (field.type === 'boolean') return typeof value === 'boolean'
	if (typeof value !== 'string' || !value.trim()) return false
	if (field.type === 'date') {
		return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
			!Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
	}
	return true
}

export function isValidVariant(variant: INumeratorRuleVariant, cardType: string | null) {
	return variant.conditions.every((condition) => isValidCondition(condition, cardType)) &&
		[variant.prefix, variant.suffix].every((affix) => affix.mode === 'text' || !!affix.xslt.trim())
}

export function getAffixSchema(affix: INumeratorAffix, label: string) {
	return affix.mode === 'xslt' ? `⟨${label} XSLT⟩` : affix.text
}

export function getNumberSchema(variant: INumeratorRuleVariant) {
	return getAffixSchema(variant.prefix, 'префикс') + '[номер]' +
		getAffixSchema(variant.suffix, 'суффикс')
}

export function getConditionsSummary(conditions: INumeratorCondition[]) {
	if (!conditions.length) return 'Без условий'
	return conditions.map((condition) => {
		if (!condition.field) return 'Поле не выбрано'
		const field = condition.field.label
		const operation = getConditionOperators(condition.field.type)
			.find((option) => option.value === condition.operator)?.label ?? ''
		const value = condition.value === null ? '…'
			: typeof condition.value === 'boolean' ? (condition.value ? 'Да' : 'Нет')
				: String(condition.value)
		return `${field} ${operation.toLocaleLowerCase('ru')} ${value}`
	}).join(' И ')
}

export function getConditionParts(condition: INumeratorCondition) {
	const field = condition.field?.label ?? 'Поле не выбрано'
	const operation = getConditionOperators(condition.field?.type)
		.find((option) => option.value === condition.operator)?.label?.toLocaleLowerCase('ru') ?? ''
	const value = condition.value === null ? '…'
		: typeof condition.value === 'boolean' ? (condition.value ? 'Да' : 'Нет')
			: String(condition.value)
	return { field, operation, value }
}
