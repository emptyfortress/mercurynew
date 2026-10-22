<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { workflowStatuses, type WorkflowInstance } from '@/composables/useWorkflowPrototype'
import ProcessLogDialog from '../ProcessLogDialog.vue'

const props = defineProps<{ process: WorkflowInstance }>()
const description = computed({
	get: () => props.process.description ?? '',
	set: (value: string) => { props.process.description = value },
})
const priority = computed({
	get: () => props.process.priority ?? 'Обычный',
	set: (value: string) => { props.process.priority = value },
})

const settings = reactive({
	canUseAsSubprocess: false,
	singleActiveInstance: false,
	refreshPeriod: 3,
	processingQuantum: 0,
})
const statusOptions = workflowStatuses
const priorityOptions = ['Наивысший', 'Высокий', 'Обычный', 'Низкий', 'Самый низкий']
const isProcessLogOpen = ref(false)

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
		q-input(v-model="process.templateName" label="Название" dense outlined hide-bottom-space)
		q-input(v-model="description" label="Описание" type="textarea" rows="3" dense outlined hide-bottom-space)
		.settings-grid
			q-select(v-model="process.status" :options="statusOptions" label="Состояние процесса" dense outlined hide-bottom-space options-dense)
			q-select(v-model="priority" :options="priorityOptions" label="Приоритет" dense outlined hide-bottom-space options-dense)
		.column.q-gutter-sm
			q-checkbox.text-black(v-model="settings.canUseAsSubprocess" label="Может использоваться как подпроцесс" dense)
			q-checkbox.text-black(v-model="settings.singleActiveInstance" label="Разрешен один активный экземпляр процесса" dense disable)
	q-separator
	dl.process-details
		template(v-for="detail in processDetails" :key="detail.label")
			dt {{ detail.label }}
			dd {{ detail.value }}
	q-separator
	.numeric-settings
		q-input.numeric-setting(v-model.number="settings.refreshPeriod" label="Период обновления" type="number" min="0" step="1" dense outlined hide-bottom-space)
		q-input.numeric-setting(v-model.number="settings.processingQuantum" label="Квант обработки" type="number" min="0" step="1" suffix="сек" dense outlined hide-bottom-space)
	.row.justify-center
		q-btn(flat dense color="primary" icon="mdi-text-box-search-outline" label="Журнал" @click="isProcessLogOpen = true")
	ProcessLogDialog(v-model="isProcessLogOpen")
</template>

<style scoped lang="scss">
.general-settings-tab {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding-bottom: 1rem;
	min-width: 0;
	color: var(--q-primary);
	container-type: inline-size;
}

.settings-section {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.settings-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
	gap: 0.75rem;
}

.numeric-settings {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.numeric-setting {
	width: 100%;
	max-width: 160px;
}

.process-details {
	display: grid;
	grid-template-columns: max-content minmax(0, 1fr);
	gap: 0.5rem 1rem;
	margin: 0;
	font-size: 0.8125rem;
	line-height: 1.5;

	dt {
		opacity: 0.75;
	}

	dd {
		margin: 0;
		overflow-wrap: anywhere;
	}
}

@container (max-width: 340px) {
	.process-details {
		grid-template-columns: minmax(0, 1fr);
		gap: 0.125rem;

		dd:not(:last-child) {
			margin-bottom: 0.5rem;
		}
	}
}
</style>
