<script setup lang="ts">
import type { WorkflowInstance } from '@/composables/useWorkflowPrototype'
withDefaults(defineProps<{ instance: WorkflowInstance; timeline?: boolean }>(), { timeline: false })
</script>

<template lang="pug">
q-timeline(v-if="timeline" color="primary" layout="dense" side="right")
	q-timeline-entry(v-for="(event, index) in instance.events" :key="`${instance.id}-${index}`" :title="event" :subtitle="index === 0 ? 'Сейчас' : `${index * 8 + 4} мин назад`" :icon="index === 0 && instance.status === 'Ошибка' ? 'error_outline' : 'circle'" :color="index === 0 && instance.status === 'Ошибка' ? 'negative' : 'primary'")
q-list(v-else separator)
	q-item(v-for="(event, index) in instance.events" :key="`${instance.id}-${index}`")
		q-item-section(avatar)
			q-icon(:name="index === 0 ? 'radio_button_checked' : 'check_circle'" :color="index === 0 ? 'primary' : 'grey-6'")
		q-item-section {{ event }}
</template>

<style scoped>
:deep(.q-timeline__entry) { min-height: 42px; }
</style>
