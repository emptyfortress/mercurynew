<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { workflowPrototype } from '@/composables/useWorkflowPrototype'
import ProcessValueInput from '@/components/process/ProcessValueInput.vue'
import VariablesSettingsTab from '@/components/process/process-settings/VariablesSettingsTab.vue'
import { instance, processVariables, setActiveInstance } from '@/components/process/singleMonitorLayoutState'
import { createProcessVariable } from '@/components/process/processVariables'
import { processValueTypes, type ProcessValue, type ProcessValueType } from '@/components/process/processValue'

const disabled = ref(false)
const readonly = ref(false)
const valuesByProcess = reactive<Record<string, Record<ProcessValueType, ProcessValue>>>({})
watch(instance, (process) => {
	valuesByProcess[process.id] ??= Object.fromEntries(processValueTypes.map((type) => [type, null])) as Record<ProcessValueType, ProcessValue>
}, { immediate: true, flush: 'sync' })
const values = computed(() => valuesByProcess[instance.value.id]!)
const selectedInstanceId = computed({ get: () => instance.value.id, set: setActiveInstance })
const processOptions = computed(() => {
	const items = [...workflowPrototype.instances.slice(0, 6)]
	if (!items.some((item) => item.id === instance.value.id)) items.push(instance.value)
	return items.map((item) => ({ label: `${item.id} · ${item.templateName}`, value: item.id }))
})

function addExamples() {
	const examples: { name: string; type: ProcessValueType; value: string }[] = [
		{ name: 'Комментарий', type: 'Строка', value: 'Пример текста' },
		{ name: 'Количество', type: 'Целое число', value: '3' },
		{ name: 'Сумма', type: 'Дробное число', value: '1250.50' },
		{ name: 'Согласовано', type: 'Логический', value: 'Да' },
		{ name: 'Срок', type: 'Дата и время', value: '2026-10-22T12:30' },
		{ name: 'Ответственный', type: 'Сотрудник DV', value: 'Иванов И. И.' },
	]
	const additions = examples
		.filter((example) => !processVariables.value.some((variable) => variable.type === example.type && !variable.isCollection))
		.map((example) => createProcessVariable(example.name, example.type, example.value))
	if (!processVariables.value.some((variable) => variable.isCollection && variable.type === 'Строка')) {
		const collection = createProcessVariable('Список комментариев', 'Строка')
		collection.isCollection = true
		collection.collectionValues = ['Первый комментарий', 'Второй комментарий']
		additions.push(collection)
	}
	processVariables.value = [...processVariables.value, ...additions]
}
</script>

<template lang="pug">
q-page(padding)
	.value-demo
		.text-h5 Выбор значения процесса
		.text-caption.text-grey-7 Выберите переменную, введите значение подходящего типа или воспользуйтесь справочником.
		q-select(v-model="selectedInstanceId" :options="processOptions" label="Процесс" emit-value map-options dense outlined options-dense)
		.row.items-center.q-gutter-md
			q-checkbox(v-model="disabled" label="Отключено" dense)
			q-checkbox(v-model="readonly" label="Только чтение" dense)
			q-btn(flat dense color="primary" icon="mdi-plus" label="Добавить примеры переменных" @click="addExamples")
		.value-examples
			q-card.example-card(v-for="type in processValueTypes" :key="`${instance.id}:${type}`" flat bordered)
				q-card-section
					.text-subtitle2.q-mb-md {{ type }}
					ProcessValueInput(v-model="values[type]" :type="type" :disable="disabled" :readonly="readonly")
					pre.model-preview {{ JSON.stringify(values[type], null, 2) }}
		q-expansion-item.variables-example(label="Переменные текущего процесса" default-opened expand-separator header-class="text-primary")
			.q-pa-md
				VariablesSettingsTab
</template>

<style scoped lang="scss">
.value-demo {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
	max-width: 1000px;
	margin: 0 auto;
	padding-bottom: 2rem;
}

.value-examples {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
	gap: 1rem;
}

.example-card,
.variables-example {
	min-width: 0;
	background: var(--bg-panel);
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
}

.model-preview {
	margin: 1rem 0 0;
	padding: 0.75rem;
	border-radius: var(--rad);
	background: var(--bgLight);
	font-size: 0.75rem;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
}
</style>
