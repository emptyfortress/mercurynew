<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter, } from 'vue-router'
import { useFlip } from '@/stores/flip'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'


const flip = useFlip()
const router = useRouter()
gsap.registerPlugin(Flip)

const navigate = (() => {
	router.push('try')
})

onBeforeUnmount(() => {
	console.log('transition away from project');

	const elemToFlip = document.querySelector('[data-flip-id]');
	if (elemToFlip) {
		flip.setLastState(Flip.getState(elemToFlip))
		// lastState = Flip.getState(elemToFlip);
	}
})

onMounted(() => {
	console.log('project page mounted');

	const elemToFlip = document.querySelector('[data-flip-id]');
	if (elemToFlip && flip.lastState) {
		Flip.from(flip.lastState, {
			targets: elemToFlip,
		})
	}

	flip.setLastState(null)
	// lastState = null
})

</script>

<template lang="pug">
q-page(padding)
	.cont
		h2 Fuck
		.rectangle(data-flip-id="rect" @click="navigate")
</template>

<style scoped lang="scss">
.cont {
	width: 1000px;
	margin: 0 auto;
}

.rectangle {
	width: 200px;
	height: 200px;
	background-color: blue;
}
</style>
