<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Node } from '@vue-flow/core'
import { selectedNode } from './singleMonitorLayoutState'
import GeneralSettingsTab from './node-settings/GeneralSettingsTab.vue'
import MilestoneSettingsTab from './node-settings/MilestoneSettingsTab.vue'
import TaskMainInfoTab from './node-settings/TaskMainInfoTab.vue'
import TaskAdditionalInfoTab from './node-settings/TaskAdditionalInfoTab.vue'
import InstancesSettingsTab from './node-settings/InstancesSettingsTab.vue'

const props = defineProps<{ node?: Node | null }>()
const currentNode = computed(() => (props.node === undefined ? selectedNode.value : props.node))
const activeTab = ref('general')
const hasTaskMainInfo = computed(() => currentNode.value?.data.libraryType === 'docsvision-ud-task')
watch(
	hasTaskMainInfo,
	(isTask) => {
		activeTab.value = isTask ? 'task-main' : 'general'
	},
	{ immediate: true }
)
</script>

<template lang="pug">
.node-settings-panel
	template(v-if="currentNode")
		q-tabs(v-model="activeTab" dense no-caps align="left" active-color="primary" indicator-color="primary" outside-arrows mobile-arrows)
			q-tab(v-if="hasTaskMainInfo" name="task-main" label="Информация")
			q-tab(v-if="hasTaskMainInfo" name="task-additional" label="Дополнительно")
			q-tab(name="general" label="Общие")
			q-tab(name="milestone" label="Настройки вехи")
			q-tab(name="instances" label="Экземпляры")
		q-separator
		q-tab-panels.node-settings-content(v-model="activeTab" keep-alive animated)
			q-tab-panel(v-if="hasTaskMainInfo" name="task-main")
				TaskMainInfoTab
			q-tab-panel(v-if="hasTaskMainInfo" name="task-additional")
				TaskAdditionalInfoTab
			q-tab-panel(name="general")
				GeneralSettingsTab(:node="currentNode")
			q-tab-panel(name="milestone")
				MilestoneSettingsTab
			q-tab-panel(name="instances")
				InstancesSettingsTab(:node="currentNode")
	.q-pa-md.text-grey-7(v-else) Выберите узел на схеме.
</template>

<style scoped lang="scss">
.node-settings-panel {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	min-width: 0;
	background: var(--bg-panel);
	color: var(--q-dark);
}
.q-separator--horizontal {
	background: var(--my-border-color);
}

.node-settings-content {
	flex: 1;
	min-height: 0;
	background: transparent;
}
</style>
