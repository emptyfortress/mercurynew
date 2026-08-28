export type NodeType = 'simple' | 'options' | 'conditions' | 'group'

export interface OptionRow {
	id: string
	value: string
	label: string
}

export interface BaseNode {
	id: number
	type: NodeType
	name: string
	open: boolean
	expanded: boolean
	children: AnyNode[]
}

export interface SimpleElement extends BaseNode {
	type: 'simple'
	mode: 'field' | 'fixed'
	section: string
	field: string
	func: string
	funcLength: null | number
	preview: string
	valueType: string
	fixedValue: string
}

export interface GroupNode extends BaseNode {
	type: 'group'
	function: string
	children: AnyNode[]
}

// export interface OptionsSetNode extends BaseNode {
// 	type: 'options'
// }

export interface OptionsSetNode extends BaseNode {
	type: 'options'
	sourceField: string | null
	sourceFieldOptions: { label: string; value: string }[]
	options: OptionRow[]
	defaultValue: string
}

export interface ConditionRow {
	id: string
	condition: string
	value: string
}

export interface ConditionsSetNode extends BaseNode {
	type: 'conditions'
	conditions: ConditionRow[]
}

export type AnyNode = SimpleElement | GroupNode | OptionsSetNode | ConditionsSetNode
