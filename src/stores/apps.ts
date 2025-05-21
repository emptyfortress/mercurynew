import { defineStore } from 'pinia'
import { ref, markRaw } from 'vue'
import IconTravel from '@/components/icons/list/IconTravel.vue'
import IconBeach from '@/components/icons/list/IconBeach.vue'
import IconLetter from '@/components/icons/list/IconLetter.vue'
import IconPresentation from '@/components/icons/list/IconPresentation.vue'
import IconMicrophone from '@/components/icons/list/IconMicrophone.vue'
import IconPrinter from '@/components/icons/list/IconPrinter.vue'
import { useStorage } from '@vueuse/core'

const IconTravel1 = markRaw(IconTravel)
const IconBeach1 = markRaw(IconBeach)
const IconLetter1 = markRaw(IconLetter)
const IconPresentation1 = markRaw(IconPresentation)
const IconMicrophone1 = markRaw(IconMicrophone)
const IconPrinter1 = markRaw(IconPrinter)

const app = useStorage('app', localStorage)

export const useApps = defineStore('apps', () => {
	const apps = ref<App[]>([
		{
			id: '1',
			label: 'Управление командировками',
			descr: 'Приложение для оформления командировок и отчетов сотрудников',
			expand: false,
			version: '2',
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
			version: '3',
			author: 'Орлов П.С.',
			created: '22.10.24 14:00',
			group: 1,
			list: [],
			pic: IconBeach1,
		},
		{
			id: '3',
			label: 'Маркетинг',
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
					version: '1',
					author: 'Орлов П.С.',
					created: '22.10.24 14:00',
					group: 1,
					list: [],
					pic: IconPrinter1,
				},
				{
					id: '7',
					label: 'Партнерский форум',
					descr: 'Приложение для подготовки ежегодного партнерского форума',
					expand: false,
					version: '1',
					author: 'Орлов П.С.',
					created: '22.10.24 14:00',
					group: 1,
					list: [],
					pic: IconMicrophone1,
				},
				{
					id: '8',
					label: 'Квартальный отчет',
					descr: 'Процесс подготовки и согласования отчета',
					expand: false,
					version: '2',
					author: 'Орлов П.С.',
					created: '22.09.24 05:34',
					group: 1,
					list: [],
					pic: IconPresentation1,
				},
			],
		},
		{
			id: '4',
			label: 'Служебные записки',
			descr: 'Оформление и обработка служебных записок',
			expand: false,
			version: '4',
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
			version: '0',
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

	const path = ref('/')
	const groupPath = ref('')
	const groupPathBig = ref('')
	const setPath = (e: string) => {
		path.value = e
	}
	const setGroupPath = (e: string) => {
		groupPath.value = e
	}
	const setGroupPathBig = (e: string) => {
		groupPathBig.value = e
	}

	const groupDrag = ref(false)
	const setGroupDrag = (e: boolean) => {
		groupDrag.value = e
	}

	return {
		apps,
		createApp,

		currentApp,
		setCurrentApp,

		grouping,
		setGrouping,

		path,
		groupPath,
		groupPathBig,
		setPath,
		setGroupPath,
		setGroupPathBig,

		groupDrag,
		setGroupDrag,
	}
})
