<script setup lang="ts">
import { ref, watch } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import {
	languageOptions,
	normalizeLanguageOrder,
	type Language,
	type QueryLocalization,
} from '@/components/decision/localizationOptions'

const props = defineProps<{
	localization: QueryLocalization
}>()

const filter = ref('')
const dragConfig = {
	plugins: [animations()],
	dragHandle: '.language-drag-handle',
	dragPlaceholderClass: 'ghost',
	draggable: () => filter.value.trim() === '',
}
const getOrderedLanguages = (codes: string[]) => {
	const languagesByCode = new Map(languageOptions.map((language) => [language.code, language]))
	return normalizeLanguageOrder(codes).map((code) => languagesByCode.get(code)!)
}
const hasSameOrder = (first: string[], second: string[]) =>
	first.length === second.length && first.every((code, index) => code === second[index])

const [languageList, sortableLanguages] = useDragAndDrop(
	getOrderedLanguages(props.localization.languageOrder),
	dragConfig
)

const matchesFilter = (language: Language) => {
	const query = filter.value.trim().toLocaleLowerCase()
	return (
		!query || language.label.toLocaleLowerCase().includes(query) || language.code.includes(query)
	)
}

watch(
	() => props.localization.languageOrder,
	(codes) => {
		const normalizedCodes = normalizeLanguageOrder(codes)
		if (
			!hasSameOrder(
				sortableLanguages.value.map((language) => language.code),
				normalizedCodes
			)
		) {
			sortableLanguages.value = getOrderedLanguages(normalizedCodes)
		}
	},
	{ deep: true, immediate: true }
)

watch(sortableLanguages, (languages) => {
	const codes = languages.map((language) => language.code)
	if (!hasSameOrder(props.localization.languageOrder, codes)) {
		props.localization.languageOrder = codes
	}
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

.q-list(ref="languageList")
	q-item(v-for="language in sortableLanguages" v-show="matchesFilter(language)" :key="language.code" tag="label" dense)
		// q-item-section(side)
		// 	q-icon.language-drag-handle(name="mdi-drag-vertical" color="grey-6")
		q-item-section(side)
			.row.items-center
				q-icon.language-drag-handle(name="mdi-drag-vertical" color="grey-6" size='20px')
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

.language-drag-handle {
	cursor: grab;
	margin-right: 0.25rem;
}
.q-item {
	background: var(--bg-panel);
	padding-left: 0.25rem;
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
	}
}
</style>
