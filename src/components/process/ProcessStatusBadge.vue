<script setup lang="ts">
import { computed } from 'vue'
import type { WorkflowStatus } from '@/composables/useWorkflowPrototype'
import { processStatusColor } from './processStatusColor'
const props = defineProps<{ status: WorkflowStatus }>()
const color = computed(() => processStatusColor(props.status))
</script>

<template lang="pug">
q-badge(:color="color" :label="status")
</template>
