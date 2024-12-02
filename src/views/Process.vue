<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMotion } from '@vueuse/motion'
import PlusButton from '@/components/PlusButton.vue'

const blocks = ref([
	{ id: 1, selected: false },
	{ id: 2, selected: false },
	{ id: 3, selected: false },
])

const editor = ref<HTMLElement>()

const { apply: editorAnim, stop } = useMotion(editor, {
	initial: {
		opacity: 1,
		y: 0,
		x: 0,
		marginLeft: 0,
		width: 1500,
	},
	start: { width: 1500, x: 0, transition: { stiffness: 200, damping: 20 } },
	shrink: { width: 1150, x: -175, transition: { stiffness: 200, damping: 20 } },
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
		.text Диаграмма
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
