<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { useMotion } from '@vueuse/motion'
import VueDraggableResizable from 'vue-draggable-resizable'

const app = useStorage('app', localStorage)

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
	levitate: {
		y: 5,
		transition: {
			duration: 1000,
			repeat: Infinity,
			ease: 'easeInOut',
			repeatType: 'mirror',
		},
	},
	start: { width: '90%', x: '0%', transition: { stiffness: 200, damping: 20 } },
	shrink: { width: '70%', x: '-20%', transition: { stiffness: 200, damping: 20 } },
	move: { x: -300, transition: { stiffness: 200, damping: 20 } },
})
const { apply: propAnim, stop1 } = useMotion(prop, {
	initial: {
		opacity: 0,
		scaleX: '0%',
	},
	enter: {
		opacity: 1,
		scaleX: '100%',
		transition: { stiffness: 200, damping: 20 },
	},
	start: {
		opacity: 1,
		scaleX: '100%',
		transition: { stiffness: 200, damping: 20 },
	},
	exit: {
		opacity: 0,
		scaleX: '0%',
		transition: { stiffness: 200, damping: 20 },
	},
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

watch(selection, (val) => {
	if (val !== null) {
		shrink()
	} else start()
})

const shrink = async () => {
	await editorAnim('shrink')
	stop()
}
const start = async () => {
	await editorAnim('start')
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
		.prop(ref='prop' v-if='selection')
			.text Свойства
			.text Этап {{ selection }}

	vue-draggable-resizable()
		div laдофыдво

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
	box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.2);
	// overflow: hidden;
	transform-origin: bottom right;
	position: relative;
}
.prop {
	width: 40%;
	height: calc(100vh - 120px);
	background: #fff;
	box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.2);
	border-radius: 0.4rem;
	padding: 0.5rem;
	border: 1px solid #ccc;
	// overflow: hidden;
	position: absolute;
	top: 0;
	right: -41%;
	z-index: -3;
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
