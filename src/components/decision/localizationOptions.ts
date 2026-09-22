export type Language = {
	code: string
	label: string
}

export type QueryLocalization = {
	languages: Language[]
	values: Record<string, Record<string, string>>
	languageOrder: string[]
}

export const languageOptions: Language[] = [
	{ code: 'en', label: 'English' },
	{ code: 'de', label: 'Deutsch' },
	{ code: 'fr', label: 'Français' },
	{ code: 'es', label: 'Español' },
	{ code: 'it', label: 'Italiano' },
	{ code: 'pt', label: 'Português' },
	{ code: 'zh', label: '中文（简体）' },
	{ code: 'ja', label: '日本語' },
	{ code: 'ar', label: 'العربية' },
	{ code: 'hi', label: 'हिन्दी' },
]

export const normalizeLanguageOrder = (order: string[] = []) => {
	const supportedCodes = languageOptions.map((language) => language.code)
	const savedCodes = order.filter(
		(code, index) => supportedCodes.includes(code) && order.indexOf(code) === index,
	)
	return [...savedCodes, ...supportedCodes.filter((code) => !savedCodes.includes(code))]
}
