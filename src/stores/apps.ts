import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApps = defineStore('apps', () => {
	const apps = ref<App[]>([
		{
			id: '0',
			label: 'Приложение 0',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			type: 0,
			group: false,
		},
		{
			id: '1',
			label: 'Приложение 1',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			type: 0,
			group: false,
		},
		{
			id: '2',
			label: 'Приложение 2',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			type: 0,
			group: false,
		},
		{
			id: '3',
			label: 'Приложение 3',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			type: 0,
			group: false,
		},
		{
			id: '4',
			label: 'Приложение 4',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			type: 0,
			group: false,
		},
	])

	const newItem = ref(true)
	const toggleNew = () => {
		newItem.value = !newItem.value
	}

	const loadApp = (e: App[]) => {
		apps.value = [...e]
	}

	const createApp = (e: App) => {
		apps.value.push(e)
	}

	return {
		apps,
		loadApp,
		createApp,
		newItem,
		toggleNew,
	}
})
