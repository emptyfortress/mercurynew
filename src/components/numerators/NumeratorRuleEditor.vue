<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import type { QTable, QTableColumn } from 'quasar'
import { useSimpleStore } from '@/stores/simpleStore'
import NumeratorVariantEditor from './NumeratorVariantEditor.vue'
import { getNumerationFieldTree } from './numerationFields'
import {
	createRuleVariant,
	getConditionParts,
	getConditionsSummary,
	getNumberSchema,
	isValidVariant,
} from './ruleVariants'
import type {
	INumerator,
	INumeratorRule,
	INumeratorRuleVariant,
	INumeratorUsage,
	NumeratorVariantSection,
} from './types'

const props = defineProps<{
	rule: INumeratorRule
	numerators: INumerator[]
	selectedVariantId?: string
	selectedVariantSection: NumeratorVariantSection
}>()
const emit = defineEmits<{
	selectVariant: [id: string, section: NumeratorVariantSection]
	openNumerator: [id: string, target: INumeratorUsage]
	createNumerator: [target: INumeratorUsage]
}>()
const simpleStore = useSimpleStore()
const variantTable = ref<QTable>()
const [dragParent, variantRows] = useDragAndDrop<INumeratorRuleVariant>([...props.rule.variants], {
	dragHandle: '.rule-editor__drag-handle',
	draggable: (element) => element.classList.contains('rule-editor__variant-row'),
	dropZone: false,
	onSort: ({ values }) => {
		props.rule.variants = [...values]
	},
})

onMounted(() => {
	const element = variantTable.value?.$el as HTMLElement | undefined
	dragParent.value = element?.querySelector<HTMLTableSectionElement>('tbody') ?? undefined
})

watch(
	() => props.rule.variants.slice(),
	(variants) => {
		variantRows.value = variants
	}
)

const cardTypes = computed(() =>
	simpleStore.treeData.map((card) => ({ label: card.text, value: card.id }))
)
const fieldNodes = computed(() =>
	getNumerationFieldTree(
		props.rule.cardType,
		cardTypes.value.find((card) => card.value === props.rule.cardType)?.label
	)
)
const expandedRows = computed(() => (props.selectedVariantId ? [props.selectedVariantId] : []))
const unconditionalBeforeLast = computed(() =>
	props.rule.variants.slice(0, -1).some((variant) => variant.conditions.length === 0)
)
const columns: QTableColumn[] = [
	{ name: 'handle', label: '', field: 'id', align: 'left' },
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

function toggleVariantCell(id: string, section: NumeratorVariantSection) {
	const isActive = props.selectedVariantId === id && props.selectedVariantSection === section
	emit('selectVariant', isActive ? '' : id, section)
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

.rule-editor
	.rule-editor__properties
		.rule-editor__property
			.rule-editor__property-label.text-caption.text-grey-7 Имя правила
			q-input(
				v-model="rule.name", outlined, dense,
				:rules="[value => !!value?.trim() || 'Введите имя правила']"
			)
		.rule-editor__property
			.rule-editor__property-label.text-caption.text-grey-7 Тип карточки
			q-select(
				v-model="rule.cardType", :options="cardTypes", emit-value, map-options,
				outlined, dense, clearable
			)
		.rule-editor__property.rule-editor__property_checkbox
			q-checkbox(v-model="rule.showLeadingZeros", label="Показывать ведущие нули")
	.rule-editor__variants-panel
		.text-subtitle1.q-mb-sm Варианты нумерации
		.text-caption.text-grey-7.q-mb-md
			| Проверяются сверху вниз. Применяется первый подходящий вариант.
		q-banner.q-mb-md.bg-orange-1(v-if="unconditionalBeforeLast", dense, rounded)
			| Вариант без условий подходит всем карточкам.
			|  Переместите его в конец, чтобы следующие варианты могли применяться.
		q-table.rule-editor__table(
			ref="variantTable", :rows="variantRows", :columns="columns", row-key="id", flat, bordered,
			:expanded="expandedRows", hide-bottom, :pagination="{ rowsPerPage: 0 }"
		)
			template(v-slot:body="slot")
				q-tr.rule-editor__variant-row(
					:key="slot.row.id", :props="slot", no-hover,
					:class="{ 'rule-editor__variant-row_open': slot.expand }"
				)
					q-td.rule-editor__handle-cell(key="handle", :props="slot", auto-width)
						q-icon.rule-editor__drag-handle(
							name="mdi-drag", size="22px", color="primary",
							title="Перетащите, чтобы изменить порядок"
						)
					q-td.rule-editor__cell(
						key="conditions", :props="slot", tabindex="0",
						:class="{ 'rule-editor__cell_active': slot.expand && selectedVariantSection === 'conditions' }",
						@click="toggleVariantCell(slot.row.id, 'conditions')",
						@keydown.enter.prevent="toggleVariantCell(slot.row.id, 'conditions')",
						@keydown.space.prevent="toggleVariantCell(slot.row.id, 'conditions')"
					)
						.row.no-wrap.items-center.q-gutter-x-sm
							.rule-editor__conditions-summary
								.rule-editor__summary-text(v-if="!slot.row.conditions.length") Без условий
								.rule-editor__condition-row(
									v-for="condition in slot.row.conditions", :key="condition.id",
									:title="getConditionsSummary([condition])"
								)
									q-chip.rule-editor__condition-chip(
										color="blue-2", text-color="dark", dense,
										:class="{ 'rule-editor__condition-part_incomplete': !condition.field }"
									) {{ getConditionParts(condition).field }}
									q-chip.rule-editor__condition-chip(
										color="blue-2", text-color="dark", dense
									) {{ getConditionParts(condition).operation }}
									q-chip.rule-editor__condition-chip(
										color="blue-2", text-color="dark", dense
									) {{ getConditionParts(condition).value }}
							q-icon.rule-editor__edit-icon(name="mdi-pencil-outline", size="14px")
							.text-caption.text-negative(
								v-if="!isValidVariant(slot.row, rule.cardType) || !slot.row.numeratorId"
							) Вариант не заполнен
					q-td.rule-editor__cell(
						key="format", :props="slot", tabindex="0",
						:class="{ 'rule-editor__cell_active': slot.expand && selectedVariantSection === 'format' }",
						@click="toggleVariantCell(slot.row.id, 'format')",
						@keydown.enter.prevent="toggleVariantCell(slot.row.id, 'format')",
						@keydown.space.prevent="toggleVariantCell(slot.row.id, 'format')"
					)
						.row.no-wrap.items-center.q-gutter-x-sm
							.rule-editor__summary-text(:title="getNumberSchema(slot.row)")
								| {{ getNumberSchema(slot.row) }}
							q-icon.rule-editor__edit-icon(name="mdi-pencil-outline", size="14px")
					q-td.rule-editor__cell(
						key="numerator", :props="slot", tabindex="0",
						:class="{ 'rule-editor__cell_active': slot.expand && selectedVariantSection === 'numerator' }",
						@click="toggleVariantCell(slot.row.id, 'numerator')",
						@keydown.enter.prevent="toggleVariantCell(slot.row.id, 'numerator')",
						@keydown.space.prevent="toggleVariantCell(slot.row.id, 'numerator')"
					)
						.row.no-wrap.items-center.q-gutter-x-sm
							.rule-editor__summary-text(:title="getNumeratorName(slot.row.numeratorId)")
								| {{ getNumeratorName(slot.row.numeratorId) }}
							q-icon.rule-editor__edit-icon(name="mdi-pencil-outline", size="14px")
					q-td.rule-editor__actions-cell(key="actions", :props="slot", auto-width)
						.row.no-wrap.justify-end
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
.rule-editor__variants-panel {
	margin-top: 1.5rem;
	padding: 1rem;
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
	background: var(--bg-panel);
}

.rule-editor__table :deep(.q-markup-table) {
	background: transparent;
}

.rule-editor__properties {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 300px));
	align-items: start;
	gap: 1rem;
	margin-bottom: 1rem;
}

@media (max-width: 1000px) {
	.rule-editor__properties {
		grid-template-columns: repeat(2, minmax(0, 300px));
	}
}

@media (max-width: 640px) {
	.rule-editor__properties {
		grid-template-columns: minmax(0, 300px);
	}
}

.rule-editor__property {
	min-width: 0;
	max-width: 300px;
}

.rule-editor__property-label {
	margin-bottom: 0.25rem;
}

.rule-editor__property_checkbox {
	display: flex;
	align-items: center;
	padding-top: 1.5rem;
}

.rule-editor__property :deep(.q-field) {
	width: 100%;
}

.rule-editor__cell {
	cursor: pointer;
}

.rule-editor__handle-cell {
	width: 40px;
}

.rule-editor__actions-cell {
	width: 1%;
	padding-right: 0;
	padding-left: 0;
	white-space: nowrap;
}

.rule-editor__drag-handle {
	cursor: grab;
	touch-action: none;
	user-select: none;
}

.rule-editor__drag-handle:active {
	cursor: grabbing;
}

.no-touch .rule-editor__cell:hover {
	background: var(--bgLight);
}

.no-touch .rule-editor__cell_active:hover {
	background: inherit;
}

.rule-editor__table :deep(.rule-editor__variant-row_open > td) {
	border-bottom: 3px solid var(--dvviolet);
}

.rule-editor__table :deep(.rule-editor__variant-row_open > .rule-editor__cell_active) {
	border-bottom-color: transparent;
	box-shadow:
		inset 3px 0 var(--dvviolet),
		inset -3px 0 var(--dvviolet),
		inset 0 3px var(--dvviolet);
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
}

.rule-editor__summary-text {
	max-width: 220px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.rule-editor__condition-part_incomplete {
	color: var(--q-negative);
	font-style: italic;
}

.rule-editor__conditions-summary {
	flex: 1;
	min-width: 0;
	display: grid;
	gap: 0.25rem;
}

.rule-editor__condition-row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.25rem;
}

.rule-editor__condition-chip {
	max-width: 100%;
	margin: 0;
	height: auto;
	min-height: 24px;
	white-space: normal;
}

.rule-editor__conditions-summary > .rule-editor__summary-text {
	max-width: none;
	min-width: 0;
	overflow: visible;
	text-overflow: clip;
	white-space: normal;
	overflow-wrap: anywhere;
}

.rule-editor__table :deep(.rule-editor__expanded) {
	padding: 0;
	border: 3px solid var(--dvviolet);
	border-top: 0;
}
</style>
