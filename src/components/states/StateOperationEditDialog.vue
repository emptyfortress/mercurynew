<script setup lang="ts">
import { ref, watch } from 'vue'
import { locales, type NameTranslations } from '@/constants/locales'
import type { OperationDefinition } from './types'

const isOpen = defineModel<boolean>({ default: false })
const props = defineProps<{ operation: OperationDefinition | null }>()
const emit = defineEmits<{
	(event: 'save', operationId: string, name: string, nameTranslations: NameTranslations): void
}>()

const name = ref('')
const nameTranslations = ref<NameTranslations>({})

watch([isOpen, () => props.operation], ([open, operation]) => {
	if (!open || !operation) return
	name.value = operation.name
	nameTranslations.value = { ...operation.nameTranslations }
})

const save = () => {
	const operation = props.operation
	const trimmedName = name.value.trim()
	if (!operation || !trimmedName) return
	const translations = Object.fromEntries(
		Object.entries(nameTranslations.value)
			.map(([code, value]) => [code, value?.trim() ?? ''])
			.filter(([, value]) => value.length > 0)
	) as NameTranslations
	emit('save', operation.id, trimmedName, translations)
	isOpen.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="isOpen" backdrop-filter="blur(4px) saturate(150%)")
	q-card.operation-edit-dialog(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Редактирование операции
			.caption {{ operation?.name }}
		q-card-section.q-pt-none
			q-input.q-mb-sm(v-model="name" label="Русский (ru)" outlined dense autofocus)
			q-input.q-mb-sm(v-for="locale in locales.slice(1)" :key="locale.code" v-model="nameTranslations[locale.code]" :label="locale.label" outlined dense)
		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(color="primary" unelevated label="Сохранить" :disable="!name.trim()" @click="save")
</template>

<style scoped lang="scss">
.operation-edit-dialog {
	width: 440px;
	max-width: calc(100vw - 2rem);
}
</style>
