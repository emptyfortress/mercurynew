<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
// import { gsap } from 'gsap'
// import { Flip } from 'gsap/Flip'
// import { useFlip } from '@/stores/flip'
import { useMotions, useMotion } from '@vueuse/motion'

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
// 			// other Flip properties
// 		});
// 	}
// 	flip.setLastState(null)
// })
//
//

const cube = ref<HTMLElement>()
const box = ref<HTMLElement>()

const cubeVariants = {
	initial: { scale: 1 },
	enter: { scale: 0.5, transition: { delay: 1000, onComplete: () => (variant.value = 'custom') } },
	custom: { scale: 2, transition: { delay: 1000, onComplete: () => (variant.value = 'initial') } }
}

const { variant } = useMotion(cube, cubeVariants)

const action = async () => {
	// await cubeAnim('set1')
	// await cubeAnim('enter')
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
