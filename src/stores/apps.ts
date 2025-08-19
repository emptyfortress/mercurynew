import { defineStore } from 'pinia'
import { ref, computed, markRaw } from 'vue'
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
			published: 0,
			publishDate: 0,
			author: 'Орлов П.С.',
			created: 1755513353568,
			group: 1,
			list: [],
			multiuser: true,
			pic: IconTravel1,
			master: true,
			versions: [
				{
					id: 0,
					label: 'Базовая версия',
					value: 'Базовая версия',
					descr: 'Стартовая версия приложения',
					author: 'Орлов П.С.',
					created: 1755513353568,
					modified: null,
					published: 0,
					current: true,
				},
			],
		},
		{
			id: '2',
			label: 'Заявки на отпуск',
			descr: 'Согласование и оформление отпусков сотрудников',
			expand: false,
			version: '3',
			published: 0,
			publishDate: 0,
			author: 'Орлов П.С.',
			created: 1755513353568,
			group: 1,
			list: [],
			multiuser: true,
			pic: IconBeach1,
			master: true,
			versions: [
				{
					id: 0,
					label: 'Базовая версия',
					value: 'Базовая версия',
					descr: 'Стартовая версия приложения',
					author: 'Орлов П.С.',
					created: 1755513353568,
					modified: null,
					published: 0,
					current: true,
				},
			],
		},
		{
			id: '3',
			label: 'Группа Маркетинг',
			descr: 'Это описание',
			expand: false,
			version: '0.0.0',
			published: 0,
			publishDate: 0,
			author: 'Орлов П.С.',
			created: 1755513353568,
			group: 2,
			master: true,
			versions: [],
			list: [
				{
					id: '6',
					label: 'Подготовка публикации',
					descr: 'Процесс подготовки и согласования публикации новостей на сайте',
					expand: false,
					version: '1',
					published: 0,
					author: 'Орлов П.С.',
					created: 1755513353568,
					group: 1,
					list: [],
					multiuser: true,
					pic: IconPrinter1,
					master: true,
					versions: [
						{
							id: 0,
							label: 'Базовая версия',
							value: 'Базовая версия',
							descr: 'Стартовая версия приложения',
							created: 1755513353568,
							author: 'Орлов П.С.',
							modified: null,
							published: 0,
							current: true,
						},
					],
				},
				{
					id: '7',
					label: 'Партнерский форум',
					descr: 'Приложение для подготовки ежегодного партнерского форума',
					expand: false,
					version: '1',
					published: 0,
					publishDate: 0,
					author: 'Орлов П.С.',
					created: 1755513353568,
					group: 1,
					list: [],
					multiuser: false,
					pic: IconMicrophone1,
					master: true,
					versions: [
						{
							id: 0,
							label: 'Базовая версия',
							value: 'Базовая версия',
							descr: 'Стартовая версия приложения',
							author: 'Орлов П.С.',
							created: 1755513353568,
							modified: null,
							published: 0,
							current: true,
						},
					],
				},
				{
					id: '8',
					label: 'Квартальный отчет',
					descr: 'Процесс подготовки и согласования отчета',
					expand: false,
					version: '2',
					published: 0,
					publishDate: 0,
					author: 'Орлов П.С.',
					created: 1755513353568,
					group: 1,
					list: [],
					multiuser: false,
					pic: IconPresentation1,
					master: true,
					versions: [
						{
							id: 0,
							label: 'Базовая версия',
							value: 'Базовая версия',
							descr: 'Стартовая версия приложения',
							created: 1755513353568,
							author: 'Орлов П.С.',
							modified: null,
							published: 0,
							current: true,
						},
					],
				},
			],
		},
		{
			id: '4',
			label: 'Служебные записки',
			descr: 'Оформление и обработка служебных записок',
			expand: false,
			version: '4',
			published: 0,
			publishDate: 0,
			author: 'Орлов П.С.',
			created: 1755513353568,
			group: 1,
			list: [],
			multiuser: false,
			pic: IconLetter1,
			master: true,
			versions: [
				{
					id: 0,
					label: 'Базовая версия',
					value: 'Базовая версия',
					descr: 'Стартовая версия приложения',
					author: 'Орлов П.С.',
					created: 1755513353568,
					modified: null,
					published: 0,
					current: true,
				},
			],
		},
		{
			id: '5',
			label: 'Служебные записки 1',
			descr: 'Оформление и обработка служебных записок',
			expand: false,
			version: '0',
			published: 0,
			publishDate: 0,
			author: 'Орлов П.С.',
			created: 1755513353568,
			group: 1,
			list: [],
			multiuser: true,
			pic: IconLetter1,
			master: true,
			versions: [
				{
					id: 0,
					label: 'Базовая версия',
					value: 'Базовая версия',
					descr: 'Стартовая версия приложения',
					author: 'Орлов П.С.',
					created: 1755513353568,
					modified: null,
					published: 0,
					current: true,
				},
			],
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

	const curVersion = (app: App) => {
		let tmp = app.versions.find((el) => el.current)
		return tmp ? tmp : app.versions[0]
	}

	const setCurrentVersion = (versions: Ver[], id: number) => {
		versions.forEach((v) => {
			v.current = v.id === id
		})
	}

	const removeVersion = (list: Ver[], id: number) => {
		let tmp = list.findIndex((el) => el.id == id)
		if (tmp > -1) {
			list.splice(tmp, 1)
		}
	}

	const addVersion = (list: Ver[], e: any) => {
		list.unshift(e)
	}

	return {
		apps,
		createApp,

		currentApp,
		setCurrentApp,

		curVersion,
		setCurrentVersion,
		removeVersion,
		addVersion,

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
