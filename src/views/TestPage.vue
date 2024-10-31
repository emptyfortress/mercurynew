<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useFlip } from '@/stores/flip'

gsap.registerPlugin(Flip)

const flip = useFlip()

onBeforeUnmount(() => {
	const elemToFlip = document.querySelector('[data-flip-id]');
	if (elemToFlip) {
		let tmp = Flip.getState(elemToFlip);
		flip.setLastState(tmp)
	}
})

onMounted(() => {
	const elemToFlip = document.querySelector('[data-flip-id]');
	if (!!elemToFlip && !!flip.lastState) {
		Flip.from(flip.lastState, {
			targets: elemToFlip,
			duration: .3,
			toggleClass: 'test'
			// other Flip properties
		});
	}
	flip.setLastState(null)
})
</script>

<template lang="pug">
q-page
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
</style>
