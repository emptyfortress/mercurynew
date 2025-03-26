<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MultilevelMenu from '@/components/MultilevelMenu.vue'
// import { Motion, useMotionValue, useTransform } from 'motion-v'

const router = useRouter()

const Div = motion.div

const play = () => {
	router.push('/dev1')
}

const x = ref(0)

const menuData = [
	{
		id: 1,
		label: 'Electronics',
		children: [
			{
				id: 101,
				label: 'Computers',
				children: [
					{
						id: 1001,
						label: 'Laptops',
						children: [
							{ id: 10001, label: 'Gaming Laptops' },
							{ id: 10002, label: 'Ultrabooks' },
						],
					},
					{
						id: 1002,
						label: 'Desktops',
					},
				],
			},
			{
				id: 102,
				label: 'Phones',
			},
		],
	},
	{
		id: 2,
		label: 'Clothing',
		children: [
			{
				id: 201,
				label: 'Men',
				children: [
					{ id: 2001, label: 'Shirts' },
					{ id: 2002, label: 'Pants' },
				],
			},
		],
	},
]
</script>

<template lang="pug">
div
	.list
		Div.box(@click='play' layout-id="underline" :initial="{ x: 0 }" :animate='{ x }')
		// Div.box(drag="x" :style="{ x, background }")
		// br
	q-slider(v-model="x" :min="0" :max="500")
	br
	MultilevelMenu(:menu-data="menuData")
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
