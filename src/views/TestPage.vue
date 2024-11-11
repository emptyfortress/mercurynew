<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
import { useMotions, useMotion } from '@vueuse/motion'
import { promiseTimeout } from '@vueuse/core'
import { useApps } from '@/stores/apps'
import AddDialog from '@/components/AddDialog.vue'
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"

const myapps = useApps()


const cube = ref<HTMLElement>()
const box = ref<HTMLElement>()

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
	moved: { marginLeft: 500, opacity: 1 },
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

// const motions = useMotions()

const remove = ((index: number) => {
	tapes.value.splice(index, 1);
})



const action1 = (() => {
	tapes.value.push({ id: 8 })
	// items.push({ id: 8 })
})
const calcDelay = ((index: number) => {
	return myapps.newItem ? 200 : 500 + (100 * index)
})

const [parent, tapes] = useDragAndDrop(items)
</script>

<template lang="pug">
q-page(padding)
	q-btn(flat icon="mdi-close" color="primary" label="Отмена" @click="action") 
	.row.q-gutter-x-sm
		.cube(ref='cube')
		.box(ref="box")

		transition-group(name="list" tag='ul' ref="parent")
			.fuck(v-for="(item, index) in tapes" :key="item.id"
				v-motion
				:initial="{ y: 100, opacity: 0 }"
				:enter='{ y: 0, opacity: 1, transition: { delay: calcDelay(index) } }'
				@click="remove(index)"
				) {{ item.id }}


	q-btn(unelevated color="primary" label="add" @click="action1") 
	RouterLink.link(data-flip-id="img" to="/project")
</template>

<style scoped lang="scss">
ul {
	display: flex;
	gap: .5rem;
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

.box {
	width: 100px;
	height: 100px;
	background: red;
}
</style>
