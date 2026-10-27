<script setup lang="ts">
import { computed } from 'vue'
import type { Node } from '@vue-flow/core'
import { getNodeExecutionState, processNodeExecutionStateOptions, type ProcessNodeExecutionState } from '../processNodeExecutionState'

const props = defineProps<{ node: Node }>()
const currentState = computed({
	get: () => getNodeExecutionState(props.node),
	set: (value: ProcessNodeExecutionState) => { props.node.data.executionState = value },
})
const processingStats = [
	{ label: 'Последнее', value: '0 мсек' },
	{ label: 'Среднее', value: '0 мсек' },
	{ label: 'Максимальное', value: '0 мсек' },
	{ label: 'Минимальное', value: '0 мсек' },
	{ label: 'Всего обработано', value: '0 раз' },
]
</script>

<template lang="pug">
.node-instances-settings
	.text-caption.text-grey-9 Просмотр состояния функции.
	q-select(v-model="currentState" :options="processNodeExecutionStateOptions" label="Текущее состояние" emit-value map-options dense outlined options-dense hide-bottom-space)
	q-separator
	section.settings-section
		.text-subtitle2 Время обработки
		dl.processing-stats
			template(v-for="stat in processingStats" :key="stat.label")
				dt {{ stat.label }}
				dd {{ stat.value }}
</template>

<style scoped lang="scss">
.node-instances-settings {
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

.processing-stats {
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

@container (max-width: 240px) {
	.processing-stats {
		grid-template-columns: minmax(0, 1fr);
		gap: 0.125rem;

		dd:not(:last-child) {
			margin-bottom: 0.5rem;
		}
	}
}
</style>
