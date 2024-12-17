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
	])

	const createApp = (e: App) => {
		apps.value.push(e)
	}

	const currentApp = ref<App | null>(null)
	const setCurrentApp = (e: App) => {
		currentApp.value = e
	}

	return {
		apps,
		createApp,

		currentApp,
		setCurrentApp,
	}
})
