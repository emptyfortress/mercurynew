<script setup lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable'

// import { onBeforeUnmount, onMounted, ref } from 'vue'
// import { gsap } from 'gsap'
// import { Flip } from 'gsap/Flip'
// import { useFlip } from '@/stores/flip'

// gsap.registerPlugin(Flip)

// const flip = useFlip()

// onBeforeUnmount(() => {
// 	const elemToFlip = document.querySelector('[data-flip-id]')
// 	if (elemToFlip) {
// 		let tmp = Flip.getState(elemToFlip)
// 		flip.setLastState(tmp)
// 	}
// })

// onMounted(() => {
// 	const elemToFlip = document.querySelector('[data-flip-id]')
// 	if (elemToFlip && flip.lastState) {
// 		Flip.from(flip.lastState, {
// 			targets: elemToFlip,
// 			duration: .3,
// 			toggleClass: 'test'
// 			// other Flip properties
// 		});
// 	}
// 	flip.setLastState(null)
// 	setTimeout(() => {
// 		gsap.to('.q-page', {
// 			backgroundColor: 'transparent',
// 			duration: 2,
// 		})
// 	}, 500)
// })
</script>

<template lang="pug">
q-page()

	div(:style="{ position: 'relative', height: '800px', border: '1px solid blue', margin: '1em', }")
		vue-draggable-resizable(
			:parent='true'
			:resizable='true'
			)
			div laдофыдво
</template>

<style scoped lang="scss">
.q-page {
	// background: pink;
}
</style>
