interface App {
	id: string
	label: string
	descr: string
	expand: boolean
	version: string
	author: string
	created: string
	type: number
	group: string | null

}
// interface Version {
// 	id: number
// 	label: string
// 	value: string
// 	created: string
// 	published: null | string
// 	author: string
// 	comment: string
// 	current: boolean
// }
// interface LayoutSet {
// 	// id: string
// 	form: string
// 	layout: Layout[]
// }
// type Layout = {
// 	x: number
// 	y: number
// 	w: number
// 	h: number
// 	i: number
// 	selected: boolean
// 	fieldList: Field[]
// }
// type Condition = {
// 	id: string
// 	etap: string
// 	form: string
// 	role: string | string[]
// }
// type Role = {
// 	id: string
// 	name: string
// 	type?: string
// 	selected?: boolean
// 	description?: string
// 	pers?: string
// }
// type Form = {
// 	id: string
// 	label: string
// 	value: string
// 	desc: string
// 	selected: boolean
// 	type: number
// 	layout: Layout
// 	// creation: boolean
// }
// interface Option {
// 	id: string
// 	text: string
// 	selected: boolean
// 	type?: number
// 	level?: number
// 	parents?: string[] | []
// 	kind?: number
// 	inp?: boolean
// 	drag?: boolean
// 	man?: boolean
// 	date?: boolean
// 	children?: Option[] | []
// }
// type Block = {
// 	x: number
// 	y: number
// 	w: number
// 	h: number
// 	i: number
// 	selected: boolean
// }
// type Field = {
// 	id: string
// 	type: string
// 	// label: string
// 	name: string
// 	typ?: string
// 	readonly: boolean
// 	visible: boolean
// 	options?: string[]
// 	selected: boolean
// }
//
// interface BusinessObject {
// 	id: string
// 	$type: string
// 	name: string
// }
//
// interface App {
// 	id: number
// 	name: string
// 	file?: string
// 	version?: string
// 	descr?: string
// 	author?: string
// 	created?: string
// 	card?: string
// }
//
// interface NodeData extends App {
// 	// id: number
// 	text: string
// 	name?: string
// 	// descr?: string
// 	selected?: boolean
// 	hidden?: boolean
// 	type: number
// 	edit?: boolean
// }
//
// interface Stat {
// 	data: NodeData
// 	open: boolean // Is opened.
// 	parent: Stat<T> | null // Parent stat.
// 	children: Stat<T>[] // Children stats.
// 	level: number // Level start from 1.
// 	isStat: boolean // Detect if is stat object.
// 	hidden: boolean // If hidden.
// 	checked: boolean | null // If checked. null mean just some children checked.
// 	draggable: boolean | null // null means inherit parent.
// 	droppable: boolean | null // null means inherit parent.
// 	style: any // Customize node style. Vue's style format.
// 	class: any // Customize node class name. Vue's class format.
// }
//
// interface TreeNode {
// 	text: string
// 	text1?: string
// 	hidden: boolean
// 	type: number
// 	selected: boolean
// 	children?: TreeNode[]
// }
