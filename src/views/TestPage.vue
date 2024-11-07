<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
// import { gsap } from 'gsap'
// import { Flip } from 'gsap/Flip'
// import { useFlip } from '@/stores/flip'
import { useMotion } from '@vueuse/motion'
import { promiseTimeout } from '@vueuse/core'

// gsap.registerPlugin(Flip)

// const flip = useFlip()

// onBeforeUnmount(() => {
// 	const elemToFlip = document.querySelector('[data-flip-id]')
// 	if (elemToFlip) {
// 		let tmp = Flip.getState(elemToFlip)
// 		flip.setLastState(tmp)
// 	}
// })
//
// onMounted(() => {
// 	const elemToFlip = document.querySelector('[data-flip-id]')
// 	if (!!elemToFlip && !!flip.lastState) {
// 		Flip.from(flip.lastState, {
// 			targets: elemToFlip,
// 			duration: .3,
// 			toggleClass: 'test'
// 		});
// 	}
// 	flip.setLastState(null)
// })

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

</script>

<template lang="pug">
q-page(padding)
	q-btn(flat icon="mdi-close" color="primary" label="Отмена" @click="action") 
	.row.q-gutter-x-sm
		.cube(ref='cube')
		.box(ref="box")

	RouterLink.link(data-flip-id="img" to="/project")
</template>

<style scoped lang="scss">
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
