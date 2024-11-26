<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { useMotion } from '@vueuse/motion'
import VueDraggableResizable from 'vue-draggable-resizable'

const app = useStorage('app', localStorage)

const blocks = ref([
	{ id: 0, selected: false },
	{ id: 1, selected: false },
	{ id: 2, selected: false },
])

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
	levitate: {
		y: 5,
		transition: {
			duration: 1000,
			repeat: Infinity,
			ease: 'easeInOut',
			repeatType: 'mirror',
		},
	},
	shrink: { width: '60%', x: '-30%', transition: { stiffness: 200, damping: 20 } },
	move: { x: -300, transition: { stiffness: 200, damping: 20 } },
})

const select = (e: any) => {
	blocks.value.map((item) => (item.selected = false))
	e.selected = true
	action()
}

const action = async () => {
	await editorAnim('shrink')
	// await editorAnim('move')
	// await promiseTimeout(3000)
	stop()
}
</script>

<template lang="pug">
q-page(padding)

	.editor(ref='editor')
		.text Диаграмма
		.center
			.block(v-for="item in blocks" :key='item.id'
				:class='{selected: item.selected}'
				@click='select(item)'
				)
		.footer footer

	// .test()
	vue-draggable-resizable()
		div laдофыдво

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	// align-items: start;
	justify-content: center;
	position: relative;
}
.editor {
	// width: 1280px;
	// height: 600px;
	height: calc(100vh - 120px);
	background: #fff;
	padding: 0.5rem;
	border-radius: 0.4rem;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.2);
	overflow: hidden;
	transform-origin: bottom right;
}
// .inner {
// 	width: 300px;
// 	overflow: hidden;
// 	background: pink;
// }
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
