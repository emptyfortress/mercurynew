<script setup lang="ts">
import { ref, watch } from 'vue'
import { translationLocales, type NameTranslations } from '@/constants/locales'

const translations = defineModel<NameTranslations>({ default: () => ({}) })
const props = withDefaults(
	defineProps<{
		label?: string
		iconOnly?: boolean
	}>(),
	{ label: 'Переводы названия', iconOnly: false }
)

const open = ref(false)
const draft = ref<NameTranslations>({})

watch(open, (isOpen) => {
	if (isOpen) draft.value = { ...translations.value }
})

const save = () => {
	const normalized = Object.fromEntries(
		translationLocales
			.map(({ code }) => [code, draft.value[code]?.trim() ?? ''] as const)
			.filter(([, value]) => value.length > 0)
	) as NameTranslations
	translations.value = normalized
	open.value = false
}
</script>

<template lang="pug">
q-btn(
	flat
	dense
	color="secondary"
	:icon="props.iconOnly ? 'mdi-translate' : undefined"
	:label="props.iconOnly ? undefined : props.label"
	:aria-label="props.label"
	@click="open = true"
)
	q-tooltip {{ props.label }}

q-dialog(v-model="open")
	q-card.name-translations-card
		q-card-section
			.text-h6 Переводы названия
			.text-caption.text-grey-7 Русское название задаётся в основном поле.
		q-card-section.q-pt-none
			.text-caption.q-mb-xs Локализации
			q-input(
				v-for="locale in translationLocales"
				:key="locale.code"
				v-model="draft[locale.code]"
				:label="locale.label"
				outlined
				dense
				class="q-mb-sm"
			)
		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(unelevated color="primary" label="Сохранить" @click="save")
</template>

<style scoped lang="scss">
.name-translations-card {
	width: 420px;
	max-width: calc(100vw - 2rem);
}
</style>
