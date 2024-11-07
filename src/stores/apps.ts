import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApps = defineStore('apps', () => {

	const apps = ref<App[]>([])

	const loadApp = ((e: App[]) => {
		apps.value = [...e]
	})

	const createApp = ((e: App) => {
		apps.value.push(e)
	})


	return {
		apps,
		loadApp,
		createApp,
	}
})
