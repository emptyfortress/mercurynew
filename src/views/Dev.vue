<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// import { Motion, useMotionValue, useTransform } from 'motion-v'

const router = useRouter()

const Div = motion.div

const play = () => {
	router.push('/dev1')
}

// const x = useMotionValue(0)
const x = ref(0)
// const x1 = x.get()
// const xInput = [0, 500]

// const xT = useMotionValue(x.value)
// const background = useTransform(x, xInput, ['#ff0000', '#00FF00'])
</script>

<template lang="pug">
div
	.list
		Div.box(@click='play' layout-id="underline" :initial="{ x: 0 }" :animate='{ x }')
		// Div.box(drag="x" :style="{ x, background }")
		// br
	q-slider(v-model="x" :min="0" :max="500")
</template>

<style scoped lang="scss">
.list {
	width: 600px;
	height: 100px;
	margin: 2rem auto;
	background: #ccc;
}

.box {
	width: 100px;
	height: 100px;
	background-color: $primary;
	border-radius: 5px;
}

.box1 {
	justify-self: end;
	background: red;
	// flex-grow: 1;
}

.q-slider {
	width: 200px;
	margin: 1rem auto;
	display: block;
}
</style>
