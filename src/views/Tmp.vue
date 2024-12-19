<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

const expand = () => {
	console.log(111)
	const state = Flip.getState('.it, .ani')
	expanded.value = !expanded.value
	nextTick(() => {
		Flip.from(state, {
			duration: .6,
			targets: '.it, .ani',
			absolute: true,
			absoluteOnLeave: true,
			ease: "elastic.out(.5, 0.9)",
		})
	})
}
const expanded = ref(false)
const expanded1 = ref(false)

const calcClass = (item: any) => {
	if (expanded1.value == true && item.expand == true) return 'act'
	if (expanded1.value == true && item.expand == false) return 'inact'
	else return ''
}

const expand1 = (item: any) => {
	const state = Flip.getState('.child')
	expanded1.value = !expanded1.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: .4,
			targets: '.child',
			absolute: true,
			absoluteOnLeave: true,
			ease: "elastic.out(.8, 1)",
		})
		console.log(333)
	})
}


const arr = [
	{ id: 0, expand: false },
	{ id: 1, expand: false },
	{ id: 2, expand: false },
]
</script>

<template lang="pug">
q-page(padding)
	.list
		.it
		.it(@click="expand" :class="{ active: expanded }")
			.zag(v-if='!expanded1') Группа
			.some(v-if='expanded')
				.child(
					v-for="(el, index) in arr" :key='el.id'
					@click.stop="expand1(el)"
					:class="calcClass(el)"
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
		height: 100vh;
		width: 100vw;
		left: 0;
		right: 0;
		// top: 50px;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 80, 80, 0.15);
		backdrop-filter: blur(3px);
		// padding: 1rem;
		// padding-top: 100px;
		z-index: 10;

		.some {
			display: flex;
			justify-content: center;
			gap: 1rem;
		}
	}
}

.child {
	width: 150px;
	height: 150px;
	background: #fff;

	&.act {
		position: fixed;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		left: 60px;
		right: 0;
		margin-top: 53px;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);

	}

	&.inact {
		display: none;
	}

}

.zag {
	font-size: 1rem;
	text-align: center;

	.active & {
		font-size: 1.2rem;
		margin-top: 10px;
		margin-bottom: 1rem;
	}
}
</style>
