<script setup lang="ts">
import { computed } from 'vue'
import type { WorkflowInstance, WorkflowTemplate } from '@/composables/useWorkflowPrototype'
const props = defineProps<{ instance: WorkflowInstance; template: WorkflowTemplate | null }>()
const activeStepId = computed(() => props.template?.nodes.find((node) => node.data.label === props.instance.currentStep)?.id)
</script>

<template lang="pug">
q-list(separator)
	q-item(v-for="node in template?.nodes" :key="node.id" :active="node.id === activeStepId" active-class="bg-blue-1")
		q-item-section(avatar)
			q-icon(:name="node.id === activeStepId ? 'radio_button_checked' : 'radio_button_unchecked'" :color="node.id === activeStepId ? 'primary' : 'grey-5'")
		q-item-section {{ node.data.label }}
		q-item-section(side v-if="node.id === activeStepId")
			q-badge(color="primary") Текущий шаг
.text-caption.text-grey-7(v-if="!template") Шаблон процесса не найден.
</template>
