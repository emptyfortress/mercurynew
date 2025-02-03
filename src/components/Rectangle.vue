<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter, } from 'vue-router'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useFlip } from '@/stores/flip'

const flip = useFlip()
const router = useRouter()

const navigate = (() => {
	router.push('try1')
})

gsap.registerPlugin(Flip)

onBeforeUnmount(() => {
	console.log('transition away from home');
	const elemToFlip = document.querySelector('[data-flip-id]');
	if (elemToFlip) {
		flip.setLastState(Flip.getState(elemToFlip))
	}

})

onMounted(() => {
	console.log('home page mounted');
	const elemToFlip = document.querySelector('[data-flip-id]');
	if (elemToFlip && flip.lastState) {
		Flip.from(flip.lastState, {
			targets: elemToFlip,
			duration: .3,
		})
	}

	flip.setLastState(null)

})
</script>

<template lang="pug">
.rectangle(data-flip-id="rect" @click="navigate")
</template>

<style scoped lang="scss">
.rectangle {
	width: 100px;
	height: 100px;
	background-color: blue;
	cursor: pointer;
}
</style>
