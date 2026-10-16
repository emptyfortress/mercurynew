import { computed, ref } from 'vue'
import type { Node } from '@vue-flow/core'
import { workflowPrototype } from '@/composables/useWorkflowPrototype'
import type { EdgeType } from '../states/types'

export const instance = workflowPrototype.instances[0]!
export const template = workflowPrototype.templates.find((item) => item.id === instance.templateId)!
export const selectedNode = ref<Node | null>(null)
export const search = ref('')
export const edgeType = ref<EdgeType>('smoothstep')
export const filteredNodes = computed(() => template.nodes.filter((node) =>
	String(node.data.label ?? '').toLowerCase().includes(search.value.toLowerCase()),
))
