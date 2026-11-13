<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import NumeratorRangesEditor from './NumeratorRangesEditor.vue'
import NumeratorZonesEditor from './NumeratorZonesEditor.vue'
import NumeratorStatusesEditor from './NumeratorStatusesEditor.vue'
import type {
	INumerator, INumeratorUsage, INumeratorNumberTarget,
	NumeratorNumberOperation, NumeratorOccupancy,
} from './types'

const props = defineProps<{
	numerator: INumerator
	savedNumerator: INumerator
	occupancy: NumeratorOccupancy
	settingsChanged: boolean
	usages: INumeratorUsage[]
	canReturn: boolean
}>()
const emit = defineEmits<{
	back: []
	openRule: [id: string, variantId: string]
	operate: [operation: NumeratorNumberOperation, targets: INumeratorNumberTarget[]]
}>()
const activeTab = ref('ranges')
const statusZoneId = ref<string | null>(null)
watch(() => props.numerator.zones.map((zone) => zone.id), (ids) => {
	if (statusZoneId.value && !ids.includes(statusZoneId.value)) statusZoneId.value = null
})

function viewZoneNumbers(zoneId: string) {
	statusZoneId.value = zoneId
	activeTab.value = 'statuses'
}
const ruleCount = computed(() => new Set(props.usages.map((usage) => usage.ruleId)).size)
const boundsError = computed(() => {
	const { lowerBound, upperBound } = props.numerator
	if (!Number.isSafeInteger(lowerBound) || !Number.isSafeInteger(upperBound)) {
		return 'Укажите целые числа в обеих границах'
	}
	if (lowerBound !== null && upperBound !== null && lowerBound > upperBound) {
		return 'Начальная граница не должна превышать конечную'
	}
	return ''
})
</script>

<template lang="pug">

.numerator-editor
	q-btn.q-mb-md(
		v-if="canReturn"
		unelevated
		color="primary"
		icon="mdi-arrow-left"
		label="Вернуться к правилу"
		@click="emit('back')"
	)
	.numerator-editor__properties
		div
			.text-caption.text-grey-7.q-mb-xs Имя нумератора
			q-input(
				v-model="numerator.name", outlined, dense, autofocus,
				:rules="[value => !!value?.trim() || 'Введите имя нумератора']"
			)
		div
			.text-caption.text-grey-7.q-mb-xs Границы номеров
			.numerator-editor__bounds
				q-input(
					v-model.number="numerator.lowerBound", type="number", step="1",
					outlined, dense
				)
				span.numerator-editor__bounds-separator —
				q-input(
					v-model.number="numerator.upperBound", type="number", step="1",
					outlined, dense
				)
			.text-negative.text-caption(v-if="boundsError") {{ boundsError }}
		q-btn.numerator-editor__usage-link(
			flat, dense, no-caps, color="primary"
		)
			span Используется в правилах
			q-badge.q-ml-sm(color="white", text-color="dark", rounded) {{ ruleCount }}
			q-menu(max-height="360px")
				q-list.numerator-editor__usages(dense)
					q-item(
						v-for="usage in usages", :key="usage.ruleId + usage.variantId",
						clickable, v-close-popup,
						@click="emit('openRule', usage.ruleId, usage.variantId)"
					)
						q-item-section
							q-item-label {{ usage.ruleName }}
					.q-pa-md.text-grey-7(v-if="!usages.length")
						| Нумератор пока не используется в сохранённых правилах.
					q-separator(v-if="ruleCount")
					.q-pa-sm.text-caption.text-grey-7(v-if="ruleCount")
						| Изменения применятся ко всем использующим его правилам.
	.numerator-editor__tabs-row
		q-tabs(
			v-model="activeTab", align="left", no-caps, dense,
			active-color="primary", indicator-color="primary"
		)
			q-tab(name="ranges", label="Диапазоны")
			q-tab(name="statuses", label="Статус номеров")
	q-tab-panels.numerator-editor__panels(v-model="activeTab", keep-alive)
		q-tab-panel(name="ranges")
			NumeratorRangesEditor(:numerator="numerator")
			NumeratorZonesEditor(:numerator="numerator", @view-numbers="viewZoneNumbers")
		q-tab-panel(name="statuses")
			NumeratorStatusesEditor(
				v-model:zone-id="statusZoneId", :numerator="savedNumerator",
				:occupancy="occupancy", :settings-changed="settingsChanged",
				@operate="(operation, targets) => emit('operate', operation, targets)"
			)
</template>

<style scoped lang="scss">
.q-tabs {
	border-bottom: 1px solid var(--my-border-color);
	width: 100%;
}
.q-tab-panel {
	padding-left: 0;
	padding-right: 0;
}
.numerator-editor__properties {
	display: grid;
	grid-template-columns: minmax(0, 300px) minmax(0, 340px) max-content;
	align-items: start;
	gap: 1rem;
}

.numerator-editor__bounds {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
	align-items: center;
	gap: 0.5rem;
}

.numerator-editor__usage-link {
	margin-top: 1.5rem;
}

.numerator-editor__panels {
	background: transparent;
}

.numerator-editor__tabs-row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	margin-top: 1rem;
}

.numerator-editor__usages {
	width: 320px;
	max-width: calc(100vw - 48px);
}

@media (max-width: 1000px) {
	.numerator-editor__properties {
		grid-template-columns: minmax(0, 300px) minmax(0, 340px);
	}

	.numerator-editor__usage-link {
		grid-column: 1 / -1;
		justify-self: start;
		margin-top: 0;
	}
}

@media (max-width: 640px) {
	.numerator-editor__properties {
		grid-template-columns: minmax(0, 1fr);
	}
}
</style>
