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
	shrink: { width: '75%', x: '-13%', transition: { stiffness: 200, damping: 20 } },
	shrink1: { width: '75%', x: '12%', transition: { stiffness: 200, damping: 20 } },
	move: { x: -300, transition: { stiffness: 200, damping: 20 } },
})

const shrink = async () => {
	await editorAnim('shrink')
	stop()
}

const shrink1 = async () => {
	await editorAnim('shrink1')
	stop()
}

const start = async () => {
	setTimeout(() => {
		editorAnim('start')
	}, 400)
	stop()
}
</script>

<template lang="pug">
q-page(padding)
	.editor(ref='editor')
		.text Form

		PlusButton1(@activate='shrink' @stop='start')
		LibButton(@activate='shrink1' @stop='start')

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
