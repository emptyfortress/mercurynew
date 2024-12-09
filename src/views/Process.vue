<script setup lang="ts">
import { computed, ref } from 'vue'
import PlusButton from '@/components/PlusButton.vue'
import { useMotion } from '@vueuse/motion'
import { usePanels } from '@/stores/panels'
import Diagram from '@/components/Diagram.vue'
import Look from '@/components/Look.vue'

const editor1 = ref<HTMLElement>()

const panels = usePanels()

const full = { width: 1500, x: 0 }
const rightStart = { width: 1150, x: -175 }

const calcStart = computed(() => {
	if (!panels.right0) return full
	if (panels.right0) return rightStart
})

const { apply: editorAnim, stop } = useMotion(editor1, {
	initial: calcStart.value,
	enter: calcStart.value,
	start: { width: 1500, x: 0, transition: { stiffness: 200, damping: 20 } },
	shrinkRight: { width: 1150, x: -175, transition: { stiffness: 200, damping: 20 } },
})

const startRight0 = async () => {
	panels.setRight0(true)
	await editorAnim('shrinkRight')
	stop()
}

const stopRight0 = async () => {
	setTimeout(() => {
		editorAnim('start')
	}, 400)
	stop()
}
</script>

<template lang="pug">
q-page(padding)

	.editor(ref='editor1')
		.center
			Diagram
			Look


		PlusButton(@activate='startRight0' @stop='stopRight0')

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
	position: relative;
}

.text {
	font-size: 1.2rem;
}

.editor {
	padding-top: 4rem;
	display: flex;
	justify-content: center;
	// flex-direction: column;
	align-items: start;
	position: relative;
}
</style>
