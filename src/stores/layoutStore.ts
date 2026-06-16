import { defineStore } from 'pinia'
import { uid } from 'quasar'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
	const currentProject = ref('По умолчанию')

	const layoutData = ref([
		{
			uid: uid(),
			name: 'Меню по умолчанию',
			author: 'admin',
			date: '2024-01-15',
			project: 'По умолчанию',
			use: true,
		},
		{
			uid: uid(),
			name: 'Меню КЭДО',
			author: 'admin',
			date: '2024-01-20',
			project: 'КЭДО',
			use: true,
		},
		{
			uid: uid(),
			name: 'Меню админа',
			author: 'admin',
			date: '2024-01-20',
			project: 'По умолчанию',
			use: true,
		},
		{
			uid: uid(),
			name: 'Меню мобильное',
			author: 'admin',
			date: '2024-01-20',
			project: 'По умолчанию',
			use: true,
		},
		{
			uid: uid(),
			name: 'Меню планшет',
			author: 'admin',
			date: '2024-01-20',
			project: 'По умолчанию',
			use: false,
		},
	])

	const duplicateLayout = (row: {
		uid: string
		name: string
		author: string
		date: string
		project: string
		use: boolean
	}) => {
		const newItem = {
			uid: uid(),
			name: `${row.name} (копия)`,
			author: row.author,
			date: new Date().toISOString().split('T')[0],
			project: currentProject.value,
			use: false,
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
			project: currentProject.value,
			use: false,
		}
		layoutData.value.push(newItem)
		return newItem
	}

	return {
		currentProject,
		layoutData,
		duplicateLayout,
		deleteTableItem,
		createTableItem,
	}
})
