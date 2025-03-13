import { defineStore } from 'pinia'
import { ref, computed, } from 'vue'

export const useTree = defineStore('tree', () => {

	const treeData = ref([
		{
			type: 10,
			text: "И",
			and: true,
			root: true,
			children: [
				[
					{
						id: "6c028f26-a3aa-417f-8b47-d235b08ce134",
						text: "Автор",
						kind: 5,
						type: 1,
						level: 0,
						selected: false,
					},
					{
						kind: 17,
						label: "равно",
						value: "равно",
						text: "равно",
						selected: true
					},
					{
						id: "d76ba093-1a96-4f44-bdfc-6bb6ce0fb13c",
						man: true,
						text: "Я",
						kind: 11,
						selected: false
					}
				],
				[
					{
						id: "5422cf4c-e098-4d67-90ce-9011f767320f",
						text: "Название",
						kind: 0,
						type: 1,
						level: 0,
						selected: false,
					},
					{
						kind: 15,
						word: true,
						text: "содержит",
						value: "содержит",
						label: "содержит",
						selected: false
					},
					{
						text: "",
						kind: 100,
						selected: false
					}
				]
			]
		}

	])

	const len = computed(() => {
		return treeData.value[0].children.length
	})

	const addFirstNode = ((e: any) => {
		treeData.value[0].children.push(e)
	})

	const isDragWindow = ref(false)
	const toggleDragWindow = (() => {
		isDragWindow.value = !isDragWindow.value
	})

	const addFlag = ref(false)
	const node = ref<any>()

	return {
		treeData,
		isDragWindow,
		addFlag,
		node,
		len,
		toggleDragWindow,
		addFirstNode,
	}
})
