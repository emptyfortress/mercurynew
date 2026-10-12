<script setup lang="ts">
import { computed, ref } from 'vue'
import type { WorkflowInstance, WorkflowTemplate } from '@/composables/useWorkflowPrototype'
import ProcessInstanceGrid from './ProcessInstanceGrid.vue'
const props = defineProps<{ instances: WorkflowInstance[]; templates: WorkflowTemplate[] }>()
const emit = defineEmits<{ select: [id: string] }>()
const selectedStatus = defineModel<string>('status', { required: true })
const selectedTemplateId = ref('all')
const searchText = ref<string | null>('')
const statusFilters = [
	'Все экземпляры',
	'Активны',
	'Требуют внимания',
	'Ошибки',
	'Приостановлены',
	'Завершены',
	'Остановлены',
]

const filteredInstances = computed(() => {
	const query = (searchText.value ?? '').trim().toLocaleLowerCase('ru')
	return props.instances.filter((instance) => {
		const statusMatch =
			selectedStatus.value === 'Все экземпляры' ||
			(selectedStatus.value === 'Активны' && instance.status === 'Активен') ||
			(selectedStatus.value === 'Требуют внимания' &&
				['Приостановлен', 'Приостановлен из-за ошибки'].includes(instance.status)) ||
			(selectedStatus.value === 'Приостановлены' && instance.status === 'Приостановлен') ||
			(selectedStatus.value === 'Ошибки' && instance.status === 'Приостановлен из-за ошибки') ||
			(selectedStatus.value === 'Завершены' && instance.status === 'Завершен успешно') ||
			(selectedStatus.value === 'Остановлены' && instance.status === 'Остановлен')
		const templateMatch =
			selectedTemplateId.value === 'all' || instance.templateId === selectedTemplateId.value
		const textMatch =
			!query ||
			`${instance.id} ${instance.templateName} ${instance.card} ${instance.currentStep} ${instance.author}`
				.toLocaleLowerCase('ru')
				.includes(query)
		return statusMatch && templateMatch && textMatch
	})
})
</script>

<template lang="pug">
q-card.flat.bordered
	q-tabs(v-model="selectedStatus" dense align="left" active-color="primary" indicator-color="primary" no-caps)
		q-tab(v-for="filter in statusFilters" :key="filter" :name="filter" :label="filter")
	q-separator
	.row.items-center.q-col-gutter-sm.q-pa-md
		.col-12.col-sm-5
			q-input(v-model="searchText" dense outlined clearable placeholder="Найти по процессу, карточке или шагу")
		.col-12.col-sm-4
			q-select(v-model="selectedTemplateId" dense outlined emit-value map-options :options="[{ label: 'Все шаблоны', value: 'all' }, ...templates.map((template) => ({ label: template.name, value: template.id }))]" label="Шаблон")
		.col-12.col-sm-3.text-right.text-caption.text-grey-7 {{ filteredInstances.length }} экземпляров
ProcessInstanceGrid(:rows="filteredInstances" :reset-key="`${selectedStatus}-${selectedTemplateId}-${searchText}`" :page-sizes="[20, 30, 60]" @select="emit('select', $event)")
</template>
