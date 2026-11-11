<script setup lang="ts">
import { computed, ref } from 'vue'
import MdiCounter from '@/components/icons/MdiCounter.vue'
import NumeratorsList from './NumeratorsList.vue'
import CreateNumeratorRuleDialog from './CreateNumeratorRuleDialog.vue'
import CreateNumeratorDialog from './CreateNumeratorDialog.vue'
import NumeratorRuleEditor from './NumeratorRuleEditor.vue'
import NumeratorEditor from './NumeratorEditor.vue'
import { useNumerationState } from './useNumerationState'
import type { INumeratorDraft, INumeratorRuleDraft, INumeratorUsage } from './types'

const {
	section,
	ruleCatalog,
	numerators,
	catalog,
	selectedRuleId,
	selectedNumeratorId,
	selectedVariantIds,
	selectedVariantSections,
	selectVariant,
	selectedRule,
	selectedNumerator,
	returnTarget,
	isRuleChanged,
	isNumeratorChanged,
	getUsages,
	openRule,
	createRule,
	saveRule,
	cancelRule,
	openNumerator,
	createNumerator,
	canSaveNumerator,
	saveNumerator,
	cancelNumerator,
	backToRule,
} = useNumerationState()
const createDialog = ref(false)
const createNumeratorDialog = ref(false)
const numeratorCreationTarget = ref<INumeratorUsage | null>(null)
const ruleQuery = ref<string | null>('')
const numeratorQuery = ref<string | null>('')
const listWidth = ref(20)
const expandedListWidth = ref(20)
const ruleItems = computed(() =>
	ruleCatalog.value.map((rule) => ({
		id: rule.id,
		name: rule.name || 'Новое правило',
		changed: isRuleChanged(rule.id),
	}))
)
const numeratorItems = computed(() =>
	catalog.value.map((numerator) => ({
		id: numerator.id,
		name: numerator.name || 'Новый нумератор',
		changed: isNumeratorChanged(numerator.id),
		caption: `Правил: ${new Set(getUsages(numerator.id).map((usage) => usage.ruleId)).size}`,
	}))
)
const headingName = computed(() =>
	section.value === 'rules'
		? selectedRule.value?.name || 'Новое правило'
		: selectedNumerator.value?.name || 'Новый нумератор'
)

function addRule(draft: INumeratorRuleDraft) {
	ruleQuery.value = ''
	createRule(draft)
}

function addNumerator(target?: INumeratorUsage) {
	numeratorCreationTarget.value = target ?? null
	createNumeratorDialog.value = true
}

function addCreatedNumerator(draft: INumeratorDraft) {
	const target = numeratorCreationTarget.value
	createNumerator(draft, target ?? undefined)
	numeratorQuery.value = ''
	if (target) ruleQuery.value = ''
}

function showRule(id: string, variantId?: string) {
	ruleQuery.value = ''
	openRule(id, variantId)
}

function showNumerator(id: string, target?: INumeratorUsage) {
	numeratorQuery.value = ''
	openNumerator(id, target)
}

function returnToRule() {
	ruleQuery.value = ''
	backToRule()
}

function toggleList() {
	if (listWidth.value > 0) {
		expandedListWidth.value = listWidth.value
		listWidth.value = 0
	} else {
		listWidth.value = expandedListWidth.value
	}
}
</script>

<template lang="pug">
.numerators
	q-splitter.numerators__splitter(
		v-model="listWidth"
		:limits="[0, 50]"
		separator-class="numerators__separator bg-transparent"
		:separator-style="listWidth === 0 ? { borderLeft: 'none' } : undefined"
		after-class="numerators__editor-pane"
	)
		template(v-slot:before)
			.numerators__navigation(v-show="listWidth > 0")
				q-tabs(
					v-model="section"
					dense
					no-caps
					active-color="primary"
					indicator-color="primary"
					align="justify"
				)
					q-tab( name="rules" label="Правила")
					q-tab( name="numerators" label="Нумераторы")
				NumeratorsList(
					v-show="section === 'rules'"
					:model-value="selectedRuleId"
					v-model:query="ruleQuery"
					:items="ruleItems"
					kind="rules"
					@update:model-value="$event && openRule($event)"
					@create="createDialog = true"
				)
				NumeratorsList(
					v-show="section === 'numerators'"
					:model-value="selectedNumeratorId"
					v-model:query="numeratorQuery"
					:items="numeratorItems"
					kind="numerators"
					@update:model-value="$event && openNumerator($event)"
					@create="addNumerator()"
				)
		template(v-slot:after)
			.numerators__editor
				.row.items-center.no-wrap
					q-btn( flat round dense
						color="primary"
						:icon="listWidth === 0 ? 'mdi-forwardburger' : 'mdi-backburger'"
						:title="listWidth === 0 ? 'Показать список' : 'Скрыть список'"
						@click="toggleList"
					)
					.numerators__heading
						MdiCounter.numerators__heading-icon
						.numerators__heading-text
							.numerators__overline.text-overline
								| {{ section === 'rules' ? 'правило нумерации' : 'нумератор' }}
							.numerators__name {{ headingName }}
				.numerators__constructor
					NumeratorRuleEditor(
						v-if="section === 'rules' && selectedRule"
						:key="selectedRule.id"
						:rule="selectedRule"
						:numerators="numerators"
						:changed="isRuleChanged(selectedRule.id)"
						:selected-variant-id="selectedVariantIds[selectedRule.id]"
						:selected-variant-section="selectedVariantSections[selectedRule.id] ?? 'conditions'"
						@select-variant="(id, cell) => selectVariant(selectedRule.id, id, cell)"
						@save="saveRule(selectedRule.id)"
						@cancel="cancelRule(selectedRule.id)"
						@open-numerator="showNumerator"
						@create-numerator="addNumerator"
					)
					NumeratorEditor(
						v-else-if="section === 'numerators' && selectedNumerator"
						:key="selectedNumerator.id"
						:numerator="selectedNumerator"
						:usages="getUsages(selectedNumerator.id)"
						:changed="isNumeratorChanged(selectedNumerator.id)"
						:can-save="canSaveNumerator(selectedNumerator.id)"
						:can-return="!!returnTarget"
						@save="saveNumerator(selectedNumerator.id)"
						@cancel="cancelNumerator(selectedNumerator.id)"
						@back="returnToRule"
						@open-rule="showRule"
					)
	CreateNumeratorRuleDialog(
		v-model="createDialog"
		@create="addRule"
	)
	CreateNumeratorDialog(
		v-model="createNumeratorDialog"
		@create="addCreatedNumerator"
	)
</template>

<style scoped lang="scss">
.numerators__splitter {
	height: calc(100vh - 130px);
	min-height: 450px;
}

.numerators__splitter > :deep(.numerators__separator) {
	border-left: 2px dotted var(--q-primary);
}

.numerators__navigation {
	display: flex;
	flex-direction: column;
	height: 100%;
	margin-right: 0.5rem;
}

.numerators__navigation > .numerators-list {
	flex: 1;
	min-height: 0;
	height: auto;
}

.numerators__splitter > :deep(.numerators__editor-pane) {
	overflow: hidden;
}

.numerators__editor {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: 0;
	margin-left: 0.5rem;
	padding: 1rem;
}

.numerators__heading {
	display: flex;
	align-items: center;
	gap: 0.7rem;
	min-width: 0;
	margin-left: 0.7rem;
	overflow-wrap: anywhere;
}

.numerators__heading-text {
	min-width: 0;
}

.numerators__overline {
	color: #78909c;
	line-height: 1;
}

.numerators__name {
	margin-top: 0.3rem;
	font-size: 1rem;
	font-weight: 600;
	text-transform: uppercase;
}

.numerators__heading-icon {
	flex-shrink: 0;
	font-size: 2.3rem;
	color: var(--q-secondary);
}

.numerators__constructor {
	flex: 1;
	min-height: 0;
	margin-top: 0.5rem;
	overflow-y: auto;
}
</style>
