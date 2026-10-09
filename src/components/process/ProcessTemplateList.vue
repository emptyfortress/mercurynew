<script setup lang="ts">
import type { WorkflowTemplate } from '@/composables/useWorkflowPrototype'
defineProps<{ templates: WorkflowTemplate[]; selectedId: string }>()
const emit = defineEmits<{ select: [id: string]; create: [] }>()
</script>

<template lang="pug">
div
	.row.items-center.justify-between.q-mb-sm
		.text-subtitle2 Шаблоны
		q-badge(color="grey-3" text-color="dark") {{ templates.length }}
	q-btn.q-mb-md.full-width(unelevated dense color="primary" icon="add" label="Новый процесс" @click="emit('create')")
	q-list(separator)
		q-item(v-for="template in templates" :key="template.id" clickable :active="template.id === selectedId" active-class="bg-blue-1" @click="emit('select', template.id)")
			q-item-section
				q-item-label {{ template.name }}
				q-item-label(caption) {{ template.category }} · v{{ template.version }}
				q-item-label.text-grey-7(v-if="!template.enabled" caption) Отключён
	.text-caption.text-grey-7.q-mt-md(v-if="!templates.length") Создайте первый шаблон процесса.
</template>
