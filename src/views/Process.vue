<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMotion } from '@vueuse/motion'
import PlusButton from '@/components/PlusButton.vue'
import { useElementSize } from '@vueuse/core'

const blocks = ref([
	{ id: 1, selected: false },
	{ id: 2, selected: false },
	{ id: 3, selected: false },
])

const editor = ref<HTMLElement>()
const { width, height } = useElementSize(editor)

const calcWidth = computed(() => {
	return width.value - 400 + 'px'
})
const startWidth = computed(() => {
	return window.innerWidth
})
const { apply: editorAnim, stop } = useMotion(editor, {
	enter: {
		opacity: 1,
		y: 0,
		x: 0,
		marginLeft: 0,
		width: 1400,
		transition: {
			// onComplete: () => editorAnim('levitate'),
		},
	},
	start: { width: 1400, x: 0, transition: { stiffness: 200, damping: 20 } },
	shrink: { width: 1000, x: -190, transition: { stiffness: 200, damping: 20 } },
	move: { x: -300, transition: { stiffness: 200, damping: 20 } },
})

const selection = ref<number | null>(null)
const select = (n: number) => {
	if (selection.value == n) {
		selection.value = null
	} else selection.value = n
}

const calcClass = (n: number) => {
	return selection.value == n ? 'selected' : ''
}

const shrink = async () => {
	await editorAnim('shrink')
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
		.text Диаграмма {{ width }}
		.text Диаграмма {{ startWidth }}
		.center
			.block(v-for="item in blocks" :key='item.id'
				:class='calcClass(item.id)'
				@click='select(item.id)'
				) {{ item.id }}
		.footer footer {{ selection }}

		PlusButton(@activate='shrink' @stop='start')

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
	position: relative;
}
.editor {
	// width: 90%;
	height: calc(100vh - 120px);
	background: #fff;
	// padding: 0.5rem;
	border-radius: 0.4rem;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
	box-shadow: var(--shad);
	transform-origin: bottom right;
	position: relative;
}
.text {
	font-size: 1.2rem;
}
.center {
	display: flex;
	justify-content: center;
	gap: 6rem;
}
.block {
	width: 150px;
	height: 80px;
	background: #ccc;
	cursor: pointer;
	&.selected {
		border: 3px solid black;
	}
}
.footer {
	font-size: 0.8rem;
}
</style>
