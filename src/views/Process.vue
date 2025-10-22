<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import PlusButton from '@/components/PlusButton.vue'
import { useMotion } from '@vueuse/motion'
import { usePanels } from '@/stores/panels'
import DiagramSvg from '@/components/DiagramSvg.vue'
import Look from '@/components/Look.vue'
import { useTitle } from '@vueuse/core'
import { useStorage } from '@vueuse/core'

const app = useStorage('app', localStorage)
const title = useTitle()
title.value = 'Процесс: ' + app.value.label

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
		.zg Процесс
		.bt
			q-btn(flat round dense icon="mdi-undo" color="primary") 
			q-btn(flat round dense icon="mdi-redo" color="primary") 
		.center
			DiagramSvg
			Look

		PlusButton(@activate='startRight0' @stop='stopRight0')
</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
	position: relative;
	// top: 0;
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
.zg {
	font-size: 1.3rem;
	font-weight: 500;
	position: absolute;
	top: 0.5rem;
}
.bt {
	position: absolute;
	top: 0.25rem;
	right: 0.5rem;
}
</style>
