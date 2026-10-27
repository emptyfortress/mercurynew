<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Node } from '@vue-flow/core'
import { processVariables } from '../singleMonitorLayoutState'

const props = defineProps<{ node: Node }>()
const name = computed({
	get: () => String(props.node.data.label ?? ''),
	set: (value: string | number | null) => { props.node.data.label = String(value ?? '') },
})
const description = computed({
	get: () => String(props.node.data.description ?? ''),
	set: (value: string | number | null) => { props.node.data.description = String(value ?? '') },
})
const pollingPeriod = ref<number | string | null>(0)
const errorDescriptionVariable = ref<string | null>(null)
const errorCodeVariable = ref<string | null>(null)

function variableOptions(type: string) {
	return [
		{ label: 'Не указано', value: null as string | null },
		...processVariables.value
			.filter((variable) => variable.type === type && !variable.isCollection)
			.map((variable) => ({ label: variable.name, value: variable.id })),
	]
}
const descriptionVariableOptions = computed(() => variableOptions('Строка'))
const codeVariableOptions = computed(() => variableOptions('Целое число'))
</script>

<template lang="pug">
.node-general-settings
	.text-caption.text-grey-9 Настройка поведения функции в процессе.
	section.settings-section
		.text-subtitle2 Общая информация
		q-input(v-model="name" label="Название" dense outlined hide-bottom-space)
		q-input(v-model="description" label="Описание" type="textarea" rows="3" dense outlined hide-bottom-space)
	q-separator
	q-input.numeric-setting(v-model.number="pollingPeriod" label="Период опроса" type="number" min="0" step="1" suffix="мин" dense outlined hide-bottom-space)
	q-separator
	section.settings-section
		.text-subtitle2 Обработка ошибок
		q-select(v-model="errorDescriptionVariable" label="Переменная для описания ошибки" :options="descriptionVariableOptions" emit-value map-options dense outlined options-dense hide-bottom-space)
		q-select(v-model="errorCodeVariable" label="Переменная для кода ошибки" :options="codeVariableOptions" emit-value map-options dense outlined options-dense hide-bottom-space)
</template>

<style scoped lang="scss">
.node-general-settings {
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

.numeric-setting {
	width: 100%;
	max-width: 160px;
}
</style>
