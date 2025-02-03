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

	const elemToFlip = document.querySelector('[data-flip-id="rect"]');
	if (elemToFlip) {
		flip.setLastState(Flip.getState(elemToFlip))
	}
})

onMounted(() => {
	console.log('project page mounted');

	const elemToFlip = document.querySelector('[data-flip-id="rect"]');
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
q-page(padding)
	.cont
		h2 Fuck
		.rectangle(data-flip-id="rect" @click="navigate")
	q-btn(unelevated color="primary" label="Отмена" @click="") 

</template>

<style scoped lang="scss">
.q-page {
	position: relative;
}

.cont {
	width: 1000px;
	margin: 0 auto;
}

.rectangle {
	width: 100%;
	height: calc(100vh - 50px);
	background: blue;
	position: fixed;
	top: 50px;
	left: 0;
}
</style>
