<script setup lang="ts">
import { computed } from 'vue'
import type { INumerator, INumeratorUsage } from './types'

const props = defineProps<{
	numerator: INumerator
	usages: INumeratorUsage[]
	changed: boolean
	canSave: boolean
	canReturn: boolean
}>()
const emit = defineEmits<{
	save: []
	cancel: []
	back: []
	openRule: [id: string, variantId: string]
}>()
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
q-form.numerator-editor(@submit.prevent="canSave && emit('save')")
	.row.items-center.justify-between.q-mb-md.q-gutter-sm
		q-btn(
			v-if="canReturn"
			flat
			color="primary"
			icon="mdi-arrow-left"
			label="Вернуться к правилу"
			@click="emit('back')"
		)
		q-space(v-else)
		.row.q-gutter-xs
			q-btn(
				unelevated
				color="primary"
				label="Сохранить"
				size="sm"
				type="submit"
				:disable="!changed || !canSave"
			)
			q-btn(
				outline
				color="primary"
				label="Отмена"
				size="sm"
				:disable="!changed"
				@click="emit('cancel')"
			)
	q-expansion-item(
		:label="`Используется в правилах: ${ruleCount}`"
		header-class="bg-blue-grey-1"
	)
		q-list(v-if="usages.length")
			q-item(
				v-for="usage in usages"
				:key="usage.ruleId + usage.variantId"
				clickable
				@click="emit('openRule', usage.ruleId, usage.variantId)"
			)
				q-item-section
					q-item-label {{ usage.ruleName }}
					q-item-label(caption) Вариант {{ usage.variantNumber }}
		.q-pa-md.text-grey-7(v-else) Нумератор пока не используется в сохранённых правилах.
	.q-my-md.text-grey-7(v-if="ruleCount")
		| Изменения применятся ко всем использующим его правилам.
	.numerator-editor__properties.q-mt-lg
		q-input(
			v-model="numerator.name"
			outlined
			dense
			autofocus
			label="Имя нумератора"
			:rules="[value => !!value?.trim() || 'Введите имя нумератора']"
		)
		.text-subtitle2 Границы номеров
		.row.q-col-gutter-md
			.col-12.col-sm-6
				q-input(
					v-model.number="numerator.lowerBound"
					type="number"
					step="1"
					outlined
					dense
					label="От"
				)
			.col-12.col-sm-6
				q-input(
					v-model.number="numerator.upperBound"
					type="number"
					step="1"
					outlined
					dense
					label="До"
				)
		.text-negative(v-if="boundsError") {{ boundsError }}
</template>

<style scoped lang="scss">
.numerator-editor__properties {
	display: grid;
	gap: 1rem;
	max-width: 600px;
}
</style>
