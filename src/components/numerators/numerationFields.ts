import { fields } from '@/stores/fields-poisk'
import { Kind } from '@/types/enum'
import type { INumerationField, INumerationFieldNode, NumerationFieldType } from './types'

interface ISourceField {
	text: string
	kind?: Kind
	hidden?: boolean
	children?: ISourceField[]
}

function getFieldType(kind: Kind): NumerationFieldType {
	if (kind === Kind.Num) return 'number'
	if (kind === Kind.Date) return 'date'
	if (kind === Kind.Bool) return 'boolean'
	if (kind === Kind.Man) return 'employee'
	if (kind === Kind.Org) return 'organization'
	if (kind === Kind.Status) return 'status'
	return 'text'
}

export function getNumerationFieldTree(cardType: string | null, cardLabel?: string) {
	if (!cardType || !cardLabel) return []
	const source: ISourceField | undefined = fields.find((field) => field.text === cardLabel)
	if (!source) return []
	function convert(node: ISourceField, path: string[]): INumerationFieldNode | null {
		if (node.hidden) return null
		const fullPath = [...path, node.text]
		const id = fullPath.join(' / ')
		const children = (node.children ?? []).flatMap((child) => {
			const result = convert(child, fullPath)
			return result ? [result] : []
		})
		const selectable = node.kind !== undefined &&
			node.kind !== Kind.Table && node.kind !== Kind.Virtual
		if (!selectable && !children.length) return null
		return {
			id,
			label: node.text,
			selectable,
			children,
			field: selectable && node.kind !== undefined
				? { id, label: id, type: getFieldType(node.kind), cardType: cardType! }
				: undefined,
		}
	}
	const root = convert(source, [])
	return root ? [root] : []
}

export function findNumerationField(
	nodes: INumerationFieldNode[],
	id: string
): INumerationField | undefined {
	for (const node of nodes) {
		if (node.id === id && node.field) return node.field
		const found = findNumerationField(node.children, id)
		if (found) return found
	}
	return undefined
}
