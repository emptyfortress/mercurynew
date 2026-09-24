export const locales = [
	{ code: 'ru', label: 'Русский (ru)' },
	{ code: 'en', label: 'English (en)' },
	{ code: 'fr', label: 'Français (fr)' },
	{ code: 'es', label: 'Español (es)' },
] as const

export type LocaleCode = (typeof locales)[number]['code']
export type NameTranslations = Partial<Record<Exclude<LocaleCode, 'ru'>, string>>

export const translationLocales = [locales[1], locales[2], locales[3]] as const
export const supportedLocaleCodes = new Set<string>(locales.map((locale) => locale.code))
