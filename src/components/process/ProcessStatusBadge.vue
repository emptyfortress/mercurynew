<script setup lang="ts">
import { computed } from 'vue'
import type { WorkflowStatus } from '@/composables/useWorkflowPrototype'
const props = defineProps<{ status: WorkflowStatus }>()
const color = computed(() => {
	if (props.status === 'Ошибка') return 'negative'
	if (props.status === 'Ожидает') return 'amber-8'
	if (props.status === 'Выполняется') return 'positive'
	if (props.status === 'Приостановлен') return 'deep-purple'
	if (props.status === 'Остановлен') return 'grey-7'
	return 'blue-grey-5'
})
</script>

<template lang="pug">
q-badge(:color="color" :label="status")
</template>
