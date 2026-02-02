import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TreeElement {
	id: number
	text: string
	name?: string
	descr?: string
	selected?: boolean
	hidden?: boolean
	type: number
	edit?: boolean
}

export const useSimpleStore = defineStore('simpleStore', () => {
	const treeData = ref([
		{
			id: 'doc',
			text: 'Документ',
			descr: '',
			hidden: false,
			selected: false,
			children: [
				{
					id: 'dogovor',
					text: 'Договор',
					hidden: false,
					selected: false,
				},
				{
					id: 'sluj',
					text: 'Служебная записка',
					hidden: false,
					selected: false,
					children: [],
				},
				{
					id: 'zaya',
					text: 'Заявка',
					hidden: false,
					selected: false,
					children: [],
				},
			],
		},
		{
			id: 'zadan',
			text: 'Задание',
			descr: '',
			hidden: false,
			selected: false,
			children: [
				{
					id: 'oznak',
					text: 'На ознакомление',
					hidden: false,
					selected: false,
				},
				{
					id: 'sogl',
					text: 'На согласование',
					hidden: false,
					selected: false,
					children: [],
				},
				{
					id: 'isp',
					text: 'На исполнение',
					hidden: false,
					selected: false,
					children: [],
				},
			],
		},
		{
			id: 'group',
			text: 'Группа заданий',
			descr: '',
			hidden: false,
			selected: false,
			children: [
				{
					id: 'group1',
					text: 'Не знаю что здесь',
					hidden: false,
					selected: false,
					children: [],
				},
			],
		},
	])

	const selectedType = ref<string | null>(null)

	const selectedElement = ref<TreeElement | null>(null)

	function setSelectedElement(element: TreeElement | null) {
		console.log(element)
		selectedElement.value = element
	}

	function clearSelectedElement() {
		selectedElement.value = null
	}

	const selectedBranch = computed(() => {
		if (!selectedType.value) return null
		return treeData.value.find(branch => branch.text === selectedType.value) || null
	})

	return {
		treeData,
		selectedType,
		selectedElement,
		setSelectedElement,
		clearSelectedElement,
		selectedBranch,
	}
})
