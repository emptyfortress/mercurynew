<script setup lang="ts">
import { computed, ref } from 'vue'
import { languageOptions, type Language } from '@/components/decision/localizationOptions'

const props = defineProps<{
	localization: { languages: Language[]; values: Record<string, Record<string, string>> }
}>()

const filter = ref('')
const filteredLanguageOptions = computed(() => {
	const query = filter.value.trim().toLocaleLowerCase()
	if (!query) return languageOptions
	return languageOptions.filter(
		(language) =>
			language.label.toLocaleLowerCase().includes(query) || language.code.includes(query)
	)
})

const isEnabled = (languageCode: string) =>
	props.localization.languages.some((language) => language.code === languageCode)

const toggleLanguage = (language: Language, enabled: boolean) => {
	if (enabled) {
		props.localization.languages.push(language)
		return
	}

	props.localization.languages = props.localization.languages.filter(
		(item) => item.code !== language.code
	)
	Object.values(props.localization.values).forEach((translations) => {
		delete translations[language.code]
	})
}
</script>

<template lang="pug">
.text-bold.text-center
		q-icon(name="mdi-translate" size="20px")
		span.q-ml-sm Локализации
q-input.q-mt-md(v-model="filter" dense outlined clearable placeholder="Фильтр")
	template(v-slot:prepend)
		q-icon(name="mdi-magnify" color="primary")
q-list.q-mt-md(separator)
	q-item(disable dense)
		q-item-section(side)
			q-checkbox(:model-value="true" disable dense)
		q-item-section
			q-item-label Русский
		q-item-section(side)
			q-item-label(caption).text-primary ru
	q-item(v-for="language in filteredLanguageOptions" :key="language.code" tag="label" dense)
		q-item-section(side)
			q-checkbox(
				:model-value="isEnabled(language.code)"
				@update:model-value="toggleLanguage(language, $event === true)"
				dense
			)
		q-item-section
			q-item-label {{ language.label }}
		q-item-section(side)
			q-item-label(caption) {{ language.code }}
</template>

<style lang="scss" scoped>
.q-item__label--caption {
	color: $primary;
	font-weight: 600;
}
</style>
