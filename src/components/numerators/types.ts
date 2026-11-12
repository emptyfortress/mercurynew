export interface INumeratorRuleDraft {
	name: string
	cardType: string | null
	showLeadingZeros: boolean
}

export interface INumeratorRule extends INumeratorRuleDraft {
	id: string
	variants: INumeratorRuleVariant[]
}

export interface INumeratorRuleVariant {
	id: string
	numeratorId: string | null
	conditions: INumeratorCondition[]
	prefix: INumeratorAffix
	suffix: INumeratorAffix
}

export type NumerationFieldType =
	| 'text'
	| 'number'
	| 'date'
	| 'boolean'
	| 'employee'
	| 'organization'
	| 'status'

export interface INumerationField {
	id: string
	label: string
	type: NumerationFieldType
	cardType: string
}

export type NumerationOperator = 'equals' | 'notEquals' | 'inDepartment'
	| 'notInDepartment' | 'inChildDepartment'

export interface INumeratorCondition {
	id: string
	field: INumerationField | null
	operator: NumerationOperator
	value: string | number | boolean | null
}

export interface INumeratorAffix {
	mode: 'text' | 'xslt'
	text: string
	xslt: string
}

export interface INumerationFieldNode {
	id: string
	label: string
	selectable: boolean
	field?: INumerationField
	children: INumerationFieldNode[]
}

export interface INumeratorDraft {
	name: string
	lowerBound: number | null
	upperBound: number | null
}

export interface INumerator extends INumeratorDraft {
	id: string
	ranges: INumeratorRange[]
	zoneSettings: INumeratorZoneSettings
	zones: INumeratorZone[]
}

export type NumeratorZonePeriod = 'none' | 'day' | 'week' | 'month' | 'year'

export interface INumeratorZoneSettings {
	period: NumeratorZonePeriod
	interval: number | null
	firstZoneDate: string
	weekday: number
	dayOfMonth: number | null
	month: number
}

export interface INumeratorZone {
	id: string
	name: string
	kind: 'manual' | 'automatic'
	periodStart: string | null
	periodEnd: string | null
}

export interface INumeratorRange {
	id: string
	owner: string | null
	lowerBound: number | null
	upperBound: number | null
}

export type NumeratorNumberStatus = 'free' | 'occupied' | 'reserved' | 'nonexistent'
export type NumeratorNumberOperation = 'occupy' | 'release'
export type NumeratorOccupancy = Record<string, number[]>

export interface INumeratorNumberTarget {
	zoneId: string
	number: number
}

export interface INumeratorNumberRow extends INumeratorNumberTarget {
	key: string
	zoneName: string
	status: NumeratorNumberStatus
}

export interface INumeratorStatusQuery {
	zoneId: string | null
	lowerBound: number | null
	upperBound: number | null
	statuses: NumeratorNumberStatus[]
}

export interface INumeratorUsage {
	ruleId: string
	ruleName: string
	variantId: string
	variantNumber: number
}

export interface INumerationListItem {
	id: string
	name: string
	changed: boolean
	usageCount?: number
}

export type NumerationSection = 'rules' | 'numerators'

export type NumeratorVariantSection = 'conditions' | 'format' | 'numerator'
