<script setup lang="ts">
import { ref } from 'vue'
import { motion, animate, stagger, AnimatePresence } from 'motion-v'
import { useRouter } from 'vue-router'
import IconFolderOpen from '@/components/icons/IconFolderOpen.vue'

const router = useRouter()

const Div = motion.div

const play = () => {
	router.push('/')
}
</script>

<template lang="pug">
q-page(padding)
	Div.header(layout-id='zag')
		IconFolderOpen.ic
		|Приложения отдела маркетинга
	.cont
		Div.box(@click='play' layout-id="underline")

</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
	vertical-align: bottom;
}
.ic {
	font-size: 1.9rem;
	margin-bottom: -5px;
	margin-right: 0.5rem;
}
.cont {
	width: 728px;
	margin: 0 auto;
	margin-bottom: 0.5rem;
}
.box {
	width: 100%;
	height: 400px;
	background: hsl(213deg 83.95% 94.68%);
	border: 2px solid var(--green);
	border-radius: 0.5rem;
	z-index: 10;
}
</style>
