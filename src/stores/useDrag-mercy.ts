import { defineStore } from 'pinia'

export const useDrag = defineStore({
  id: 'drag',
  state: () => ({
    dragNode: null as any | null,
    treeKey: null as string | null,
    flag: false,
    focus: false,
    kind: 0,
  }),
  getters: {},
  actions: {
    setCurrentDrag(e: any | null) {
      this.dragNode = e
    },
    setTreeKey(e: string | null) {
      this.treeKey = e
    },
    toggleFlag() {
      this.flag = !this.flag
    },
    toggleFocus() {
      this.focus = !this.focus
    },
    setKind(e: number) {
      this.kind = e
    },
  },
})