import { computed, ref } from 'vue'
import type { Node } from '@vue-flow/core'
import { workflowPrototype } from '@/composables/useWorkflowPrototype'
import type { EdgeType } from '../states/types'

const activeInstanceId = ref(workflowPrototype.instances[0]?.id ?? '')
export const instance = computed(() => workflowPrototype.instances.find((item) => item.id === activeInstanceId.value) ?? workflowPrototype.instances[0]!)
export const template = computed(() => workflowPrototype.templates.find((item) => item.id === instance.value.templateId) ?? workflowPrototype.templates[0]!)
export const selectedNode = ref<Node | null>(null)
export const search = ref('')
export const edgeType = ref<EdgeType>('smoothstep')
export const filteredNodes = computed(() => template.value.nodes.filter((node) =>
	String(node.data.label ?? '').toLowerCase().includes(search.value.toLowerCase()),
))

export function setActiveInstance(id: string) {
	activeInstanceId.value = id
	selectedNode.value = null
}
