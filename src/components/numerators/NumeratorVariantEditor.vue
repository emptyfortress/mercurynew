<script setup lang="ts">
import { computed, ref } from 'vue'
import { names, status } from '@/stores/select'
import NumerationFieldSelect from './NumerationFieldSelect.vue'
import NumeratorAffixEditor from './NumeratorAffixEditor.vue'
import { findNumerationField } from './numerationFields'
import {
	createCondition,
	getAffixSchema,
	getConditionOperators,
	isValidCondition,
} from './ruleVariants'
import type {
	INumerationField,
	INumerationFieldNode,
	INumerator,
	INumeratorCondition,
	INumeratorRuleVariant,
	NumerationOperator,
	NumeratorVariantSection,
} from './types'

const props = defineProps<{
	variant: INumeratorRuleVariant
	section: NumeratorVariantSection
	fieldNodes: INumerationFieldNode[]
	cardType: string | null
	numerators: INumerator[]
	showLeadingZeros: boolean
}>()
const emit = defineEmits<{
	openNumerator: [id: string]
	createNumerator: []
}>()
const numeratorQuery = ref('')
const valueQueries = ref<Record<string, string>>({})
const numerator = computed(() => props.numerators.find((n) => n.id === props.variant.numeratorId))
const numeratorOptions = computed(() => props.numerators
	.filter((item) => item.name.toLocaleLowerCase('ru')
		.includes(numeratorQuery.value.trim().toLocaleLowerCase('ru')))
	.map((item) => ({ label: item.name, value: item.id }))
)
const invalidConditions = computed(() => props.variant.conditions
	.some((condition) => !isValidCondition(condition, props.cardType))
)
const numberSample = computed(() => {
	const lower = numerator.value?.lowerBound
	const upper = numerator.value?.upperBound
	let number = '[номер]'
	if (lower !== null && lower !== undefined && upper !== null && upper !== undefined) {
		number = props.showLeadingZeros
			? String(lower).padStart(String(upper).length, '0') : String(lower)
	}
	return getAffixSchema(props.variant.prefix, 'префикс') + number +
		getAffixSchema(props.variant.suffix, 'суффикс')
})

function setField(condition: INumeratorCondition, field: INumerationField | null) {
	if (condition.field?.id === field?.id) return
	condition.field = field
	condition.operator = 'equals'
	condition.value = null
	delete valueQueries.value[condition.id]
}

function isDepartment(operator: NumerationOperator) {
	return ['inDepartment', 'notInDepartment', 'inChildDepartment'].includes(operator)
}

function setOperator(condition: INumeratorCondition, operator: NumerationOperator) {
	if (isDepartment(condition.operator) !== isDepartment(operator)) {
		condition.value = null
		delete valueQueries.value[condition.id]
	}
	condition.operator = operator
}

function getValueOptions(condition: INumeratorCondition) {
	let options: string[] = []
	if (isDepartment(condition.operator)) {
		options = ['Бухгалтерия', 'Отдел продаж', 'Юридический отдел']
	} else if (condition.field?.type === 'employee') {
		options = names.filter((name) => /\s[А-Я]\./.test(name))
	} else if (condition.field?.type === 'organization') {
		options = names.slice(-3)
	} else if (condition.field?.type === 'status') {
		options = status
	}
	const query = (valueQueries.value[condition.id] ?? '').trim().toLocaleLowerCase('ru')
	return options.filter((option) => option.toLocaleLowerCase('ru').includes(query))
}

function filterValues(id: string, value: string, update: (callback: () => void) => void) {
	update(() => {
		valueQueries.value[id] = value
	})
}

function filterNumerators(value: string, update: (callback: () => void) => void) {
	update(() => {
		numeratorQuery.value = value
	})
}
</script>

<template lang="pug">
.variant-editor
	template(v-if="section === 'conditions'")
		.text-caption.text-grey-7.q-mb-md Выполнены все условия (И)
		.variant-editor__conditions
			.variant-editor__condition(
				v-for="(condition, index) in variant.conditions", :key="condition.id"
			)
				div
					NumerationFieldSelect(
						:model-value="condition.field", :nodes="fieldNodes",
						@update:model-value="setField(condition, $event)"
					)
					.text-negative.text-caption.q-mt-xs(
						v-if="condition.field && !findNumerationField(fieldNodes, condition.field.id)"
					) Поле недоступно для этого типа карточки
				q-select(
					:model-value="condition.operator", :options="getConditionOperators(condition.field?.type)",
					emit-value, map-options, outlined, dense, label="Операция", :disable="!condition.field",
					@update:model-value="setOperator(condition, $event)"
				)
				q-select(
					v-if="condition.field?.type === 'boolean'", v-model="condition.value",
					:options="[{label: 'Да', value: true}, {label: 'Нет', value: false}]",
					emit-value, map-options, outlined, dense, label="Значение"
				)
				q-select(
					v-else-if="['employee', 'organization', 'status'].includes(condition.field?.type ?? '')",
					v-model="condition.value", :options="getValueOptions(condition)",
					use-input, :input-debounce="0", outlined, dense,
					:label="isDepartment(condition.operator) ? 'Подразделение' : 'Значение'",
					@filter="(value, update) => filterValues(condition.id, value, update)",
					@popup-hide="valueQueries[condition.id] = ''"
				)
					template(v-slot:no-option)
						q-item
							q-item-section.text-grey-7 Ничего не найдено
				q-input(
					v-else-if="condition.field?.type === 'number'",
					:model-value="typeof condition.value === 'number' ? condition.value : null",
					type="number", outlined, dense, label="Значение",
					@update:model-value="condition.value = $event === '' || $event === null ? null : Number($event)"
				)
				q-input(
					v-else, :model-value="typeof condition.value === 'string' ? condition.value : ''",
					outlined, dense,
					:type="condition.field?.type === 'date' ? 'date' : 'text'",
					:label="condition.field?.type === 'date' ? undefined : 'Значение'",
					:disable="!condition.field",
					@update:model-value="condition.value = $event === null ? null : String($event)"
				)
				q-btn(
					flat, round, dense, icon="mdi-delete-outline", color="negative",
					title="Удалить условие", @click="variant.conditions.splice(index, 1)"
				)
		.text-grey-7(v-if="!variant.conditions.length") Применяется без проверки условий.
		.text-negative.text-caption.q-mt-sm(v-if="invalidConditions")
			| Заполните поле и значение каждого условия.
		q-btn.q-mt-sm(
			flat, color="primary", icon="mdi-plus", label="Добавить условие",
			:disable="!fieldNodes.length", @click="variant.conditions.push(createCondition())"
		)
		.text-caption.text-grey-7(v-if="!fieldNodes.length")
			| Выберите тип карточки, чтобы добавить условия.
	template(v-else-if="section === 'format'")
		.variant-editor__affixes
			NumeratorAffixEditor(v-model="variant.prefix", label="Префикс")
			NumeratorAffixEditor(v-model="variant.suffix", label="Суффикс")
		.variant-editor__sample.q-mt-md
			.text-caption.text-grey-7 Образец номера
			.variant-editor__sample-value {{ numberSample }}
			.text-caption.text-grey-7(
				v-if="variant.prefix.mode === 'xslt' || variant.suffix.mode === 'xslt'"
			) Части XSLT обозначены условно; результат зависит от данных карточки.
	template(v-else)
		.variant-editor__numerator
			q-select(
				v-model="variant.numeratorId", :options="numeratorOptions", use-input,
				:input-debounce="0", emit-value, map-options, outlined, dense, label="Нумератор",
				:rules="[value => !!value || 'Выберите нумератор']",
				@filter="filterNumerators", @popup-hide="numeratorQuery = ''"
			)
				template(v-slot:no-option)
					q-item
						q-item-section.text-grey-7 Ничего не найдено
			.text-caption.text-grey-7(v-if="numerator")
				| Границы: {{ numerator.lowerBound }}–{{ numerator.upperBound }}
			.row.q-gutter-xs
				q-btn(
					flat, color="primary", label="Открыть нумератор", size="sm",
					:disable="!variant.numeratorId",
					@click="variant.numeratorId && emit('openNumerator', variant.numeratorId)"
				)
				q-btn(
					flat, color="primary", label="Создать нумератор", size="sm",
					@click="emit('createNumerator')"
				)
</template>

<style scoped lang="scss">
.variant-editor {
	padding: 1rem;
	white-space: normal;
}

.variant-editor__conditions {
	display: grid;
	gap: 1rem;
}

.variant-editor__condition {
	display: grid;
	grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr) auto;
	align-items: start;
	gap: 0.5rem;
}

.variant-editor__affixes {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.variant-editor__sample {
	padding: 0.75rem;
	background: var(--bgLight);
	border-radius: var(--rad);
}

.variant-editor__sample-value {
	font-size: 1.1rem;
	overflow-wrap: anywhere;
	white-space: pre-wrap;
}

.variant-editor__numerator {
	max-width: 600px;
}

@media (max-width: 1000px) {
	.variant-editor__condition {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.variant-editor__condition > :first-child,
	.variant-editor__condition > :nth-child(2) {
		grid-column: 1 / -1;
	}

	.variant-editor__affixes {
		grid-template-columns: minmax(0, 1fr);
	}
}
</style>
