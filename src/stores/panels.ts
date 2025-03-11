import { defineStore } from 'pinia'
// import { ref, nextTick } from 'vue'
import { useStorage } from '@vueuse/core'

export const usePanels = defineStore('panels', () => {
	const left = useStorage('left', true)
	const right = useStorage('right', true)
	const right0 = useStorage('right0', true)
	const preview = useStorage('preview', false)

	const setLeft = (state: boolean) => {
		left.value = state
	}
	const setRight = (state: boolean) => {
		right.value = state
	}

	const setRight0 = (state: boolean) => {
		right0.value = state
	}

	const setPreview = (state: boolean) => {
		preview.value = state
	}

	return {
		right0,
		left,
		right,
		preview,
		setLeft,
		setRight,
		setRight0,
		setPreview,
	}
})
