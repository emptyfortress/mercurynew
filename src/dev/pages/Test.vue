<script setup lang="ts">
import { reactive } from 'vue'
import type { Node } from '@vue-flow/core'
import ConstructorNodeSettingsPanel from '@/components/process/ConstructorNodeSettingsPanel.vue'

const taskNode = reactive<Node>({
	id: 'test-ud-task',
	type: 'default',
	position: { x: 0, y: 0 },
	data: {
		label: 'Задание УД',
		description: '',
		libraryType: 'docsvision-ud-task',
		shape: 'standard',
	},
})
</script>

<template lang="pug">
q-page(padding)
	q-card.node-properties-demo(flat bordered)
		q-card-section.q-py-sm
			.text-subtitle2 Свойства
		q-separator
		ConstructorNodeSettingsPanel.node-properties-demo__panel(:node="taskNode")
</template>

<style scoped lang="scss">
.node-properties-demo {
	display: flex;
	flex-direction: column;
	width: 400px;
	max-width: 100%;
	margin-inline: auto;
	height: 650px;
	background: var(--bg-panel);
	border-color: var(--my-border-color);
}

.node-properties-demo__panel {
	flex: 1;
	min-height: 0;
}
</style>
