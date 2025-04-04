<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import { useRouter } from 'vue-router'

const router = useRouter()

const Div = motion.div

const play = () => {
	router.push('/dev')
}
</script>

<template lang="pug">
div
	Div.list()
		Div.box1(@click='play' layout-id="underline")
	br
	Div.text-center(
		:initial="{ opacity: 0, y: 200 }"
		:animate="{ opacity: 1, y: 0, transition: { delay: .5 } }"
		)
		ul
			li lajsdljalsdjlk
			li lajsdljalsdjlk
			li lajsdljalsdjlk

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
