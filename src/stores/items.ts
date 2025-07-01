import { defineStore } from 'pinia'

export const useItemStore = defineStore('items', {
	state: () => ({
		items: [
			{ id: 'a', label: '🖥 Сервер A' },
			{ id: 'b', label: '📡 Сервер B' },
			{ id: 'c', label: '💽 Сервер C' },
		],
	}),
	actions: {
		setItems(newItems: typeof this.items) {
			this.items = [...newItems]
		},
	},
})
