import { defineStore } from 'pinia'
import { uid } from 'quasar'

export const useLayoutStore = defineStore('layout', () => {
	const layoutData = ref([
		{
			uid: uid(),
			name: 'Меню по умолчанию',
			author: 'admin',
			date: '2024-01-15',
			app: 'По умолчанию',
		},
		{ uid: uid(), name: 'КЭДО меню', author: 'admin', date: '2024-01-20', app: 'кэдо' },
		{ uid: uid(), name: 'Меню админа', author: 'admin', date: '2024-01-20', app: '' },
	])

	const duplicateTableItem = (row: {
		uid: string
		name: string
		author: string
		date: string
		comment: string
	}) => {
		const newItem = {
			uid: uid(),
			name: `${row.name} (копия)`,
			author: row.author,
			date: new Date().toISOString().split('T')[0],
			app: '',
		}
		layoutData.value.push(newItem)
	}

	const deleteTableItem = (uid: string) => {
		layoutData.value = layoutData.value.filter((item) => item.uid !== uid)
	}

	const createTableItem = (name: string) => {
		const newItem = {
			uid: uid(),
			name: name.trim(),
			author: 'admin',
			date: new Date().toISOString().split('T')[0],
			app: '',
		}
		layoutData.value.push(newItem)
		return newItem
	}

	return {
		layoutData,
		duplicateTableItem,
		deleteTableItem,
		createTableItem,
	}
})
