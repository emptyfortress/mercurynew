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
		label: 'Category A',
		children: [
			{
				id: 101,
				label: 'Regular Subcategory',
				children: [
					{ id: 1001, label: 'Item 1' },
					{ id: 1002, label: 'Item 2' },
				],
			},
			{
				id: 102,
				label: 'Special Subcategory',
				isSpecial: true, // Marks this as a special level
				children: [
					{ id: 2001, label: 'Option 1' },
					{ id: 2002, label: 'Option 2' },
					{ id: 2003, label: 'Option 3' },
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
	MultilevelMenu()
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
