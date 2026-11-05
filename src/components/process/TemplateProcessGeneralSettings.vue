<script setup lang="ts">
import { computed, reactive } from 'vue'
import { workflowStatuses, type WorkflowInstance } from '@/composables/useWorkflowPrototype'

const props = defineProps<{ process: WorkflowInstance }>()
const description = computed({
	get: () => props.process.description ?? '',
	set: (value: string) => {
		props.process.description = value
	},
})
const priority = computed({
	get: () => props.process.priority ?? 'Обычный',
	set: (value: string) => {
		props.process.priority = value
	},
})

const settings = reactive({
	canUseAsSubprocess: false,
	singleActiveInstance: false,
	refreshPeriod: 3,
	processingQuantum: 0,
})
const statusOptions = workflowStatuses
const priorityOptions = ['Наивысший', 'Высокий', 'Обычный', 'Низкий', 'Самый низкий']

const processDetails = [
	{ label: 'Номер версии', value: '5.0' },
	{ label: 'Автор шаблона', value: 'DIGDES\\Evgeny' },
	{ label: 'Автор экземпляра', value: 'Платформа Docsvision (DVSHOWCASE\\Administrator)' },
	{ label: 'Дата начала', value: '13.02.2026 12:56:26' },
	{ label: 'Дата окончания', value: '13.02.2026 12:56:30' },
	{ label: 'Длительность', value: '0 дн. 0 ч. 0 мин. 4 сек.' },
]
</script>

<template lang="pug">
.general-settings-tab
	.text-caption.text-grey-9 Настройка общих параметров процесса.
	section.settings-section
		.text-subtitle2 Общая информация
		q-input(
			v-model="process.templateName"
			label="Название"
			dense
			outlined
			hide-bottom-space
		)
		q-input(
			v-model="description"
			label="Описание"
			type="textarea"
			rows="3"
			dense
			outlined
			hide-bottom-space
		)
		.settings-grid
			q-select(
				v-model="process.status"
				:options="statusOptions"
				label="Состояние процесса"
				dense
				outlined
				hide-bottom-space
				options-dense
			)
			q-select(
				v-model="priority"
				:options="priorityOptions"
				label="Приоритет"
				dense
				outlined
				hide-bottom-space
				options-dense
			)
		.column.q-gutter-sm
			q-checkbox.text-black(
				v-model="settings.canUseAsSubprocess"
				label="Может использоваться как подпроцесс"
				dense
			)
			q-checkbox.text-black(
				v-model="settings.singleActiveInstance"
				label="Разрешен один активный экземпляр процесса"
				dense
				disable
			)
	q-separator
	dl.process-details
		template(
			v-for="detail in processDetails"
			:key="detail.label"
		)
			dt {{ detail.label }}
			dd {{ detail.value }}
	q-separator
	.numeric-settings
		q-input.numeric-setting(
			v-model.number="settings.refreshPeriod"
			label="Период обновления"
			type="number"
			min="0"
			step="1"
			dense
			outlined
			hide-bottom-space
		)
		q-input.numeric-setting(
			v-model.number="settings.processingQuantum"
			label="Квант обработки"
			type="number"
			min="0"
			step="1"
			suffix="сек"
			dense
			outlined
			hide-bottom-space
		)
	.row.justify-center
		q-btn(
			flat
			dense
			color="primary"
			icon="mdi-text-box-search-outline"
			label="Журнал"
		)
</template>

<style scoped src="./TemplateProcessGeneralSettings.scss" lang="scss"></style>
