<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
// import { gsap } from 'gsap'
// import { Flip } from 'gsap/Flip'
// import { useFlip } from '@/stores/flip'
import { useStorage } from '@vueuse/core'

// gsap.registerPlugin(Flip)

// const flip = useFlip()
const app = useStorage('app', localStorage)

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
q-page(data-flip-id="img" padding)
	h2 Assistent
	router-link(to='/') back

	div {{ app.type }}
	div {{ app.text }}
	pre(v-if="app.type == 0") {{ app.children }}
</template>

<style scoped lang="scss"></style>
