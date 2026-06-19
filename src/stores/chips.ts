import { defineStore } from 'pinia'

// Minimal type definitions for the chips store – sufficient for the current component usage
interface Chip {
	id: number
	label: string
	ticked: boolean
	children?: Chip[]
}

// Row options used in the preview dialog – we keep it generic as the UI only needs an array
type Option = any

export const useChips = defineStore({
	id: 'chips',
	state: () => ({
		chips: [
			{ id: 0, label: 'Все', ticked: true },
			{
				id: 1,
				label: 'Документ',
				ticked: false,
				children: [
					{ id: 2, label: 'Входящий', ticked: false },
					{ id: 3, label: 'Исходящий', ticked: false },
					{ id: 4, label: 'Договор', ticked: false },
				],
			},
			{
				id: 6,
				label: 'Задание',
				ticked: false,
				children: [
					{ id: 7, label: 'На исполнение', ticked: false },
					{ id: 8, label: 'На ознакомление', ticked: false },
					{ id: 9, label: 'На согласование', ticked: false },
				],
			},
			{ id: 10, label: 'ГЗ', ticked: false },
			{ id: 11, label: 'Квартальная цель', ticked: false },
			{ id: 12, label: 'Командировка', ticked: false },
		] as Chip[],
		rows: [] as Option[],
		updateTree: false,
		newSearchItem: '',
		count: 0,
		selectedRow: null as null | Option,
	}),
	getters: {},
	actions: {
		setSelectedRow(e: Option) {
			this.selectedRow = e
		},
		setChips(e: Chip[]) {
			this.chips = e
		},
		setRows(data: Option[]) {
			this.rows = data
		},
		toggleUpdateTree() {
			this.updateTree = !this.updateTree
		},
		setNewItem(e: string) {
			this.newSearchItem = e
		},
	},
})

export default useChips
