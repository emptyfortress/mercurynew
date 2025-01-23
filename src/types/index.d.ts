interface App {
	id: string
	label: string
	descr: string
	expand: boolean
	over: boolean
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
