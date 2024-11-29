<script setup lang="ts">
import { ref } from 'vue'
import PlusButton1 from '@/components/PlusButton1.vue'
import LibButton from '@/components/LibButton.vue'
import { useMotion } from '@vueuse/motion'

const editor = ref<HTMLElement>()
const { apply: editorAnim, stop } = useMotion(editor, {
	enter: {
		opacity: 1,
		y: 0,
		x: '0%',
		marginLeft: 0,
		width: '90%',
		transition: {
			// onComplete: () => editorAnim('levitate'),
		},
	},
	start: { width: '90%', x: '0%', transition: { stiffness: 200, damping: 20 } },
	shrinkRight: { width: '75%', x: '-13%', transition: { stiffness: 200, damping: 20 } },
	shrinkLeft: { width: '75%', x: '12%', transition: { stiffness: 200, damping: 20 } },
	shrinkAll: { width: '55%', x: '0%', transition: { stiffness: 200, damping: 20 } },
	move: { x: -300, transition: { stiffness: 200, damping: 20 } },
})

const left = ref(false)
const right = ref(false)

const startRight = async () => {
	right.value = true
	if (left.value && right.value) {
		await editorAnim('shrinkAll')
	} else await editorAnim('shrinkRight')
	stop()
}

const startLeft = async () => {
	left.value = true
	if (left.value && right.value) {
		await editorAnim('shrinkAll')
	} else await editorAnim('shrinkLeft')
	stop()
}

const stopRight = async () => {
	right.value = false
	setTimeout(() => {
		left.value ? editorAnim('shrinkLeft') : editorAnim('start')
	}, 400)
	stop()
}

const stopLeft = async () => {
	left.value = false
	setTimeout(() => {
		right.value ? editorAnim('shrinkRight') : editorAnim('start')
	}, 400)
	stop()
}
</script>

<template lang="pug">
q-page(padding)
	.editor(ref='editor')
		.text Form

		PlusButton1(@activate='startRight' @stop='stopRight')
		LibButton(@activate='startLeft' @stop='stopLeft')

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
	position: relative;
}
.editor {
	width: 90%;
	height: calc(100vh - 120px);
	background: #fff;
	padding: 0.5rem;
	border-radius: 0.4rem;
	border: 1px solid #ccc;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
	box-shadow: var(--shad);
	position: relative;
}
</style>
