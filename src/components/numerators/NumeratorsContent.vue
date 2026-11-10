<script setup lang="ts">
import { computed, ref } from 'vue'
import MdiCounter from '@/components/icons/MdiCounter.vue'
import NumeratorsList from './NumeratorsList.vue'
import CreateNumeratorRuleDialog from './CreateNumeratorRuleDialog.vue'
import type { INumeratorRule, INumeratorRuleDraft } from './types'

const rules = ref<INumeratorRule[]>(
	['Акт', 'Договор', 'Дополнительное соглашение'].map((name, index) => ({
		id: `demo-${index}`,
		name,
		cardType: null,
		showLeadingZeros: false,
	}))
)
const selectedId = ref('demo-0')
const selectedRule = computed(() => rules.value.find((rule) => rule.id === selectedId.value))
const createDialog = ref(false)
const listWidth = ref(20)
const expandedListWidth = ref(20)

function createRule(draft: INumeratorRuleDraft) {
	const rule = { ...draft, id: crypto.randomUUID() }
	rules.value.push(rule)
	selectedId.value = rule.id
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
				NumeratorsList(
					v-model="selectedId"
					:rules="rules"
					@create="createDialog = true"
				)
		template(v-slot:after)
			.numerators__editor
				.row.items-center.no-wrap
					q-btn(
						flat
						round
						dense
						color="primary"
						:icon="listWidth === 0 ? 'mdi-forwardburger' : 'mdi-backburger'"
						:title="listWidth === 0 ? 'Показать список нумераторов' : 'Скрыть список нумераторов'"
						@click="toggleList"
					)
					.numerators__heading
						MdiCounter.numerators__heading-icon
						.numerators__heading-text
							.numerators__overline.text-overline нумератор
							.numerators__name {{ selectedRule?.name }}
				.numerators__constructor
	CreateNumeratorRuleDialog(
		v-model="createDialog"
		@create="createRule"
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
	height: 100%;
	margin-right: 0.5rem;
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
}
</style>
