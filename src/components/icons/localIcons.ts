import { type Component } from 'vue'

const modules = import.meta.glob<Component>('./*.vue', { eager: true })

const COLLECTION_EXCEPTIONS = [
	'AntDesign',
	'MaterialSymbols',
	'MdiLight',
	'SimpleIcons',
	'EmojioneMonotone',
	'IconParkTwotone',
]

export function transformIconName(input: string): string {
	let name = input.trim().replace(/\.vue$/i, '')

	// Уже в формате prefix:icon
	if (name.includes(':')) return name.toLowerCase()

	// 1) Определяем сырой префикс (коллекцию)
	let prefixRaw: string | null = null
	for (const coll of COLLECTION_EXCEPTIONS) {
		if (name.startsWith(coll)) {
			prefixRaw = coll
			break
		}
	}
	if (!prefixRaw) {
		const m = name.match(/^[A-Z][a-z]*/)
		prefixRaw = m ? m[0] : name // фолбэк
	}

	// 2) Остаток берём СРЕЗОМ по длине префикса (так цифры не потеряются)
	const restName = name.slice(prefixRaw.length)

	// 3) Префикс → kebab-case
	const prefix = (prefixRaw.match(/[A-Z][a-z0-9]*/g) || [prefixRaw])
		.map((s) => s.toLowerCase())
		.join('-')

	// 4) Остаток → слова ИЛИ числа, потом kebab
	const rest = (restName.match(/[A-Z][a-z]*|\d+/g) || []).map((s) => s.toLowerCase()).join('-')

	return rest ? `${prefix}:${rest}` : prefix
}

export const localIcons = Object.entries(modules).map(([path, mod]) => {
	const parts = path.split('/')
	const tmp = parts[parts.length - 1].replace('.vue', '')
	const name = transformIconName(tmp)
	const collection = name.split(':')[0]
	return {
		collection,
		name,
		component: (mod as any).default,
	}
})
