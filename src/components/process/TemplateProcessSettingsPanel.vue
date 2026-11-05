<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { WorkflowInstance } from '@/composables/useWorkflowPrototype'
import GeneralSettingsTab from './TemplateProcessGeneralSettings.vue'
import VariablesSettingsTab from './TemplateVariablesSettings.vue'
import GatewaysSettingsTab from './TemplateGatewaysSettings.vue'
import AdvancedSettingsTab from './process-settings/AdvancedSettingsTab.vue'
import { template } from './templateConstructorState'

const process = reactive<WorkflowInstance>({
	id: 'template-preview',
	templateId: '',
	author: 'Текущий пользователь',
	get templateName() {
		return template.value?.name ?? ''
	},
	set templateName(value: string) {
		if (template.value) template.value.name = value
	},
	status: 'Остановлен',
	currentStep: '',
	startedAt: '',
	elapsed: '',
	card: '',
	events: [],
})

const activeTab = ref('general')
</script>

<template lang="pug">
.process-settings-panel
	q-tabs(
		v-model="activeTab"
		dense
		no-caps
		align="left"
		active-color="primary"
		indicator-color="primary"
		outside-arrows
		mobile-arrows
	)
		q-tab(
			name="general"
			label="Общие"
		)
		q-tab(
			name="variables"
			label="Переменные"
		)
		q-tab(
			name="gateways"
			label="Шлюзы"
		)
		q-tab(
			name="advanced"
			label="Дополнительно"
		)
	q-separator
	q-tab-panels.process-settings-content(
		v-model="activeTab"
		keep-alive
		animated
	)
		q-tab-panel(name="general")
			GeneralSettingsTab(
				v-if="template"
				:process="process"
			)
		q-tab-panel(name="variables")
			VariablesSettingsTab
		q-tab-panel(name="gateways")
			GatewaysSettingsTab
		q-tab-panel(name="advanced")
			AdvancedSettingsTab
</template>

<style scoped src="./TemplateProcessSettingsPanel.scss" lang="scss"></style>
