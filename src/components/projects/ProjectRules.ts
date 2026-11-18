import type { ICatalogNode, IProject } from './Types'

export function collectLayoutIds(nodes: ICatalogNode[]): string[] {
	return nodes.flatMap((node) =>
		node.kind === 'layout' ? [node.id] : collectLayoutIds(node.children ?? [])
	)
}

export function findLayoutConflicts(project: IProject, projects: IProject[]): IProject[] {
	return projects.filter((other) =>
		other.id !== project.id && other.layoutIds.some((id) => project.layoutIds.includes(id))
	)
}

export function getProjectError(project: IProject, projects: IProject[]): string {
	if (!project.name.trim()) return 'Введите название проекта.'
	if (!project.version.trim()) return 'Введите версию проекта.'
	const conflicts = findLayoutConflicts(project, projects)
	if (conflicts.length) {
		return `Часть разметок уже входит в проекты: ${conflicts.map((item) => item.name).join(', ')}. Снимите отметки с занятых разметок.`
	}
	return ''
}

export function filterCatalog(
	nodes: ICatalogNode[], query: string, selectedOnly: boolean, selectedIds: string[], path = ''
): ICatalogNode[] {
	const search = query.trim().toLocaleLowerCase()
	return nodes.flatMap((node) => {
		const fullPath = `${path} ${node.label}`
		const matches = fullPath.toLocaleLowerCase().includes(search)
		if (node.kind === 'layout') {
			return matches && (!selectedOnly || selectedIds.includes(node.id)) ? [node] : []
		}
		const children = filterCatalog(node.children ?? [], query, selectedOnly, selectedIds, fullPath)
		if (!children.length && (selectedOnly || !matches)) return []
		return [{ ...node, children }]
	})
}

export function mergeVisibleSelection(
	currentIds: string[], nextIds: string[], visibleIds: string[], editableIds: string[]
): string[] {
	const affected = new Set(visibleIds.filter((id) => editableIds.includes(id)))
	return [...new Set([
		...currentIds.filter((id) => !affected.has(id)),
		...nextIds.filter((id) => affected.has(id)),
	])]
}
