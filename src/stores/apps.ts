import { defineStore } from 'pinia'
import { ref, markRaw } from 'vue'
import IconTravel from '@/components/icons/IconTravel.vue'
import IconBeach from '@/components/icons/IconBeach.vue'
import IconLetter from '@/components/icons/IconLetter.vue'
import IconPresentation from '@/components/icons/IconPresentation.vue'
import IconMicrophone from '@/components/icons/IconMicrophone.vue'
import { useStorage } from '@vueuse/core'

const IconTravel1 = markRaw(IconTravel)
const IconBeach1 = markRaw(IconBeach)
const IconLetter1 = markRaw(IconLetter)
const IconPresentation1 = markRaw(IconPresentation)
const IconMicrophone1 = markRaw(IconMicrophone)

const app = useStorage('app', localStorage)

export const useApps = defineStore('apps', () => {
	const apps = ref<App[]>([
		{
			id: '1',
			label: 'Управление командировками',
			descr: 'Приложение для оформления командировок и отчетов сотрудников',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			group: 1,
			list: [],
			pic: IconTravel1,
		},
		{
			id: '2',
			label: 'Заявки на отпуск',
			descr: 'Согласование и оформление отпусков сотрудников',
			expand: false,
			version: '0.1.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			group: 1,
			list: [],
			pic: IconBeach1,
		},
		{
			id: '3',
			label: 'Приложения отдела маркетинга',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			group: 2,
			list: [
				{
					id: '6',
					label: 'Подготовка публикации',
					descr: 'Процесс подготовки и согласования публикации новостей на сайте',
					expand: false,
					version: '0.0.0',
					author: 'Орлов П.С.',
					created: '22.10.24 14:00',
					group: 1,
					list: [],
					pic: IconPresentation1,
				},
				{
					id: '7',
					label: 'Партнерский форум',
					descr: 'Приложение для подготовки ежегодного партнерского форума',
					expand: false,
					version: '0.0.0',
					author: 'Орлов П.С.',
					created: '22.10.24 14:00',
					group: 1,
					list: [],
					pic: IconMicrophone1,
				},
			],
		},
		{
			id: '4',
			label: 'Служебные записки',
			descr: 'Оформление и обработка служебных записок',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			group: 1,
			list: [],
			pic: IconLetter1,
		},
		{
			id: '5',
			label: 'Служебные записки 1',
			descr: 'Оформление и обработка служебных записок',
			expand: false,
			version: '0.0.0',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			group: 1,
			list: [],
			pic: IconLetter1,
		},
	])

	const createApp = (e: App) => {
		apps.value.push(e)
	}

	const currentApp = ref<App | null>(null)

	const setCurrentApp = (e: any) => {
		currentApp.value = e
		app.value = e
	}

	const grouping = ref(false)
	const setGrouping = (e: boolean) => {
		grouping.value = e
	}

	return {
		apps,
		createApp,

		currentApp,
		setCurrentApp,

		grouping,
		setGrouping,
	}
})
