import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useList = defineStore('list', () => {
	const lists = ref([
		{
			id: 1,
			label: 'Все карточки',
			descr: 'Все карточки доступные пользователю ролевой модели',
			expand: false,
		},
		{
			id: 2,
			label: 'На ознакомление',
			descr: 'Задания на ознакомление',
			expand: false,
		},
		{
			id: 3,
			label: 'Договоры',
			descr: 'Договоры с контрагентами за текущий год',
			expand: false,
		},
	])

	const reset = (() => {
		lists.value.map((el) => el.expand = false)
	})


	return {
		lists,
		reset,
	}
})
