<script setup lang="ts">
import { computed, ref } from 'vue'
import type { WorkflowInstance, WorkflowTemplate } from '@/composables/useWorkflowPrototype'
import ProcessInstanceGrid from './ProcessInstanceGrid.vue'
const props = defineProps<{ instances: WorkflowInstance[]; templates: WorkflowTemplate[] }>()
const emit = defineEmits<{ select: [id: string] }>()
const selectedStatus = defineModel<string>('status', { required: true })
const selectedTemplateId = ref('all')
const searchText = ref<string | null>('')
const statusFilters = ['Все экземпляры', 'Выполняются', 'Требуют внимания', 'Ошибки', 'Приостановлены', 'Завершены']

const filteredInstances = computed(() => {
	const query = (searchText.value ?? '').trim().toLocaleLowerCase('ru')
	return props.instances.filter((instance) => {
		const statusMatch = selectedStatus.value === 'Все экземпляры'
			|| (selectedStatus.value === 'Выполняются' && instance.status === 'Выполняется')
			|| (selectedStatus.value === 'Требуют внимания' && ['Ожидает', 'Ошибка'].includes(instance.status))
			|| (selectedStatus.value === 'Приостановлены' && instance.status === 'Приостановлен')
			|| (selectedStatus.value === 'Ошибки' && instance.status === 'Ошибка')
			|| (selectedStatus.value === 'Завершены' && ['Завершён', 'Остановлен'].includes(instance.status))
		const templateMatch = selectedTemplateId.value === 'all' || instance.templateId === selectedTemplateId.value
		const textMatch = !query || `${instance.id} ${instance.templateName} ${instance.card} ${instance.currentStep} ${instance.author}`.toLocaleLowerCase('ru').includes(query)
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
	.row.q-col-gutter-md.q-px-sm.q-pb-md.monitor-layout
		.col-12.col-lg-8
			ProcessInstanceGrid(:rows="filteredInstances" :reset-key="`${selectedStatus}-${selectedTemplateId}-${searchText}`" :page-sizes="[20, 30, 60]" @select="emit('select', $event)")
		.col-12.col-lg-4
			slot
</template>

<style scoped>
.monitor-layout { align-items: flex-start; }
</style>
