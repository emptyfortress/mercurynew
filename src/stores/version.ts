import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { date } from 'quasar'

const timeStamp = Date.now()

const formattedString = computed(() => {
	return date.formatDate(timeStamp, 'DD.MM.YY HH:mm')
	// return date.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
})

export const useVersion = defineStore('version', () => {
	const versions = ref([
		{
			id: 3,
			ver: 'Версия 3',
			author: 'Орлов П.С.',
			created: '23.07.25 17:08',
			modified: '23.07.25 18:05',
			descr: 'Настройка поисковых запросов',
			published: 0,
			current: true,
		},
		{
			id: 2,
			ver: 'Роза 1',
			author: 'Роза Львовна',
			created: '21.07.25 12:53',
			modified: '22.07.25 18:05',
			descr: 'Добавлены роли и папки',
			published: 1,
			current: false,
		},
		{
			id: 1,
			ver: 'Базовая',
			author: 'Орлов П.С.',
			created: '11.06.25 14:25',
			modified: '12.06.25 18:02',
			descr: 'Стартовая версия приложения',
			published: 2,
			current: false,
		},
	])

	const add = (e: string, d: string) => {
		versions.value.unshift({
			id: Date.now(), // Лучше Date.now() вместо index
			ver: e,
			descr: d,
			author: 'Орлов П.С.',
			created: formattedString.value,
			modified: '',
			published: 0,
			current: false,
		})
	}

	const remove = (id: number) => {
		let index = versions.value.findIndex((el) => el.id == id)
		if (index !== undefined) {
			versions.value.splice(index, 1)
		}
	}

	const setCurrent = (id: number) => {
		versions.value.forEach((v) => {
			v.current = v.id === id
		})
	}

	const curVersion = computed(() => {
		let tmp = versions.value.find((el) => el.current)
		return tmp ? tmp : versions.value[0]
	})

	return {
		versions,
		curVersion,
		setCurrent,
		add,
		remove,
	}
})
