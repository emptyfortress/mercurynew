import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePanels = defineStore('panels', () => {
	const left = useStorage('left', false)
	const right = useStorage('right', false)
	const right0 = useStorage('right0', true)
	const preview = useStorage('preview', false)
	const pred = useStorage('pred', false)

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

	const setPred = (state: boolean) => {
		pred.value = state
	}

	const condL = ref<Option[][]>([])

	const addToCondL = (e: any) => {
		condL.value.push(e)
	}

	const removeById = (id: string) => {
		condL.value = condL.value.filter((innerArray) => innerArray[0]?.id !== id)
	}

	return {
		right0,
		left,
		right,
		preview,
		pred,
		condL,
		setLeft,
		setRight,
		setRight0,
		setPreview,
		setPred,
		addToCondL,
		removeById,
		// removeFromCondL,
	}
})
