import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'
import { workflowPrototype, workflowStatuses } from './useWorkflowPrototype'
import type { WorkflowInstance, WorkflowTemplate } from './useWorkflowPrototype'

export interface ProcessZone {
	id: string
	label: string
	count: number
	color?: string
	children?: ProcessZone[]
	other?: boolean
}

export function processHomePath(value: unknown): string {
	return typeof value === 'string' && (value === '/dvmain/process' || value.startsWith('/dvmain/process?'))
		? value : '/dvmain/process'
}

export function useProcessExplorer() {
	const route = useRoute()
	const router = useRouter()
	const text = (key: string) => typeof route.query[key] === 'string' ? route.query[key] as string : ''
	const section = computed(() => ['templates', 'instances'].includes(text('section')) ? text('section') : 'overview')
	const groupBy = computed(() => text('groupBy') === 'category' ? 'category' : 'status')
	const group = computed(() => section.value === 'overview' ? '' : text('group'))
	const templateId = computed(() => section.value === 'instances' ? text('template') : '')
	const subStatus = computed(() => section.value === 'instances' && groupBy.value === 'category' ? text('subStatus') : '')
	const remainingOnly = computed(() => section.value === 'instances' && groupBy.value === 'status' && Boolean(group.value) && text('other') === '1')
	const showList = computed(() => section.value === 'templates' || text('view') === 'list' || Boolean(templateId.value) || remainingOnly.value)

	function location(patch: LocationQueryRaw = {}) {
		const query: LocationQueryRaw = { ...route.query, ...patch }
		for (const key of Object.keys(query)) if (query[key] === '' || query[key] == null) delete query[key]
		return { path: '/dvmain/process', query }
	}
	function navigate(patch: LocationQueryRaw, replace = false) {
		void router[replace ? 'replace' : 'push'](location(patch))
	}
	const filter = (key: string) => computed({
		get: () => text(key),
		set: (value: string | null) => navigate({ [key]: value ?? '' }, true),
	})
	const search = filter('q')
	const category = filter('category')
	const status = filter('status')
	const author = filter('author')
	const grouping = computed({
		get: () => groupBy.value,
		set: (value: string) => navigate({ groupBy: value, section: '', group: '', template: '', subStatus: '', other: '', view: '' }),
	})
	const templateMap = computed(() => new Map(workflowPrototype.templates.map((item) => [item.id, item])))
	const instanceCategory = (item: WorkflowInstance) => templateMap.value.get(item.templateId)?.category || 'Без категории'
	const includesSearch = (value: string) => value.toLocaleLowerCase('ru').includes(search.value.trim().toLocaleLowerCase('ru'))
	const filteredTemplates = computed(() => workflowPrototype.templates.filter((item) =>
		(!category.value || item.category === category.value) && includesSearch(`${item.name} ${item.category}`)))
	const filteredInstances = computed(() => workflowPrototype.instances.filter((item) =>
		(!category.value || instanceCategory(item) === category.value)
		&& (!status.value || item.status === status.value)
		&& (!author.value || item.author === author.value)
		&& includesSearch(`${item.id} ${item.templateName} ${item.card} ${item.currentStep} ${item.author}`)))
	const templateRows = computed(() => filteredTemplates.value.filter((item) => !group.value || item.category === group.value))
	const groupedInstances = computed(() => filteredInstances.value.filter((item) => !group.value
		|| (groupBy.value === 'status' ? item.status : instanceCategory(item)) === group.value))

	function aggregate<T>(items: T[], key: (item: T) => string, label: (item: T) => string): ProcessZone[] {
		const groups = new Map<string, ProcessZone>()
		for (const item of items) {
			const id = key(item)
			const zone = groups.get(id) ?? { id, label: label(item), count: 0 }
			zone.count += 1
			groups.set(id, zone)
		}
		return [...groups.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ru'))
	}
	const templateZones = computed(() => aggregate(filteredTemplates.value, (item) => item.category, (item) => item.category))
	const statusColors: Record<string, string> = {
		'Выполняется': '#218c62', 'Ожидает': '#bf850e', 'Ошибка': '#c43c48',
		'Приостановлен': '#7952b3', 'Завершён': '#52798b', 'Остановлен': '#707981',
	}
	const instanceZones = computed(() => aggregate(filteredInstances.value,
		(item) => groupBy.value === 'status' ? item.status : instanceCategory(item),
		(item) => groupBy.value === 'status' ? item.status : instanceCategory(item))
		.map((zone) => {
			const items = filteredInstances.value.filter((item) =>
				(groupBy.value === 'status' ? item.status : instanceCategory(item)) === zone.id)
			let children = groupBy.value === 'status'
				? aggregate(items, (item) => item.templateId, (item) => templateMap.value.get(item.templateId)?.name ?? item.templateName)
				: aggregate(items, (item) => item.status, (item) => item.status)
			if (groupBy.value === 'status' && children.length > 5) {
				const remaining = children.slice(5).reduce((sum, child) => sum + child.count, 0)
				children = [...children.slice(0, 5), { id: '__other__', label: 'Остальные', count: remaining, other: true }]
			}
			return { ...zone, color: groupBy.value === 'status' ? statusColors[zone.id] : undefined, children }
		}))
	const instanceTemplateZones = computed(() => aggregate(groupedInstances.value, (item) => item.templateId,
		(item) => templateMap.value.get(item.templateId)?.name ?? item.templateName))
	const instanceRows = computed(() => {
		const remainingIds = new Set(remainingOnly.value ? instanceTemplateZones.value.slice(5).map((zone) => zone.id) : [])
		return groupedInstances.value.filter((item) =>
			(!templateId.value || item.templateId === templateId.value)
			&& (!subStatus.value || item.status === subStatus.value)
			&& (!remainingOnly.value || remainingIds.has(item.templateId)))
	})
	const categoryOptions = computed(() => [...new Set([
		...workflowPrototype.templates.map((item) => item.category),
		...workflowPrototype.instances.map(instanceCategory),
	])].sort((a, b) => a.localeCompare(b, 'ru')))
	const authorOptions = computed(() => [...new Set(workflowPrototype.instances.map((item) => item.author))].sort((a, b) => a.localeCompare(b, 'ru')))
	const templateLabel = computed(() => templateMap.value.get(templateId.value)?.name
		?? workflowPrototype.instances.find((item) => item.templateId === templateId.value)?.templateName ?? templateId.value)
	const breadcrumbs = computed(() => {
		const items = [{ label: 'Процессы', to: location({ section: '', group: '', template: '', subStatus: '', other: '', view: '' }) }]
		if (section.value !== 'overview') items.push({
			label: section.value === 'templates' ? 'Шаблоны' : 'Экземпляры',
			to: location({ group: '', template: '', subStatus: '', other: '', view: '' }),
		})
		if (group.value) items.push({ label: group.value, to: location({ template: '', subStatus: '', other: '', view: 'list' }) })
		if (remainingOnly.value) items.push({ label: 'Остальные', to: location() })
		if (subStatus.value) items.push({ label: subStatus.value, to: location() })
		if (templateId.value) items.push({ label: templateLabel.value, to: location() })
		return items
	})
	function back() {
		const item = breadcrumbs.value[breadcrumbs.value.length - 2]
		if (item) void router.push(item.to)
	}
	function openTemplateGroup(id: string) {
		navigate({ section: 'templates', group: id, template: '', subStatus: '', other: '', view: '' })
	}
	function openInstanceGroup(id: string) {
		navigate({ section: 'instances', group: id, template: '', subStatus: '', other: '', view: 'list' })
	}
	function openInstanceChild(groupId: string, childId: string) {
		const child = instanceZones.value.find((zone) => zone.id === groupId)?.children?.find((item) => item.id === childId)
		if (!child) return
		navigate({ section: 'instances', group: groupId,
			template: groupBy.value === 'status' && !child.other ? child.id : '',
			other: child.other ? '1' : '',
			subStatus: groupBy.value === 'category' ? child.id : '', view: 'list' })
	}
	function openInstanceTemplate(id: string) {
		navigate({ section: 'instances', template: id, subStatus: '', other: '', view: 'list' })
	}
	function openTemplate(item: WorkflowTemplate) {
		void router.push({ path: '/dvmain/process/constructor', query: { template: item.id, from: route.fullPath } })
	}
	function openInstance(id: string) {
		void router.push({ path: '/dvmain/process/monitorsingle', query: { instance: id, from: route.fullPath } })
	}
	function clearFilters() {
		navigate({ q: '', category: '', status: '', author: '' }, true)
	}
	return {
		section, group, grouping, templateId, templateLabel, subStatus, remainingOnly, showList, search, category, status, author,
		categoryOptions, authorOptions, statusOptions: workflowStatuses, filteredTemplates, filteredInstances,
		templateRows, instanceRows, templateZones, instanceZones, instanceTemplateZones, breadcrumbs,
		location, navigate, back, openTemplateGroup, openInstanceGroup, openInstanceTemplate, openInstanceChild,
		openTemplate, openInstance, clearFilters,
	}
}
