<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
// import LineiconsFlag2 from '@/components/icons/LineiconsFlag2.vue'
// import IconamoonEnter from '@/components/icons/IconamoonEnter.vue'
import { useRouter, } from 'vue-router'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useFlip } from '@/stores/flip'
import Rectangle from '@/components/Rectangle.vue'

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
q-page(padding)
	.cont
		h2 Try
		Rectangle

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
	width: 100px;
	height: 100px;
	background-color: blue;
	cursor: pointer;
}

.myrow {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: .5rem;
	margin-top: 2rem;
}

.bt {
	width: 200px;
	height: 120px;
	padding: 1rem;
	border: 1px solid $secondary;
	border-radius: var(--rad);
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: start;
	color: $secondary;
	font-weight: 600;
	cursor: pointer;

	&:hover {
		background: $secondary;
		color: white;
	}
}

.ic {
	font-size: 2rem;
}
</style>
