<script setup lang="ts">
import type { Node } from '@vue-flow/core'
import type { WorkflowTemplate } from '@/composables/useWorkflowPrototype'
defineProps<{ draft: WorkflowTemplate | null; selectedNode: Node | undefined; linkedTemplateOptions: { label: string; value: string }[]; canDelete: boolean }>()
const name = defineModel<string>('name', { required: true })
const category = defineModel<string>('category', { required: true })
const enabled = defineModel<boolean>('enabled', { required: true })
const linkedTemplateIds = defineModel<string[]>('linkedTemplateIds', { required: true })
const nodeLabel = defineModel<string>('nodeLabel', { required: true })
const emit = defineEmits<{ deleteStep: []; deleteTemplate: [] }>()
</script>

<template lang="pug">
div(v-if="draft")
	.text-subtitle2 Настройки шаблона
	.text-caption.text-grey-7.q-mb-md Изменён {{ draft.updatedAt }}
	q-input(v-model="name" label="Название процесса" dense outlined)
	q-input.q-mt-md(v-model="category" label="Группа" dense outlined)
	q-toggle.q-mt-sm(v-model="enabled" color="positive" label="Разрешить новые запуски")
	q-separator.q-my-md
	.text-subtitle2.q-mb-sm Связанные процессы
	.text-caption.text-grey-7.q-mb-sm Запускаются как отдельный шаблон внутри маршрута
	q-select(v-model="linkedTemplateIds" dense outlined multiple use-chips emit-value map-options :options="linkedTemplateOptions" option-label="label" option-value="value")
	q-separator.q-my-md
	.text-subtitle2.q-mb-sm Выбранный шаг
	q-input(v-if="selectedNode" v-model="nodeLabel" label="Название шага" dense outlined)
	.text-caption.text-grey-6(v-else) Выберите шаг на схеме, чтобы изменить его название.
	q-btn.q-mt-sm(v-if="selectedNode && selectedNode.type !== 'input' && selectedNode.type !== 'output'" flat dense color="negative" icon="delete_outline" label="Удалить шаг" @click="emit('deleteStep')")
	q-banner.bg-blue-1.text-blue-10.rounded-borders.q-mt-md(dense) Запуски используют сохранённые настройки шаблона.
	q-separator.q-my-md
	q-btn(flat dense color="negative" icon="delete_outline" label="Удалить шаблон" :disable="!canDelete" @click="emit('deleteTemplate')")
.text-caption.text-grey-7.text-center(v-else) Выберите шаблон слева, чтобы настроить его свойства.
</template>
