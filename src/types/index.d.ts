interface App {
	id: string
	label: string
	descr: string
	expand: boolean
	version: string
	author: string
	created: string
	group: number
	list: App[]
	pic?: any
}

type Control = {
	id: number
	label: string
	caption: string
	selected: boolean
	type: Kind
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
	kind: number
	inp?: boolean
	drag?: boolean
	man?: boolean
	date?: boolean
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
