import { defineStore } from 'pinia'
import { ref } from 'vue'
import IconTravel from '@/components/icons/IconTravel.vue'
import IconBeach from '@/components/icons/IconBeach.vue'
import IconLetter from '@/components/icons/IconLetter.vue'
// import briefcase from '@/assets/img/briefcase.png'
// import beach from '@/assets/img/beach.png'
// import letter from '@/assets/img/letter.png'
// import folders from '@/assets/img/folders.png'

export const useApps = defineStore('apps', () => {
	const apps = ref<App[]>([
		{
			id: '0',
			label: 'Управление командировками',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			group: 1,
			pic: IconTravel
		},
		{
			id: '1',
			label: 'Заявки на отпуск',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			group: 1,
			pic: IconBeach
		},
		{
			id: '2',
			label: 'Приложение 2',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			group: 2,
			pic: 'IconTravel'
		},
		{
			id: '3',
			label: 'Служебные записки',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			group: 1,
			pic: IconLetter
		},
	])

	const createApp = (e: App) => {
		apps.value.push(e)
	}

	const currentApp = ref<App | null>(null)
	const setCurrentApp = (e: App) => {
		currentApp.value = e
	}

	const grouping = ref(false)
	const setGrouping = ((e: boolean) => {
		grouping.value = e
	})

	return {
		apps,
		createApp,

		currentApp,
		setCurrentApp,

		grouping,
		setGrouping,
	}
})
