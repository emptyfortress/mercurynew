interface App {
	id: string
	label: string
	descr: string
	expand: boolean
	version: string
	author: string
	created: string
	modify?: string
	uploaded?: string
	group: number
	published: number
	list: App[]
	pic?: any
	versions: Ver[]
}

interface Ver {
	id: number
	label: string
	value: string
	created: string
	modified: string
	published: number
	descr: string
	current: boolean
}

type Control = {
	id: number
	label: string
	caption: string
	selected: boolean
	type: Kind
	pic: any
}

interface Version {
	id: number
	label: string
	value: string
	created: string
	published: null | string
	author: string
	comment: string
	current: boolean
}

interface Option {
	id?: string
	text: string
	label?: string
	value?: string
	selected: boolean
	type?: number
	level?: number
	parents?: string[] | []
	kind?: number
	inp?: boolean
	drag?: boolean
	man?: boolean
	date?: boolean
	exe?: boolean
	execute?: boolean
	dvalue?: boolean
	due?: boolean
	word?: boolean
	children?: Option[] | []
}

type Form = {
	id: string
	label: string
	value: string
	desc: string
	selected: boolean
	type: number
	layout: Layout
	// creation: boolean
}

type Condition = {
	id: string
	etap: string
	form: string
	status: string
	newstatus: string
	// role: string | string[]
}
interface Stat {
	data: NodeData
	open: boolean // Is opened.
	parent: Stat<T> | null // Parent stat.
	children: Stat<T>[] // Children stats.
	level: number // Level start from 1.
	isStat: boolean // Detect if is stat object.
	hidden: boolean // If hidden.
	checked: boolean | null // If checked. null mean just some children checked.
	draggable: boolean | null // null means inherit parent.
	droppable: boolean | null // null means inherit parent.
	style: any // Customize node style. Vue's style format.
	class: any // Customize node class name. Vue's class format.
}

interface MenuItem {
	id: string
	label: string
	value?: string
	children?: MenuItem[]
	isSpecial?: boolean
	isSpecial1?: boolean
	isKey?: boolean
	isPeople?: boolean
	isLast?: boolean
	isInput?: boolean
	date?: boolean
	isPrompt?: boolean
	isPar?: boolean
	isMulti?: boolean
	isActive?: boolean
	isVis?: boolean
}

interface MenuLevel {
	title: string
	items: MenuItem[]
	isSpecial: boolean
}

interface PredCols {
	id: number
	active: boolean
	label: string
	name: string
	field: string
	align: left
	sortable: boolean
}

type Scenario = 'copy' | 'group' | 'group0' | 'add' | 'remove'
