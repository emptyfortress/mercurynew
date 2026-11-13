<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import type { QTable, QTableColumn } from 'quasar'
import { useSimpleStore } from '@/stores/simpleStore'
import NumeratorVariantEditor from './NumeratorVariantEditor.vue'
import { getNumerationFieldTree } from './numerationFields'
import {
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
	variantDraft?: INumeratorRuleVariant
	selectedVariantId?: string
	selectedVariantSection: NumeratorVariantSection
}>()
const emit = defineEmits<{
	selectVariant: [id: string, section: NumeratorVariantSection]
	addVariant: []
	saveVariant: []
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
const drawerVisible = computed({
	get: () => Boolean(props.variantDraft),
	set: (visible) => {
		if (!visible) emit('selectVariant', '', props.selectedVariantSection)
	},
})
const variantNumber = computed(() => {
	const index = props.rule.variants.findIndex((item) => item.id === props.variantDraft?.id)
	return index < 0 ? props.rule.variants.length + 1 : index + 1
})
const canSaveVariant = computed(() =>
	Boolean(
		props.variantDraft &&
		isValidVariant(props.variantDraft, props.rule.cardType) &&
		props.numerators.some((item) => item.id === props.variantDraft?.numeratorId)
	)
)
const unconditionalBeforeLast = computed(() =>
	props.rule.variants.slice(0, -1).some((variant) => variant.conditions.length === 0)
)
const columns: QTableColumn[] = [
	{ name: 'handle', label: '', field: 'id', align: 'left' },
	{ name: 'variant', label: 'Вариант', field: 'id', align: 'left' },
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

function openVariant(id: string) {
	emit('selectVariant', props.variantDraft?.id === id ? '' : id, 'conditions')
}

function getTarget(variantId: string): INumeratorUsage {
	const index = props.rule.variants.findIndex((variant) => variant.id === variantId)
	return {
		ruleId: props.rule.id,
		ruleName: props.rule.name,
		variantId,
		variantNumber: index < 0 ? props.rule.variants.length + 1 : index + 1,
	}
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
		q-table.rule-editor__table(
			ref="variantTable", :rows="variantRows", :columns="columns", row-key="id", flat, bordered,
			hide-bottom, :pagination="{ rowsPerPage: 0 }"
		)
			template(v-slot:body="slot")
				q-tr.rule-editor__variant-row(
					:key="slot.row.id", :props="slot", tabindex="0",
					:class="{ 'rule-editor__variant-row_open': selectedVariantId === slot.row.id }",
					@click="openVariant(slot.row.id)",
					@keydown.enter.self.prevent="openVariant(slot.row.id)",
					@keydown.space.self.prevent="openVariant(slot.row.id)"
				)
					q-td.rule-editor__handle-cell(key="handle", :props="slot", auto-width, @click.stop="")
						q-icon.rule-editor__drag-handle(
							name="mdi-drag", size="22px", color="primary",
							title="Перетащите, чтобы изменить порядок"
						)
					q-td(key="variant", :props="slot", auto-width) {{ slot.rowIndex + 1 }}
					q-td.rule-editor__cell(key="conditions", :props="slot")
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
							.text-caption.text-negative(
								v-if="!isValidVariant(slot.row, rule.cardType) || !slot.row.numeratorId"
							) Вариант не заполнен
					q-td.rule-editor__cell(key="format", :props="slot")
						.row.no-wrap.items-center.q-gutter-x-sm
							.rule-editor__summary-text(:title="getNumberSchema(slot.row)")
								| {{ getNumberSchema(slot.row) }}
					q-td.rule-editor__cell(key="numerator", :props="slot")
						.row.no-wrap.items-center.q-gutter-x-sm
							.rule-editor__summary-text(:title="getNumeratorName(slot.row.numeratorId)")
								| {{ getNumeratorName(slot.row.numeratorId) }}
					q-td.rule-editor__actions-cell(key="actions", :props="slot", auto-width)
						.row.no-wrap.justify-end
							q-btn(
								flat, round, dense, color="primary", icon="mdi-pencil-outline",
								title="Настроить вариант", @click.stop="openVariant(slot.row.id)"
							)
							q-btn(
								flat, round, dense, color="negative", icon="mdi-delete-outline",
								title="Удалить вариант", @click.stop="removeVariant(slot.row.id)"
							)
			template(v-slot:no-data)
				.q-pa-md.text-grey-7 Добавьте вариант и выберите нумератор.
		q-banner.q-mt-md.bg-orange-1(v-if="unconditionalBeforeLast", dense, rounded)
			| Вариант без условий подходит всем карточкам.
			|  Переместите его в конец, чтобы следующие варианты могли применяться.
		q-btn.q-mt-sm(
			flat, color="primary", icon="mdi-plus", label="Добавить вариант", @click="emit('addVariant')"
		)
	Teleport(to="body")
		q-drawer(
			v-model="drawerVisible", side="right",
			:width="Math.min(760, $q.screen.width * 0.9)",
			overlay, persistent, bordered, behavior="desktop", no-swipe-open, no-swipe-close
		)
			.rule-editor__drawer(v-if="variantDraft")
				.rule-editor__drawer-header
					.rule-editor__drawer-title Вариант {{ variantNumber }}
					q-btn(
						flat, round, dense, color="primary", icon="mdi-close",
						title="Закрыть настройки", @click="drawerVisible = false"
					)
				q-scroll-area.rule-editor__drawer-scroll
					.rule-editor__drawer-section(v-for="(label, section) in sectionLabels", :key="section")
						.rule-editor__section-title.row.items-end.q-gutter-x-xl
							span {{ label }}
							span.text-caption.text-grey-7.text-weight-regular(
								v-if="section === 'conditions' && variantDraft.conditions.length > 1"
							)
								| Должны выполняться все условия (И)
						NumeratorVariantEditor(
							:key="variantDraft.id + section",
							:variant="variantDraft", :field-nodes="fieldNodes", :card-type="rule.cardType",
							:section="section", :numerators="numerators",
							:show-leading-zeros="rule.showLeadingZeros",
							@open-numerator="emit('openNumerator', $event, getTarget(variantDraft.id))",
							@create-numerator="emit('createNumerator', getTarget(variantDraft.id))"
						)
				.rule-editor__drawer-actions
					q-btn(flat, color="primary", label="Отмена", @click="drawerVisible = false")
					q-btn(
						unelevated, color="primary", label="Сохранить", :disable="!canSaveVariant",
						@click="emit('saveVariant')"
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

.rule-editor__variant-row {
	cursor: pointer;
}

.rule-editor__table :deep(.rule-editor__variant-row_open > td) {
	background: var(--bgLight);
	box-shadow: inset 0 -2px var(--q-primary);
}

.rule-editor__variant-row:focus-visible {
	outline: 2px solid var(--q-primary);
	outline-offset: -2px;
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

.rule-editor__drawer {
	height: 100%;
	display: flex;
	flex-direction: column;
	min-width: 0;
}

.rule-editor__drawer-header {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	border-bottom: 1px solid var(--my-border-color);
	font-size: 1.05rem;
	font-weight: 600;
	line-height: 1.3;
}

.rule-editor__drawer-title {
	flex: 1;
}

.rule-editor__drawer-scroll {
	flex: 1;
	min-height: 0;
}

.rule-editor__drawer-section {
	padding: 1rem;
	border-bottom: 1px solid var(--my-border-color);
}

.rule-editor__section-title {
	margin-bottom: 0.75rem;
	font-size: 1.1rem;
	font-weight: 600;
}

.rule-editor__drawer-actions {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: white;
	box-shadow: 0 -2px 7px rgb(0 0 0 / 20%);
	flex: none;
}
</style>
