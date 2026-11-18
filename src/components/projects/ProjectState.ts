import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { uid } from 'quasar'
import { DEMO_PROJECTS, PROJECT_CATALOG } from './Catalog'
import { collectLayoutIds, getProjectError } from './ProjectRules'
import type { ICatalogNode, IProject, ProjectMode } from './Types'

const cloneProject = (project: IProject): IProject => ({
	...project,
	layoutIds: [...project.layoutIds],
})

export const useProjectsStore = defineStore('projects', () => {
	const projects = ref(DEMO_PROJECTS.map(cloneProject))
	const drafts = ref<Record<string, IProject>>({})
	const errors = ref<Record<string, string>>({})
	const catalog = ref<ICatalogNode[]>(structuredClone(PROJECT_CATALOG))
	const layoutIds = computed(() => collectLayoutIds(catalog.value))
	const owners = computed(() => {
		const result: Record<string, IProject> = {}
		projects.value.forEach((project) => {
			project.layoutIds.forEach((id) => { result[id] = project })
		})
		return result
	})

	function openProject(id: string) {
		const project = projects.value.find((item) => item.id === id)
		if (project && !drafts.value[id]) drafts.value[id] = cloneProject(project)
	}

	function isChanged(id: string) {
		const saved = projects.value.find((item) => item.id === id)
		return !!drafts.value[id] && JSON.stringify(saved) !== JSON.stringify(drafts.value[id])
	}

	function createProject(name: string) {
		if (!name.trim()) return null
		const project: IProject = {
			id: uid(), name: name.trim(), version: '1.0', icon: '',
			mode: 'supplier', canChangeMode: true, layoutIds: [],
		}
		projects.value.push(project)
		openProject(project.id)
		return project.id
	}

	function saveProject(id: string) {
		const index = projects.value.findIndex((item) => item.id === id)
		const draft = drafts.value[id]
		if (index < 0 || !draft || projects.value[index].mode === 'customer') return false
		const error = getProjectError(draft, projects.value)
		const unknown = draft.layoutIds.some((layoutId) => !layoutIds.value.includes(layoutId))
		errors.value[id] = error || (unknown ? 'Некоторые разметки отсутствуют в каталоге.' : '')
		if (errors.value[id]) return false
		const saved = cloneProject(draft)
		saved.name = saved.name.trim()
		saved.version = saved.version.trim()
		saved.layoutIds = [...new Set(saved.layoutIds)]
		projects.value[index] = saved
		drafts.value[id] = cloneProject(saved)
		delete errors.value[id]
		return true
	}

	function cancelProject(id: string) {
		const project = projects.value.find((item) => item.id === id)
		if (project) drafts.value[id] = cloneProject(project)
		delete errors.value[id]
	}

	function duplicateProject(id: string) {
		const source = drafts.value[id] ?? projects.value.find((item) => item.id === id)
		if (!source) return null
		const selectedIds = new Set(source.layoutIds)
		const copiedLayoutIds: string[] = []
		const duplicateLayouts = (nodes: ICatalogNode[]): ICatalogNode[] => nodes.flatMap((node) => {
			if (node.kind === 'layout' && selectedIds.has(node.id)) {
				const copy = { ...node, id: uid(), label: `${node.label} — копия` }
				copiedLayoutIds.push(copy.id)
				return [node, copy]
			}
			return [{ ...node, children: node.children ? duplicateLayouts(node.children) : undefined }]
		})
		catalog.value = duplicateLayouts(catalog.value)
		const copy: IProject = {
			...cloneProject(source),
			id: uid(),
			name: `${source.name.trim() || 'Проект'} — копия`,
			mode: 'supplier',
			canChangeMode: true,
			layoutIds: copiedLayoutIds,
		}
		projects.value.push(copy)
		openProject(copy.id)
		return copy.id
	}

	function removeProject(id: string) {
		projects.value = projects.value.filter((item) => item.id !== id)
		delete drafts.value[id]
		delete errors.value[id]
	}

	function changeMode(id: string, mode: ProjectMode) {
		const project = projects.value.find((item) => item.id === id)
		if (!project?.canChangeMode || isChanged(id)) return false
		project.mode = mode
		drafts.value[id] = cloneProject(project)
		return true
	}

	return {
		projects, drafts, errors, owners, catalog, openProject, isChanged, createProject,
		saveProject, cancelProject, duplicateProject, removeProject, changeMode,
	}
})
