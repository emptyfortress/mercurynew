import { defineStore } from 'pinia'

export const useDrag = defineStore({
	id: 'drag',
	state: () => ({
		currentDrag: null as null | NodeData,
		dragNode: null as null | NodeData,
		treeKey: '',
		focus: false,
		kind: 0,
	}),
	actions: {
		setCurrentDrag(node: NodeData | null) {
			this.currentDrag = node
		},
		setTreeKey(key: string) {
			this.treeKey = key
		},
		setDragNode(node: NodeData) {
			this.dragNode = node
		},
		setFocus(focus: boolean) {
			this.focus = focus
		},
		setKind(kind: number) {
			this.kind = kind
		},
	},
})

