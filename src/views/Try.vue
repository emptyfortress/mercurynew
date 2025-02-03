<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
// import IconFlag from '@/components/icons/IconFlag.vue'
// import IconEntrance from '@/components/icons/IconEntrance.vue'
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
q-page(padding)
	.cont
		h2 Try
		.rectangle(data-flip-id="rect" @click="navigate")

		// .myrow
			.bt(@click.stop='navigate')
				div
					IconFlag.ic
					div Создать первичные настройки
			.bt(@click.stop='navigate')
				div
					IconEntrance.ic
					div Перейти к приложению
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
