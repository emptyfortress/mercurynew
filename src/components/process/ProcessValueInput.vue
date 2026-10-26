<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { QPopupProxy, QSelect } from 'quasar'
import EmployeeDialog from '@/components/decision/EmployeeDialog.vue'
import { instance, processVariables } from './singleMonitorLayoutState'
import {
	isLocalDateTime,
	matchingVariables,
	parseLiteralInput,
	processValueError,
	processValueLabel,
	type ProcessValue,
	type ProcessValueType,
} from './processValue'

const props = withDefaults(
	defineProps<{
		type: ProcessValueType
		label?: string
		disable?: boolean
		readonly?: boolean
	}>(),
	{ label: 'Значение', disable: false, readonly: false }
)
const model = defineModel<ProcessValue>({ default: null })

type ValueOption = {
	key: string
	label: string
	sourceLabel: string
	icon: string
	value: Exclude<ProcessValue, null>
}

const sourceLabels = { variable: 'Переменная', literal: 'Значение', directory: 'Справочник' }
const sourceIcons = {
	variable: 'mdi-code-braces',
	literal: 'mdi-form-textbox',
	directory: 'mdi-account-outline',
}
const select = ref<QSelect>()
const datePopup = ref<QPopupProxy>()
const query = ref('')
const inputError = ref('')
const employeeOpen = ref(false)
const dateDraft = ref('')
const inactive = computed(() => props.disable || props.readonly)
const compatibleVariables = computed(() => matchingVariables(processVariables.value, props.type))
const errorMessage = computed(
	() => inputError.value || processValueError(model.value, props.type, processVariables.value)
)

function option(value: Exclude<ProcessValue, null>, label?: string): ValueOption {
	return {
		key:
			value.source === 'variable'
				? `variable:${value.variableId}`
				: value.source === 'directory'
					? `employee:${value.itemId}`
					: `literal:${JSON.stringify(value.value)}`,
		label: label ?? processValueLabel(value, processVariables.value, props.type),
		sourceLabel: sourceLabels[value.source],
		icon: sourceIcons[value.source],
		value,
	}
}

const selectedOption = computed(() => (model.value === null ? null : option(model.value)))
const options = computed(() => {
	const text = query.value.toLocaleLowerCase('ru')
	const result = compatibleVariables.value
		.filter((variable) => variable.name.toLocaleLowerCase('ru').includes(text))
		.map((variable) => option({ source: 'variable', variableId: variable.id }))
	if (props.type === 'Логический') {
		for (const value of [true, false]) {
			const item = option({ source: 'literal', value })
			if (item.label.toLocaleLowerCase('ru').includes(text)) result.push(item)
		}
	} else {
		const literal = parseLiteralInput(props.type, query.value)
		if (literal)
			result.push(
				option(
					literal,
					query.value === ''
						? 'Использовать пустую строку'
						: `Использовать введённое значение: ${query.value}`
				)
			)
	}
	return result
})

function clearSearch() {
	query.value = ''
	inputError.value = ''
	select.value?.updateInputValue('', true)
}

function filterOptions(value: string, update: (callback: () => void) => void) {
	update(() => {
		query.value = value
		inputError.value = ''
	})
}

function chooseOption(item: ValueOption | null) {
	if (inactive.value) return
	model.value = item?.value ?? null
	clearSearch()
}

function createLiteral(value: string, done: (item?: ValueOption) => void) {
	if (inactive.value) return
	const literal = parseLiteralInput(props.type, value)
	if (literal) done(option(literal))
	else if (props.type === 'Целое число' || props.type === 'Дробное число') {
		inputError.value = props.type === 'Целое число' ? 'Введите целое число' : 'Введите число'
	}
}

function openEmployees() {
	if (inactive.value) return
	select.value?.hidePopup()
	clearSearch()
	employeeOpen.value = true
}

function selectEmployee(employee: { id: string; label: string }) {
	if (inactive.value || props.type !== 'Сотрудник DV') return
	model.value = {
		source: 'directory',
		directory: 'employees',
		itemId: employee.id,
		label: employee.label,
	}
	clearSearch()
}

function openDate() {
	select.value?.hidePopup()
	clearSearch()
	dateDraft.value =
		model.value?.source === 'literal' &&
		typeof model.value.value === 'string' &&
		isLocalDateTime(model.value.value)
			? model.value.value
			: ''
}

function applyDate() {
	if (inactive.value || props.type !== 'Дата и время' || !isLocalDateTime(dateDraft.value)) return
	model.value = { source: 'literal', value: dateDraft.value }
	datePopup.value?.hide()
	clearSearch()
}

function closePickers() {
	employeeOpen.value = false
	datePopup.value?.hide()
	select.value?.hidePopup()
	clearSearch()
}

watch(
	() => props.type,
	() => {
		model.value = null
		closePickers()
	}
)
watch(() => instance.value.id, closePickers)
watch(inactive, (value) => {
	if (value) closePickers()
})
</script>

<template lang="pug">
.process-value-input
	q-select(ref="select" :model-value="selectedOption" :options="options" :label="label" :disable="disable" :readonly="readonly" option-label="label" option-value="key" use-input :input-debounce="0" disable-tab-selection dense outlined clearable hide-bottom-space :error="!!errorMessage" :error-message="errorMessage" @filter="filterOptions" @new-value="createLiteral" @update:model-value="chooseOption" @blur="clearSearch" @popup-hide="clearSearch")
		template(v-slot:selected-item="{ opt }")
			.selected-value
				q-icon(:name="opt.icon" color="primary" size="16px")
				span.source-label {{ opt.sourceLabel }}:
				span {{ opt.label }}
		template(v-slot:option="scope")
			q-item(v-bind="scope.itemProps")
				q-item-section(side)
					q-icon(:name="scope.opt.icon" color="primary" size="18px")
				q-item-section
					.row.justify-between.items-center
						q-item-label {{ scope.opt.label }}
						q-item-label(caption) {{ scope.opt.sourceLabel }}
		template(v-slot:no-option)
			q-item
				q-item-section.text-grey-7 Нет подходящих переменных
		template(v-slot:append)
			q-btn(v-if="type === 'Сотрудник DV'" flat round dense size="sm" color="primary" icon="mdi-account-search-outline" title="Выбрать сотрудника из справочника" :disable="inactive" @click.stop="openEmployees")
				q-tooltip Справочник сотрудников
			q-btn(v-if="type === 'Дата и время'" flat round dense size="sm" color="primary" icon="mdi-calendar-clock" title="Выбрать дату и время" :disable="inactive" @click.stop)
				q-popup-proxy(v-if="!inactive" ref="datePopup" @before-show="openDate")
					q-card.date-editor
						q-form(@submit="applyDate")
							q-card-section
								.text-subtitle2.q-mb-sm Дата и время
								q-input(v-model="dateDraft" type="datetime-local" label="Значение" dense outlined stack-label autofocus :rules="[value => isLocalDateTime(value) || 'Укажите корректную дату и время']")
							q-card-actions(align="right")
								q-btn(flat color="primary" label="Отмена" v-close-popup)
								q-btn(unelevated color="primary" label="Применить" type="submit" :disable="!isLocalDateTime(dateDraft)")
				q-tooltip Дата и время
	EmployeeDialog(v-model="employeeOpen" @select-item="selectEmployee")
</template>

<style scoped lang="scss">
.process-value-input {
	min-width: 0;
}

.selected-value {
	display: inline-flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.25rem;
	max-width: 100%;
	overflow-wrap: anywhere;
}

.source-label {
	color: var(--q-primary);
	font-size: 0.75rem;
}

.date-editor {
	width: 320px;
	max-width: calc(100vw - 32px);
}
</style>
