<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
// import { useMotion } from '@vueuse/motion'

gsap.registerPlugin(Flip)

// const item = ref()
// const item1 = ref()


const expand = () => {
	console.log(111)
	const state = Flip.getState('.it')
	expanded.value = !expanded.value
	nextTick(() => {
		Flip.from(state, {
			duration: .4,
			targets: '.it',
			absolute: true,
			absoluteOnLeave: true,
			ease: "elastic.out(.7, 0.9)",
			// ease: 'power3.inOut',
		})
	})
}
const expanded = ref(false)

const arr = [
	{ id: 0 },
	{ id: 1 },
	{ id: 2 },
]
</script>

<template lang="pug">
q-page(padding)
	.list
		.it
		.it( @click="expand" :class="{ active: expanded }")
			.child(v-if='expanded'
				v-for="(item, index) in arr" :key='item.id'
				v-motion
				:initial="{ scale: .3, opacity: 0 }"
				:enter="{ scale: 1, opacity: 1, transition: { delay: 200 + 100 * index } }"
				)
		.it
</template>

<style scoped lang="scss">
.list {
	display: flex;
	gap: 1rem;
}

.it {
	width: 150px;
	height: 150px;
	background: #fff;
	position: relative;

	&.active {
		position: fixed;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		left: 0;
		right: 0;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);

		display: flex;
		justify-content: center;
		gap: 1rem;
		background: #ccc;
		padding: 1rem;
		z-index: 10;
	}
}

.child {
	width: 150px;
	height: 150px;
	background: #fff;
	position: absolute;
	top: 0;
	left: 0;

	.active & {
		position: static;
	}

}
</style>
