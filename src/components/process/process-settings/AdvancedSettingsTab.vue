<script setup lang="ts">
import { reactive } from 'vue'
import { workflowPrototype } from '@/composables/useWorkflowPrototype'

const settings = reactive({
	initiatingDocumentTypes: [] as string[],
	businessCalendar: null as string | null,
	documentVariable: 'Документ' as string | null,
	responsible: null as string | null,
	executionMode: 'Любой',
	protectScript: false,
})

const documentTypes = [
	'Маршрут согласования',
	'WebClientSettingsDirectory',
	'ExtensionsDirectory',
	'Задание',
	'Расширенный конструктор',
	'SolutionsDirectory',
	'Этап согласования',
]
const calendarOptions = ['Основной рабочий календарь', 'Круглосуточный календарь']
const documentVariableOptions = ['Документ']
const responsibleOptions = [
	...new Set(workflowPrototype.instances.map((instance) => instance.author)),
]
const executionModeOptions = ['Любой']
</script>

<template lang="pug">
.advanced-settings-tab
	.text-caption.text-grey-9 Настройка дополнительных параметров бизнес-процесса.
	section
		.text-subtitle2.q-mb-sm Тип инициирующих документов
		q-list.document-types(bordered dense)
			q-item(v-for="documentType in documentTypes" :key="documentType" tag="label" dense)
				q-item-section
					q-checkbox.text-black(v-model="settings.initiatingDocumentTypes" :val="documentType" :label="documentType" dense size="sm")
	q-select(v-model="settings.businessCalendar" :options="calendarOptions" label="Бизнес-календарь" dense outlined options-dense clearable hide-bottom-space)
	q-select(v-model="settings.documentVariable" :options="documentVariableOptions" label="Сохранять инициирующий документ в переменную" dense outlined options-dense clearable hide-bottom-space)
	q-select(v-model="settings.responsible" :options="responsibleOptions" label="Ответственный за бизнес-процесс" dense outlined options-dense clearable hide-bottom-space)
	q-select(v-model="settings.executionMode" :options="executionModeOptions" label="Режим исполнения" dense outlined options-dense hide-bottom-space)
	q-checkbox.text-black(v-model="settings.protectScript" label="Защитить сценарий процесса" dense)
	.advanced-actions
		q-btn(flat dense color="primary" label="Журналирование")
		q-btn(flat dense color="primary" label="Завершение процесса")
</template>

<style scoped lang="scss">
.advanced-settings-tab {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-width: 0;
	padding-bottom: 1rem;
	color: var(--q-primary);
}

.document-types {
	max-height: 180px;
	overflow-y: auto;
	border-color: var(--my-border-color);
	border-radius: var(--rad);
	background: #fff;

	.q-item {
		min-height: 28px;
		padding: 4px 8px;
	}
}

.advanced-actions {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.5rem;
}
</style>
