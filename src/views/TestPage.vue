<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
import { useMotions, useMotion } from '@vueuse/motion'
import { promiseTimeout } from '@vueuse/core'
import { useApps } from '@/stores/apps'
import AddDialog from '@/components/AddDialog.vue'
import { state } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"

const myapps = useApps()


const cube = ref<HTMLElement>()

const { apply: cardAnim, stop } = useMotion(cube, {
	enter: {
		opacity: 1,
		y: 0,
		marginLeft: 0,
		transition: {
			onComplete: () => cardAnim('levitate'),
		},
	},
	levitate: {
		y: 5,
		transition: {
			duration: 1000,
			repeat: Infinity,
			ease: "easeInOut",
			repeatType: "mirror",
		},
	},
	moved: { marginLeft: 300, opacity: 1 },
	custom: { marginLeft: 0, transition: { delay: 2000, stiffness: 150, damping: 20, mass: .5 } },
})

const action = async () => {
	await cardAnim('moved')
	await cardAnim('custom')
	await promiseTimeout(3000)
	stop()
}

const items = [
	{ id: 0 },
	{ id: 1 },
	{ id: 2 },
	{ id: 3 },
	{ id: 4 },
	{ id: 5 },
]
const doneItems = [
	{ id: 6 },
]

// const motions = useMotions()

const remove = ((index: number) => {
	// items.value.splice(index, 1);
	tapes.value.splice(index, 1);
})



const action1 = (() => {
	tapes.value.push({ id: 8 })
	// items.push({ id: 8 })
})
const calcDelay = ((index: number) => {
	return myapps.newItem ? 200 : 500 + (100 * index)
})

const [parent, tapes] = useDragAndDrop([
	{ id: 0 },
	{ id: 1 },
	{ id: 2 },
	{ id: 3 },
	{ id: 4 },
	{ id: 5 },
], { group: "todoList" })

const [parent1, tapes1] = useDragAndDrop([
	{ id: 6 },
], { group: "todoList" })

const dragging = ref(false)

state.on("dragStarted", () => {
	dragging.value = true
})
state.on("dragEnded", () => {
	dragging.value = false
})
const test = ((evt: DragEvent, id: number) => {
	console.log(evt)
})
</script>

<template lang="pug">
q-page(padding)
	q-btn(flat icon="mdi-close" color="primary" label="Отмена" @click="action") 
	ul
		.cube(ref='cube')

		transition-group(name="list" ref='parent' tag='ul')
			.fuck(v-for="(item, index) in tapes" :key="item.id"
				v-motion
				:initial="{ y: 100, opacity: 0 }"
				:enter='{ y: 0, opacity: 1, transition: { delay: calcDelay(index) } }'
				@drop="test(evt, item.id)"
				) {{ item.id }}


	q-btn.q-mt-sm(unelevated color="primary" label="add" @click="action1") 

	RouterLink.link(data-flip-id="img" to="/project")
	.target(v-if='dragging' @drop="test")
</template>

<style scoped lang="scss">
q-page {
	position: relative;
}

ul {
	display: flex;
	gap: .5rem;
	flex-wrap: wrap;
}

.target {
	position: fixed;
	left: 50%;
	bottom: 1rem;
	width: 200px;
	height: 100px;
	background: #ccc;
	border: 2px dashed black;
}

.fuck {
	width: 100px;
	height: 100px;
	background: #fff;

}

.link {
	position: absolute;
	bottom: 2rem;
	right: 2rem;
	background: #fff;
	background: pink;
	width: 124px;
	height: 124px;
}

.cube {
	width: 300px;
	height: 200px;
	background: #fff;
}
</style>
