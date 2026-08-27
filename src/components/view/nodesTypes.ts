export type NodeType = 'simple' | 'options' | 'conditions' | 'group'

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
}

export interface OptionsSetNode extends BaseNode {
	type: 'options'
}

export interface ConditionsSetNode extends BaseNode {
	type: 'conditions'
}

export type AnyNode = SimpleElement | GroupNode | OptionsSetNode | ConditionsSetNode
