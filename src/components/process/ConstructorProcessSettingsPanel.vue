<script setup lang="ts">
import { ref } from 'vue'
import GeneralSettingsTab from './process-settings/GeneralSettingsTab.vue'
import VariablesSettingsTab from './process-settings/VariablesSettingsTab.vue'
import GatewaysSettingsTab from './process-settings/GatewaysSettingsTab.vue'
import AdvancedSettingsTab from './process-settings/AdvancedSettingsTab.vue'
import { instance } from './singleMonitorLayoutState'

const activeTab = ref('general')
</script>

<template lang="pug">
.process-settings-panel
	q-tabs(v-model="activeTab" dense no-caps align="left" active-color="primary" indicator-color="primary" outside-arrows mobile-arrows)
		q-tab(name="general" label="Общие")
		q-tab(name="variables" label="Переменные")
		q-tab(name="gateways" label="Шлюзы")
		q-tab(name="advanced" label="Дополнительно")
	q-separator
	q-tab-panels.process-settings-content(v-model="activeTab" keep-alive animated)
		q-tab-panel(name="general")
			GeneralSettingsTab(:process="instance")
		q-tab-panel(name="variables")
			VariablesSettingsTab
		q-tab-panel(name="gateways")
			GatewaysSettingsTab
		q-tab-panel(name="advanced")
			AdvancedSettingsTab
</template>

<style scoped lang="scss">
.process-settings-panel {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	min-width: 0;
	background: var(--bg-panel);
}

.q-separator--horizontal {
	background: var(--my-border-color);
}

.process-settings-content {
	flex: 1;
	min-height: 0;
	background: transparent;
}
</style>
