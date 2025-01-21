interface App {
	id: string
	label: string
	descr: string
	expand: boolean
	version: string
	author: string
	created: string
	group: number
	pic?: any
	list?: App[]
}

type Control = {
	id: number
	label: string
	caption: string
	selected: boolean
	type: Kind
}
