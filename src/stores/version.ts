import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useVersion = defineStore('version', () => {
	const versions = ref([
		{
			id: 3,
			ver: 'Версия 3',
			author: 'Орлов П.С.',
			created: '23.07.25',
			descr: '',
			published: 0,
			current: true,
		},
		{
			id: 2,
			ver: 'Роза 1',
			author: 'Роза Львовна',
			created: '21.07.25',
			descr: '',
			published: 1,
			current: false,
		},
		{
			id: 1,
			ver: 'Базовая',
			author: 'Орлов П.С.',
			created: '11.06.25',
			descr: '',
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
			created: '23.07.25',
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
