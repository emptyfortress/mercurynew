import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'store',
  state: () => ({
    mini: false,
    currentNode: null as Stat | null,
    del: false,
    dub: false,
    dialog: false,
  }),
  actions: {
  toggleMini() {
    this.mini = !this.mini
  },
  setCurrentNode(e: Stat | null) {
    this.currentNode = e
  },
  toggleDel() {
    this.del = !this.del
  },
  toggleDub() {
    this.dub = !this.dub
  },
  savePoisk(e: string, c: string) {
    this.currentNode!.data.text = e
    this.currentNode!.data.text1 = c
  }
}
})