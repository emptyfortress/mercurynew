import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useDiagram = defineStore('diagram', () => {

	const selection = ref<string | null>(null)

	const select = ((e: string) => {
		selection.value = e
	})

	return {
		selection,
		select
	}
})
