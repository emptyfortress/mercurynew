import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useList = defineStore('list', () => {
	const lists = ref([
		{
			id: 1,
			label: 'Все заявки',
			descr: 'Все заявки доступные пользователю ролевой модели',
			expand: false,
		},
		{
			id: 2,
			label: 'Мои заявки',
			descr: 'Заявки, созданные мной',
			expand: false,
		},
		{
			id: 3,
			label: 'Просроченные',
			descr: 'Просроченные заявки',
			expand: false,
		},
		{
			id: 4,
			label: 'Просроченные',
			descr: 'Просроченные заявки',
			expand: false,
		},
		{
			id: 5,
			label: 'Просроченные',
			descr: 'Просроченные заявки',
			expand: false,
		},
	])

	const reset = () => {
		lists.value.map((el) => (el.expand = false))
	}

	return {
		lists,
		reset,
	}
})
