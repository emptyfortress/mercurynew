<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { isValidNumerator } from './useNumerationState'
import type { INumeratorDraft } from './types'

const modelValue = defineModel<boolean>()
const emit = defineEmits<{
	create: [numerator: INumeratorDraft]
}>()
const draft = ref<INumeratorDraft>({ name: '', lowerBound: 1, upperBound: 1000 })
const canCreate = computed(() => isValidNumerator(draft.value))
const boundsError = computed(() => {
	const { lowerBound, upperBound } = draft.value
	if (!Number.isSafeInteger(lowerBound) || !Number.isSafeInteger(upperBound)) {
		return 'Укажите целые числа в обеих границах'
	}
	if (lowerBound !== null && upperBound !== null && lowerBound > upperBound) {
		return 'Начальная граница не должна превышать конечную'
	}
	return ''
})

watch(modelValue, (isOpen) => {
	if (isOpen) draft.value = { name: '', lowerBound: 1, upperBound: 1000 }
})

function createNumerator() {
	if (!canCreate.value) return
	emit('create', { ...draft.value, name: draft.value.name.trim() })
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(
	v-model="modelValue",
	backdrop-filter="blur(4px) saturate(150%)"
)
	q-card.create-numerator
		q-btn.close(round, color="negative", icon="mdi-close", v-close-popup)
		q-form(@submit.prevent="createNumerator")
			q-card-section
				.text-h6 Создать нумератор
			q-card-section.q-gutter-y-md
				q-input(
					v-model="draft.name",
					autofocus,
					outlined,
					dense,
					label="Имя нумератора",
					:rules="[value => !!value?.trim() || 'Введите имя нумератора']"
				)
				.text-subtitle2 Границы номеров
				.row.q-col-gutter-x-md
					.col-6
						q-input(
							v-model.number="draft.lowerBound",
							type="number",
							step="1",
							outlined,
							dense,
							label="От"
						)
					.col-6
						q-input(
							v-model.number="draft.upperBound",
							type="number",
							step="1",
							outlined,
							dense,
							label="До"
						)
				.text-negative(v-if="boundsError") {{ boundsError }}
			q-card-actions(align="right")
				q-btn(flat, color="primary", label="Отмена", v-close-popup)
				q-btn(
					unelevated,
					color="primary",
					label="Создать",
					type="submit",
					:disable="!canCreate"
				)
</template>

<style scoped lang="scss">
.create-numerator {
	width: 460px;
	max-width: calc(100vw - 48px);
}
</style>
