<script setup lang="ts">
import { computed } from 'vue'
import type { QTableColumn } from 'quasar'
import { useSimpleStore } from '@/stores/simpleStore'
import NumeratorVariantEditor from './NumeratorVariantEditor.vue'
import { getNumerationFieldTree } from './numerationFields'
import {
	createRuleVariant,
	getConditionsSummary,
	getNumberSchema,
	isValidVariant,
	moveVariant,
} from './ruleVariants'
import type {
	INumerator,
	INumeratorRule,
	INumeratorUsage,
	NumeratorVariantSection,
} from './types'

const props = defineProps<{
	rule: INumeratorRule
	numerators: INumerator[]
	changed: boolean
	selectedVariantId?: string
	selectedVariantSection: NumeratorVariantSection
}>()
const emit = defineEmits<{
	save: []
	cancel: []
	selectVariant: [id: string, section: NumeratorVariantSection]
	openNumerator: [id: string, target: INumeratorUsage]
	createNumerator: [target: INumeratorUsage]
}>()
const simpleStore = useSimpleStore()
const cardTypes = computed(() =>
	simpleStore.treeData.map((card) => ({ label: card.text, value: card.id }))
)
const fieldNodes = computed(() => getNumerationFieldTree(
	props.rule.cardType,
	cardTypes.value.find((card) => card.value === props.rule.cardType)?.label
))
const expandedRows = computed(() => props.selectedVariantId ? [props.selectedVariantId] : [])
const canSave = computed(() => Boolean(props.rule.name.trim()) &&
	props.rule.variants.every((variant) =>
		props.numerators.some((numerator) => numerator.id === variant.numeratorId) &&
		isValidVariant(variant, props.rule.cardType)
	)
)
const unconditionalBeforeLast = computed(() => props.rule.variants
	.slice(0, -1).some((variant) => variant.conditions.length === 0)
)
const columns: QTableColumn[] = [
	{ name: 'order', label: '№', field: 'id', align: 'left' },
	{ name: 'conditions', label: 'Условия', field: 'conditions', align: 'left' },
	{ name: 'format', label: 'Формат номера', field: 'prefix', align: 'left' },
	{ name: 'numerator', label: 'Нумератор', field: 'numeratorId', align: 'left' },
	{ name: 'actions', label: '', field: 'id', align: 'right' },
]
const sectionLabels: Record<NumeratorVariantSection, string> = {
	conditions: 'Условия',
	format: 'Формат номера',
	numerator: 'Нумератор',
}

function getTarget(variantId: string): INumeratorUsage {
	const index = props.rule.variants.findIndex((variant) => variant.id === variantId)
	return {
		ruleId: props.rule.id,
		ruleName: props.rule.name,
		variantId,
		variantNumber: index + 1,
	}
}

function addVariant() {
	const variant = createRuleVariant()
	props.rule.variants.push(variant)
	emit('selectVariant', variant.id, 'conditions')
}

function removeVariant(id: string) {
	const index = props.rule.variants.findIndex((variant) => variant.id === id)
	if (index < 0) return
	props.rule.variants.splice(index, 1)
	if (props.selectedVariantId === id) {
		emit('selectVariant', '', props.selectedVariantSection)
	}
}

function getNumeratorName(id: string | null) {
	return props.numerators.find((numerator) => numerator.id === id)?.name ?? 'Не выбран'
}
</script>

<template lang="pug">
q-form.rule-editor(@submit.prevent="canSave && emit('save')")
	.rule-editor__toolbar.row.items-center.justify-end.q-gutter-xs
		q-btn(
			unelevated, color="primary", label="Сохранить", size="sm", type="submit",
			:disable="!changed || !canSave"
		)
		q-btn(
			outline, color="primary", label="Отмена", size="sm", :disable="!changed",
			@click="emit('cancel')"
		)
	q-expansion-item(label="Свойства правила", header-class="bg-blue-grey-1")
		.rule-editor__properties.q-pa-md
			q-input(
				v-model="rule.name", outlined, dense, label="Имя правила",
				:rules="[value => !!value?.trim() || 'Введите имя правила']"
			)
			q-select(
				v-model="rule.cardType", :options="cardTypes", emit-value, map-options,
				outlined, dense, clearable, label="Тип карточки"
			)
			q-checkbox(v-model="rule.showLeadingZeros", label="Показывать ведущие нули")
	.text-subtitle1.q-mt-lg.q-mb-sm Варианты нумерации
	.text-caption.text-grey-7.q-mb-md
		| Проверяются сверху вниз. Применяется первый подходящий вариант.
	q-banner.q-mb-md.bg-orange-1(v-if="unconditionalBeforeLast", dense, rounded)
		| Вариант без условий подходит всем карточкам.
		|  Переместите его в конец, чтобы следующие варианты могли применяться.
	q-table.rule-editor__table(
		:rows="rule.variants", :columns="columns", row-key="id", flat, bordered,
		:expanded="expandedRows", hide-bottom, :pagination="{ rowsPerPage: 0 }"
	)
		template(v-slot:body="slot")
			q-tr(:props="slot", no-hover)
				q-td(key="order", :props="slot")
					span {{ slot.rowIndex + 1 }}
				q-td.rule-editor__cell(
					key="conditions", :props="slot", tabindex="0",
					:class="{ 'rule-editor__cell_active': slot.expand && selectedVariantSection === 'conditions' }",
					@click="emit('selectVariant', slot.row.id, 'conditions')",
					@keydown.enter.prevent="emit('selectVariant', slot.row.id, 'conditions')",
					@keydown.space.prevent="emit('selectVariant', slot.row.id, 'conditions')"
				)
					.row.no-wrap.items-center.q-gutter-x-sm
						.rule-editor__conditions-summary
							.rule-editor__summary-text(v-if="!slot.row.conditions.length") Без условий
							.rule-editor__summary-text(
								v-for="condition in slot.row.conditions", :key="condition.id",
								:title="getConditionsSummary([condition])"
							)
								| {{ getConditionsSummary([condition]) }}
						q-icon.rule-editor__edit-icon(name="mdi-pencil-outline", size="14px")
					.text-caption.text-negative(
						v-if="!isValidVariant(slot.row, rule.cardType) || !slot.row.numeratorId"
					) Вариант не заполнен
				q-td.rule-editor__cell(
					key="format", :props="slot", tabindex="0",
					:class="{ 'rule-editor__cell_active': slot.expand && selectedVariantSection === 'format' }",
					@click="emit('selectVariant', slot.row.id, 'format')",
					@keydown.enter.prevent="emit('selectVariant', slot.row.id, 'format')",
					@keydown.space.prevent="emit('selectVariant', slot.row.id, 'format')"
				)
					.row.no-wrap.items-center.q-gutter-x-sm
						.rule-editor__summary-text(:title="getNumberSchema(slot.row)")
							| {{ getNumberSchema(slot.row) }}
						q-icon.rule-editor__edit-icon(name="mdi-pencil-outline", size="14px")
				q-td.rule-editor__cell(
					key="numerator", :props="slot", tabindex="0",
					:class="{ 'rule-editor__cell_active': slot.expand && selectedVariantSection === 'numerator' }",
					@click="emit('selectVariant', slot.row.id, 'numerator')",
					@keydown.enter.prevent="emit('selectVariant', slot.row.id, 'numerator')",
					@keydown.space.prevent="emit('selectVariant', slot.row.id, 'numerator')"
				)
					.row.no-wrap.items-center.q-gutter-x-sm
						.rule-editor__summary-text(:title="getNumeratorName(slot.row.numeratorId)")
							| {{ getNumeratorName(slot.row.numeratorId) }}
						q-icon.rule-editor__edit-icon(name="mdi-pencil-outline", size="14px")
				q-td(key="actions", :props="slot")
					.row.no-wrap.justify-end
						q-btn(
							flat, round, dense, color="primary", icon="mdi-arrow-up",
							title="Переместить выше", :disable="slot.rowIndex === 0",
							@click.stop="moveVariant(rule.variants, slot.row.id, -1)"
						)
						q-btn(
							flat, round, dense, color="primary", icon="mdi-arrow-down",
							title="Переместить ниже", :disable="slot.rowIndex === rule.variants.length - 1",
							@click.stop="moveVariant(rule.variants, slot.row.id, 1)"
						)
						q-btn(
							flat, round, dense, color="negative", icon="mdi-delete-outline",
							title="Удалить вариант", @click.stop="removeVariant(slot.row.id)"
						)
			q-tr(v-if="slot.expand", :key="slot.row.id + '-editor'", :props="slot", no-hover)
				q-td.rule-editor__expanded(colspan="100%")
					.rule-editor__expanded-heading.row.items-center.justify-between
						.text-subtitle2
							| {{ sectionLabels[selectedVariantSection] }} · Вариант {{ slot.rowIndex + 1 }}
						q-btn(
							flat, round, dense, color="primary", icon="mdi-close",
							title="Закрыть настройки",
							@click="emit('selectVariant', '', selectedVariantSection)"
						)
					NumeratorVariantEditor(
						:variant="slot.row", :field-nodes="fieldNodes", :card-type="rule.cardType",
						:section="selectedVariantSection",
						:numerators="numerators", :show-leading-zeros="rule.showLeadingZeros",
						@open-numerator="emit('openNumerator', $event, getTarget(slot.row.id))",
						@create-numerator="emit('createNumerator', getTarget(slot.row.id))"
					)
		template(v-slot:no-data)
			.q-pa-md.text-grey-7 Добавьте вариант и выберите нумератор.
	q-btn.q-mt-sm(
		flat, color="primary", icon="mdi-plus", label="Добавить вариант", @click="addVariant"
	)
</template>

<style scoped lang="scss">
.rule-editor__toolbar {
	margin-bottom: 1rem;
}

.rule-editor__properties {
	display: grid;
	gap: 1rem;
	max-width: 600px;
}

.rule-editor__cell {
	cursor: pointer;
}

.no-touch .rule-editor__cell:hover {
	background: var(--bgLight);
}

.rule-editor__cell_active,
.no-touch .rule-editor__cell_active:hover {
	background: var(--dvviolet);
	color: var(--dark2);
}

.rule-editor__cell:focus-visible {
	outline: 2px solid var(--q-primary);
	outline-offset: -2px;
}

.rule-editor__edit-icon {
	flex-shrink: 0;
	opacity: 0.6;
}

.rule-editor__expanded-heading {
	padding: 0.5rem 1rem;
	background: var(--bgLight);
	border-top: 2px solid var(--q-primary);
}

.rule-editor__summary-text {
	max-width: 220px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.rule-editor__conditions-summary {
	display: grid;
	gap: 0.25rem;
}

.rule-editor__table :deep(.rule-editor__expanded) {
	padding: 0;
}
</style>
