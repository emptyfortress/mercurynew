<script setup lang="ts">
import { ref } from 'vue'
import { motion, animate, stagger, AnimatePresence } from 'motion-v'
import { useRouter } from 'vue-router'

const router = useRouter()

const Div = motion.div

const play = () => {
	router.push('/dev/0')
}
</script>

<template lang="pug">
q-page(padding)
	.header Folder
	.cont
		Div.box(@click='play' layout-id="underline" layout)

</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
}
.cont {
	width: 1000px;
	margin: 0 auto;
}
.box {
	width: 100%;
	height: 400px;
	background-color: #fff;
	border-radius: 5px;
}
</style>
