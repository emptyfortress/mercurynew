import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { uid } from 'quasar'

export interface IFolderType {
	id: string
	text: string
	children: IFolderType[]
	icon: string
	view: string | null
	template: string | null
	card: string | null
	location: string | null
	createCard: boolean
	url: string
	display: string
	digest: boolean
	refresh: string
	period: number
	limited: boolean
	limit: number
	unread: boolean
	locked: boolean
	unsorted: boolean
	folders: string[]
	cards: string[]
	views: string[]
	templates: string[]
	foldersOnly: boolean
	cardsOnly: boolean
	viewsOnly: boolean
	templatesOnly: boolean
	foldersForbidden: boolean
	cardsForbidden: boolean
}
export const createFolderType = (text: string, id = uid()): IFolderType => ({
	id, text, children: [], icon: 'mdi-folder-outline', view: null, template: null,
	card: null, location: null, createCard: false, url: '', display: 'folder',
	digest: true, refresh: 'standard', period: 300, limited: true, limit: 40,
	unread: true, locked: false, unsorted: false, folders: [], cards: [], views: [],
	templates: [], foldersOnly: false, cardsOnly: false, viewsOnly: false,
	templatesOnly: false, foldersForbidden: false, cardsForbidden: false,
})
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))
export const useFolderTypesStore = defineStore('folderTypes', () => {
	const parent = createFolderType('Тип 1', 'type1')
	parent.children = [createFolderType('Тип 1.1', 'type11'), createFolderType('Тип 1.2', 'type12')]
	const root = createFolderType('Типы папок', 'folder-types-root')
	root.children = [createFolderType('Стандартная', 'standard'), parent]
	const tree = ref([root])
	const saved = ref(clone(tree.value))
	const selectedId = ref<string | null>(null)
	const flatten = (nodes: IFolderType[]): IFolderType[] => nodes.flatMap(node => [node, ...flatten(node.children)])
	const nodes = computed(() => flatten(tree.value).filter(node => node.id !== 'folder-types-root'))
	const selected = computed(() => nodes.value.find(node => node.id === selectedId.value))
	const dirty = computed(() => JSON.stringify(tree.value) !== JSON.stringify(saved.value))
	const invalid = computed(() => nodes.value.find(node => !node.text.trim() ||
		(node.refresh === 'special' && (!Number.isInteger(Number(node.period)) || Number(node.period) <= 0)) ||
		(node.limited && (!Number.isInteger(Number(node.limit)) || Number(node.limit) <= 0))))
	function save() {
		if (invalid.value) { selectedId.value = invalid.value.id; return false }
		nodes.value.forEach(node => { node.text = node.text.trim() })
		saved.value = clone(tree.value)
		return true
	}
	function cancel() { tree.value = clone(saved.value); if (!selected.value) selectedId.value = null }
	function add(parent?: IFolderType) {
		const node = createFolderType('Новый тип')
		;(parent ? parent.children : tree.value[0].children).push(node)
		selectedId.value = node.id
	}
	function remove(node: IFolderType) {
		if (node.id === 'standard' || node.id === 'folder-types-root') return
		const removed = new Set(flatten([node]).map(item => item.id))
		const prune = (items: IFolderType[]): IFolderType[] => items.filter(item => !removed.has(item.id)).map(item => {
			item.children = prune(item.children)
			item.folders = item.folders.filter(id => !removed.has(id))
			return item
		})
		tree.value = prune(tree.value)
		if (selectedId.value && removed.has(selectedId.value)) selectedId.value = null
	}
	return { tree, nodes, selectedId, selected, dirty, invalid, save, cancel, add, remove }
})
