<script setup lang="ts">
import { ref, computed } from 'vue'
import PlusButton1 from '@/components/PlusButton1.vue'
import LibButton from '@/components/LibButton.vue'
import { usePanels } from '@/stores/panels'
import { useMotion } from '@vueuse/motion'
import form from '@/assets/img/form.png'

const panels = usePanels()
const editor = ref<HTMLElement>()

const full = { width: 1500, x: 0 }
const leftStart = { width: 1150, x: 175 }
const rightStart = { width: 1150, x: -175 }
const allStart = { width: 800, x: 0 }

const calcStart = computed(() => {
	if (panels.left && panels.right) return allStart
	if (!panels.left && !panels.right) return full
	if (panels.left) return leftStart
	if (panels.right) return rightStart
})

const { apply: editorAnim, stop } = useMotion(editor, {
	enter: calcStart.value,
	start: { width: 1500, x: 0, transition: { stiffness: 200, damping: 20 } },
	shrinkRight: { width: 1150, x: -175, transition: { stiffness: 200, damping: 20 } },
	shrinkLeft: { width: 1150, x: 175, transition: { stiffness: 200, damping: 20 } },
	shrinkAll: { width: 800, x: 0, transition: { stiffness: 200, damping: 20 } },
})

const startRight = async () => {
	panels.setRight(true)
	if (panels.left && panels.right) {
		await editorAnim('shrinkAll')
	} else await editorAnim('shrinkRight')
	stop()
}

const startLeft = async () => {
	panels.setLeft(true)
	if (panels.left && panels.right) {
		await editorAnim('shrinkAll')
	} else await editorAnim('shrinkLeft')
	stop()
}

const stopRight = async () => {
	setTimeout(() => {
		panels.left ? editorAnim('shrinkLeft') : editorAnim('start')
	}, 400)
	stop()
}

const stopLeft = async () => {
	setTimeout(() => {
		panels.right ? editorAnim('shrinkRight') : editorAnim('start')
	}, 400)
	stop()
}
</script>

<template lang="pug">
q-page(padding)
	.editor(ref='editor')
		.top
			h6 Форма "Создание"
			q-btn(flat round dense icon="mdi-close" color="primary" @click="") 
		q-img(:src="form")

		PlusButton1(@activate='startRight' @stop='stopRight')
		LibButton(@activate='startLeft' @stop='stopLeft')

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	flex-direction: column;
	// justify-content: center;
	align-items: center;
	position: relative;
}

.top {
	padding: 1rem;
	border-radius: .4rem .4rem 0 0;
	background: hsl(214 42% 94% / 1);
	box-shadow: inset 0 -2px 3px rgba($color: #000000, $alpha: 0.1);
	display: flex;
	justify-content: space-between;

	h6 {
		color: $primary;
	}
}

.editor {
	display: block;
	padding: 0;
	// background: transparent;
	// box-shadow: none;
	// padding: 0;
}

.editor1 {
	background: #fff;
}
</style>
