import { computed, ref, type Ref } from 'vue'
import type { Node } from '@vue-flow/core'
import { createTemplate, workflowPrototype } from '@/composables/useWorkflowPrototype'
import { processGatewayCatalog } from './processGateways'
import { createDefaultProcessVariables } from './processVariables'
import type { EdgeType } from '../states/types'

export interface ITemplateTreeNode {
	id: string
	kind: 'folder' | 'template'
	name?: string
	templateId?: string
	children: ITemplateTreeNode[]
}

export const templateTree = ref<ITemplateTreeNode[]>([
	{
		id: 'business',
		kind: 'folder',
		name: 'Финансовые процессы',
		children: [
			{ id: 'purchase', kind: 'template', templateId: 'purchase', children: [] },
			{ id: 'invoice', kind: 'template', templateId: 'invoice', children: [] },
		],
	},
	{
		id: 'documents',
		kind: 'folder',
		name: 'Документы',
		children: [{ id: 'contract', kind: 'template', templateId: 'contract', children: [] }],
	},
])
export const activeTemplateId = ref('')
export const templateOpenRequest = ref(0)
export const selectedTreeId = ref('')
export const template = computed(() =>
	workflowPrototype.templates.find((item) => item.id === activeTemplateId.value)
)
export const selectedNode: Ref<Node | null> = ref(null)
export const edgeType = ref<EdgeType>('smoothstep')
export const connectedGateways = ref([...processGatewayCatalog])
export const processVariables = ref(createDefaultProcessVariables())

export function findTreeNode(
	id: string,
	nodes = templateTree.value
): ITemplateTreeNode | undefined {
	for (const node of nodes) {
		if (node.id === id) return node
		const found = findTreeNode(id, node.children)
		if (found) return found
	}
}

export function findParentFolder(
	id: string,
	nodes = templateTree.value
): ITemplateTreeNode | undefined {
	for (const node of nodes) {
		if (node.kind !== 'folder') continue
		if (node.children.some((child) => child.id === id)) return node
		const found = findParentFolder(id, node.children)
		if (found) return found
	}
}

export function getTreeNodeName(node: ITemplateTreeNode) {
	return node.kind === 'folder'
		? (node.name ?? '')
		: (workflowPrototype.templates.find((item) => item.id === node.templateId)?.name ?? '')
}

export function openTemplate(id: string) {
	activeTemplateId.value = workflowPrototype.templates.some((item) => item.id === id) ? id : ''
	selectedTreeId.value = activeTemplateId.value
	selectedNode.value = null
	if (activeTemplateId.value) templateOpenRequest.value += 1
}

export function createTreeItem(kind: 'folder' | 'template', name: string, parentFolderId?: string) {
	if (!name.trim()) return
	const parent =
		parentFolderId === undefined
			? findParentFolder(selectedTreeId.value)
			: findTreeNode(parentFolderId)
	if (parentFolderId !== undefined && parent?.kind !== 'folder') return
	const id = kind === 'template' ? createTemplate(name.trim()) : `folder-${crypto.randomUUID()}`
	const node: ITemplateTreeNode = {
		id,
		kind,
		children: [],
		...(kind === 'folder' ? { name: name.trim() } : { templateId: id }),
	}
	if (parent) parent.children.push(node)
	else templateTree.value.push(node)
	// Replacing the root also refreshes he-tree's internal stats after adding a nested item.
	templateTree.value = [...templateTree.value]
	if (kind === 'template') openTemplate(id)
	return node
}

export function renameTreeItem(id: string, name: string) {
	const node = findTreeNode(id)
	const trimmedName = name.trim()
	if (!node || !trimmedName) return false
	if (node.kind === 'folder') node.name = trimmedName
	else {
		const item = workflowPrototype.templates.find((item) => item.id === node.templateId)
		if (!item) return false
		item.name = trimmedName
		item.updatedAt = 'Только что'
	}
	return true
}

export function duplicateTemplate(id: string) {
	const source = findTreeNode(id)
	if (source?.kind !== 'template') return
	const original = workflowPrototype.templates.find((item) => item.id === source.templateId)
	if (!original) return
	const siblings = findParentFolder(id)?.children ?? templateTree.value
	const siblingNames = new Set(siblings.map(getTreeNodeName))
	let name = `${original.name} (копия)`
	let sequence = 2
	while (siblingNames.has(name)) name = `${original.name} (копия ${sequence++})`
	const copy = JSON.parse(JSON.stringify(original)) as typeof original
	copy.id = `process-${crypto.randomUUID()}`
	copy.name = name
	copy.updatedAt = 'Только что'
	workflowPrototype.templates.push(copy)
	const node: ITemplateTreeNode = {
		id: copy.id,
		kind: 'template',
		templateId: copy.id,
		children: [],
	}
	siblings.splice(siblings.findIndex((item) => item.id === id) + 1, 0, node)
	templateTree.value = [...templateTree.value]
	openTemplate(copy.id)
	return node
}

export function getDescendantTemplateIds(node: ITemplateTreeNode): string[] {
	return node.kind === 'template'
		? node.templateId
			? [node.templateId]
			: []
		: node.children.flatMap(getDescendantTemplateIds)
}

export function deleteTreeItem(id: string) {
	const node = findTreeNode(id)
	if (!node) return
	const removedTemplateIds = new Set(getDescendantTemplateIds(node))
	const selection = selectedTreeId.value
	const containsSelection = (item: ITemplateTreeNode): boolean =>
		item.id === selection || item.children.some(containsSelection)
	const removedSelection = containsSelection(node)
	const siblings = findParentFolder(id)?.children ?? templateTree.value
	siblings.splice(
		siblings.findIndex((item) => item.id === id),
		1
	)
	workflowPrototype.templates = workflowPrototype.templates.filter(
		(item) => !removedTemplateIds.has(item.id)
	)
	for (const item of workflowPrototype.templates) {
		item.linkedTemplateIds = item.linkedTemplateIds.filter(
			(linked) => !removedTemplateIds.has(linked)
		)
	}
	if (removedTemplateIds.has(activeTemplateId.value)) openTemplate('')
	selectedTreeId.value = removedSelection ? '' : selection
	templateTree.value = [...templateTree.value]
}

export function setProcessGateways(ids: string[]) {
	connectedGateways.value = ids.flatMap((id) => {
		const gateway = processGatewayCatalog.find((item) => item.id === id)
		return gateway ? [gateway] : []
	})
}

export function removeProcessGateway(id: string) {
	setProcessGateways(
		connectedGateways.value.filter((item) => item.id !== id).map((item) => item.id)
	)
}
