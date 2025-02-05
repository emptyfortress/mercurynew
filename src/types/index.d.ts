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
	selected: boolean
	type?: number
	level?: number
	parents?: string[] | []
	kind?: number
	inp?: boolean
	drag?: boolean
	man?: boolean
	date?: boolean
	children?: Option[] | []
}
