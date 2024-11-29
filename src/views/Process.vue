<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMotion } from '@vueuse/motion'
import PlusButton from '@/components/PlusButton.vue'

const blocks = ref([
	{ id: 1, selected: false },
	{ id: 2, selected: false },
	{ id: 3, selected: false },
])

const editor = ref<HTMLElement>()
const prop = ref<HTMLElement>()

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
	shrink: { width: '78%', x: '-14%', transition: { stiffness: 200, damping: 20 } },
	shrink1: { width: '75%', x: '12%', transition: { stiffness: 200, damping: 20 } },
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
	transform-origin: bottom right;
	position: relative;
}
.prop {
	width: 48px;
	height: 48px;
	background: #fff;
	box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.2);
	border-radius: 50%;
	border: 1px solid #ccc;
	position: absolute;
	top: 0;
	right: -50px;
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
