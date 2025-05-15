import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStagePlay } from 'vue-stage-play'

export const useScene = defineStore('scene', () => {
	const currentScenario = ref<Scenario | null>(null)
	const stage = useStagePlay()

	const setScene = (str: Scenario) => {
		currentScenario.value = str
	}

	return {
		// copy,
		// group,
		// group0,
		// add,
		// remove,
	}
})
