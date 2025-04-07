<script setup lang="ts">
import { ref } from 'vue'
import { motion, animate, stagger, AnimatePresence } from 'motion-v'
import { useRouter } from 'vue-router'

const router = useRouter()

const Div = motion.div

const play = () => {
	router.push('/dev')
}

const test = () => {
	console.log(list.value)
	animate('.che', { opacity: 0, y: -100 }, { delay: stagger(0.2) })
}
const list = ref()
</script>

<template lang="pug">
div
	Div.list()
		Div.box1(@click='test' layout-id="underline")
	br
	ul.text-center(ref='list')
		.che lajsdljalsdjlk
		.che lajsdljalsdjlk
		.che lajsdljalsdjlk

</template>

<style scoped lang="scss">
.list {
	width: 600px;
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
	width: 100px;
	height: 100px;
	background-color: $primary;
	border-radius: 5px;
	justify-self: end;
	background: red;
	// flex-grow: 1;
}
</style>
