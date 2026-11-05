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

const loggingSettings = reactive({
	level: 'Все сообщения',
	cleanupStrategy: 'none',
	maxMessages: 0,
	maxAgeDays: 0,
})
const loggingLevelOptions = [
	'Все сообщения',
	'Предупреждения и ошибки',
	'Только ошибки',
	'Не журналировать',
]

const completionSettings = reactive({
	action: 'delete',
	permanentDeletion: true,
	delayedArchiving: false,
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
const executionModeOptions = ['x86', 'x64', 'Любой', 'Определить автоматически']
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
	q-list.rounded-borders(
		bordered
		separator
	)
		q-expansion-item(
			label="Журналирование"
			header-class="advanced-settings-tab__section-header"
			dense
			expand-separator
		)
			.logging-settings.q-pa-md
				q-select(
					v-model="loggingSettings.level"
					:options="loggingLevelOptions"
					label="Уровень журналирования"
					dense
					outlined
					options-dense
					hide-bottom-space
				)
				fieldset.logging-settings__cleanup
					legend.logging-settings__legend Стратегия очистки журнала
					q-radio.text-black(
						v-model="loggingSettings.cleanupStrategy"
						val="none"
						label="Не очищать"
						dense
					)
					.logging-settings__strategy
						q-radio.text-black(
							v-model="loggingSettings.cleanupStrategy"
							val="count"
							label="Оставлять не более чем"
							dense
						)
						.logging-settings__limit
							q-input.logging-settings__number(
								v-model.number="loggingSettings.maxMessages"
								type="number"
								min="0"
								step="1"
								title="Максимальное количество сообщений"
								:disable="loggingSettings.cleanupStrategy !== 'count'"
								dense
								outlined
								hide-bottom-space
							)
							span сообщений
					.logging-settings__strategy
						q-radio.text-black(
							v-model="loggingSettings.cleanupStrategy"
							val="age"
							label="Удалять сообщения старше чем"
							dense
						)
						.logging-settings__limit
							q-input.logging-settings__number(
								v-model.number="loggingSettings.maxAgeDays"
								type="number"
								min="0"
								step="1"
								title="Возраст сообщений в днях"
								:disable="loggingSettings.cleanupStrategy !== 'age'"
								dense
								outlined
								hide-bottom-space
							)
							span дней
		q-expansion-item(
			label="Завершение процесса"
			header-class="advanced-settings-tab__section-header"
			dense
			expand-separator
		)
			.completion-settings.q-pa-md
				q-radio.text-black(
					v-model="completionSettings.action"
					val="none"
					label="Ничего не делать"
					dense
				)
				q-radio.text-black(
					v-model="completionSettings.action"
					val="delete"
					label="Удалить процесс"
					dense
				)
				.q-pl-lg
					q-checkbox.text-black(
						v-model="completionSettings.permanentDeletion"
						label="Окончательное удаление"
						:disable="completionSettings.action !== 'delete'"
						dense
					)
				q-radio.text-black(
					v-model="completionSettings.action"
					val="archive"
					label="Архивировать процесс"
					dense
				)
				.q-pl-lg
					q-checkbox.text-black(
						v-model="completionSettings.delayedArchiving"
						label="Отложенное архивирование"
						:disable="completionSettings.action !== 'archive'"
						dense
					)
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

.advanced-settings-tab :deep(.advanced-settings-tab__section-header) {
	min-height: 40px;
	background: var(--bgLight);
}

.advanced-settings-tab :deep(.advanced-settings-tab__section-header .q-item__label) {
	font-weight: 600;
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

.logging-settings {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-width: 0;
	color: var(--q-dark);
}

.logging-settings__cleanup {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	min-width: 0;
	margin: 0;
	padding: 0.75rem;
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
}

.logging-settings__legend {
	padding: 0 0.25rem;
	font-size: 0.8rem;
}

.logging-settings__strategy {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem 1rem;
}

.logging-settings__limit {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding-left: 1.5rem;
	font-size: 0.8rem;
}

.logging-settings__number {
	width: 5rem;
}

.completion-settings {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

</style>
