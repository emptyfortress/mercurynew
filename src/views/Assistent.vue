<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useFlip } from '@/stores/flip'

gsap.registerPlugin(Flip)

const flip = useFlip()

onBeforeUnmount(() => {
	console.log('unmount assistent')

	const elemToFlip = document.querySelector('[data-flip-id]')
	if (elemToFlip) {
		let tmp = Flip.getState(elemToFlip)
		flip.setLastState(tmp)
	}
})

onMounted(() => {
	console.log('assistent mounted')

	const elemToFlip = document.querySelector('[data-flip-id]')
	if (elemToFlip && flip.lastState) {
		Flip.from(flip.lastState, {
			targets: elemToFlip,
			// other Flip properties
		});
	}

	// lastState.value = null;
	flip.setLastState(null)
})
</script>

<template lang="pug">
q-page(padding data-flip-id='page')
	h2 Assistent
</template>

<style scoped lang="scss">
.q-page {
	background: pink;
}
</style>
