<script setup lang="ts">
import { ref, computed, nextTick, h } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useWindowSize } from '@vueuse/core'

gsap.registerPlugin(Flip)

const adding = ref(false)

const add = (() => {
	const state = Flip.getState('.button, .dialog')
	adding.value = !adding.value
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.button, .dialog',
			absolute: true,
			fade: true,
		})
	})
})

const { width, height } = useWindowSize()

const left = computed(() => {
	return width.value / 2 - 200 + 64 + 'px'
})
const top = computed(() => {
	return height.value / 2 - 100 + 'px'
})
</script>

<template lang="pug">
div
	.button(v-if='!adding'
		data-flip-id='test'
		:class="{ active: adding }"
		@click="add"
		v-motion
		:initial="{ y: 20, opacity: 0 }"
		:enter='{ y: 0, opacity: 1, transition: { delay: 800 } }')
		q-icon(name="mdi-plus" color="white" size="md")

	.dialog(
		:class="{ active: adding }"
		data-flip-id='test'
		@click="add"
		)
</template>

<style scoped lang="scss">
.button {
	background: $primary;
	width: 42px;
	height: 42px;
	border-radius: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 2rem;
	cursor: pointer;
}

.active {
	display: none;
}

.dialog {
	width: 400px;
	height: 200px;
	background: #fff;
	position: fixed;
	left: v-bind(left);
	top: v-bind(top);
	border-radius: .5rem;
	box-shadow: var(--shad0);
	display: none;

	&.active {
		display: block;
	}
}
</style>
