import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Node } from '@vue-flow/core'
import { workflowPrototype, type WorkflowInstance } from '@/composables/useWorkflowPrototype'
import type { EdgeType } from '../states/types'
import { processGatewayCatalog } from './processGateways'
import { createDefaultProcessVariables } from './processVariables'

const activeInstanceId = ref(workflowPrototype.instances[0]?.id ?? '')
export const instance = computed(() => workflowPrototype.instances.find((item) => item.id === activeInstanceId.value) ?? workflowPrototype.instances[0]!)
watch(instance, (process) => {
	process.variables ??= createDefaultProcessVariables()
}, { immediate: true, flush: 'sync' })

export const processVariables = computed({
	get: () => instance.value.variables!,
	set: (variables) => { instance.value.variables = variables },
})
export const template = computed(() => workflowPrototype.templates.find((item) => item.id === instance.value.templateId) ?? workflowPrototype.templates[0]!)
export const connectedGateways = computed(() => {
	const ids = instance.value.gatewayIds ?? processGatewayCatalog.map((gateway) => gateway.id)
	return ids.flatMap((id) => {
		const gateway = processGatewayCatalog.find((item) => item.id === id)
		return gateway ? [gateway] : []
	})
})
export const selectedNode: Ref<Node | null> = ref(null)
export const search = ref<string | null>('')
export const nodeSelectionRequest = ref<{ id: string; sequence: number } | null>(null)
export const diagramSaveRequest = ref(0)
export const diagramReloadRequest = ref(0)
export const isInstanceEditing = ref(false)
let instanceSnapshot: WorkflowInstance | null = null
export const edgeType = ref<EdgeType>('smoothstep')
let nodeSelectionSequence = 0
export const filteredNodes = computed(() => template.value.nodes.filter((node) =>
	String(node.data.label ?? '').toLowerCase().includes((search.value ?? '').trim().toLowerCase()),
))

export function requestNodeSelection(id: string) {
	nodeSelectionRequest.value = { id, sequence: ++nodeSelectionSequence }
}

export function saveProcessDiagram() {
	if (!isInstanceEditing.value) return
	diagramSaveRequest.value += 1
	instanceSnapshot = null
	isInstanceEditing.value = false
}

export function pauseInstance() {
	if (isInstanceEditing.value) return
	instance.value.status = 'Приостановлен'
	instanceSnapshot = JSON.parse(JSON.stringify(instance.value)) as WorkflowInstance
	isInstanceEditing.value = true
}

export function cancelInstanceEditing() {
	if (instanceSnapshot) {
		for (const key of Object.keys(instance.value)) {
			if (!(key in instanceSnapshot)) Reflect.deleteProperty(instance.value, key)
		}
		Object.assign(instance.value, instanceSnapshot)
	}
	instanceSnapshot = null
	isInstanceEditing.value = false
	selectedNode.value = null
	diagramReloadRequest.value += 1
}

export function setActiveInstance(id: string) {
	cancelInstanceEditing()
	activeInstanceId.value = id
	selectedNode.value = null
}

export function setProcessGateways(ids: string[]) {
	instance.value.gatewayIds = [...new Set(ids)].filter((id) =>
		processGatewayCatalog.some((gateway) => gateway.id === id)
	)
}

export function addProcessGateways(ids: string[]) {
	setProcessGateways([...connectedGateways.value.map((gateway) => gateway.id), ...ids])
}

export function removeProcessGateway(id: string) {
	setProcessGateways(connectedGateways.value.filter((gateway) => gateway.id !== id).map((gateway) => gateway.id))
}
