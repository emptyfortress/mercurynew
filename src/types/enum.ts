enum Kind {
	String,
	Text,
	Date,
	Org,
	Num,
	Man,
	Status,
	Link,
	Phone,
	Email,
	Bool,
	Key,
	Goal,
	Exec,
	Execute,
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
	word?: boolean
	dvalue?: boolean
	children?: Option[] | []
}
export { Kind }
export type { Option }
