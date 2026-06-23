import { defineStore } from 'pinia'

export const useDrag = defineStore({
	id: 'drag',
	state: () => ({
		currentDrag: null as null | NodeData,
		dragNode: null as null | NodeData,
		treeKey: '' as string | null,
		focus: false,
		kind: 0,
		flag: false,
	}),
	actions: {
		setCurrentDrag(node: NodeData | null) {
			this.currentDrag = node
		},
		setTreeKey(key: string | null) {
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
