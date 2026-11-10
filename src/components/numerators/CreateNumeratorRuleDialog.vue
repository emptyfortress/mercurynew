<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import type { INumeratorRuleDraft } from './types'

const modelValue = defineModel<boolean>()
const emit = defineEmits<{
	create: [rule: INumeratorRuleDraft]
}>()
const simpleStore = useSimpleStore()
const cardTypes = computed(() =>
	simpleStore.treeData.map((card) => ({ label: card.text, value: card.id }))
)
const name = ref('')
const cardType = ref<string | null>(null)
const showLeadingZeros = ref(false)

watch(modelValue, (isOpen) => {
	if (!isOpen) return
	name.value = ''
	cardType.value = null
	showLeadingZeros.value = false
})

function createRule() {
	const trimmedName = name.value.trim()
	if (!trimmedName) return
	emit('create', {
		name: trimmedName,
		cardType: cardType.value,
		showLeadingZeros: showLeadingZeros.value,
	})
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(
	v-model="modelValue"
	backdrop-filter="blur(4px) saturate(150%)"
)
	q-card.create-numerator-rule
		q-btn.close(
			round
			color="negative"
			icon="mdi-close"
			v-close-popup
		)
		q-form(@submit.prevent="createRule")
			q-card-section
				.text-h6 Создать правило
			q-card-section.q-gutter-md
				q-input(
					v-model="name"
					autofocus
					outlined
					dense
					label="Имя правила"
					:rules="[value => !!value?.trim() || 'Введите имя правила']"
				)
				q-select(
					v-model="cardType"
					:options="cardTypes"
					emit-value
					map-options
					outlined
					dense
					clearable
					label="Тип карточки"
				)
				q-checkbox(
					v-model="showLeadingZeros"
					label="Показывать ведущие нули"
				)
			q-card-actions(align="right")
				q-btn(
					flat
					color="primary"
					label="Отмена"
					v-close-popup
				)
				q-btn(
					unelevated
					color="primary"
					label="Создать"
					type="submit"
					:disable="!name.trim()"
				)
</template>

<style scoped lang="scss">
.create-numerator-rule {
	width: 460px;
	max-width: calc(100vw - 48px);
}
</style>
