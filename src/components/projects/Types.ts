export type ProjectMode = 'supplier' | 'customer'

export interface IProject {
	id: string
	name: string
	version: string
	icon: string
	mode: ProjectMode
	canChangeMode: boolean
	layoutIds: string[]
}

export interface ICatalogNode {
	id: string
	label: string
	kind: 'group' | 'view' | 'layout'
	children?: ICatalogNode[]
}
