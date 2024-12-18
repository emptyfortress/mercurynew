<script setup lang="ts">
import { ref } from 'vue'
import { useMotion } from '@vueuse/motion'

const item = ref()
const item1 = ref()

const { apply } = useMotion(item, {
	initial: { x: 0, y: 0, rotate: '0deg', opacity: 0 },
	// enter: { x: 0, y: 0, opacity: 1 },
	jump: { x: 200, rotate: '3deg', opacity: 1, },
})

const { apply: newItem } = useMotion(item1, {
	initial: { x: 0, y: 0, rotate: '0deg', opacity: 0 },
	// enter: { x: 0, y: 0, opacity: 1 },
	jump: { x: 400, rotate: '-3deg', opacity: 1 },
})

const expand = () => {
	console.log(111)
	expanded.value = true
	apply('jump')
	newItem('jump')
}
const expanded = ref(false)
</script>

<template lang="pug">
q-page(padding)
	.list
		.it
		.it( @click="expand")
			.child(v-if='expanded' ref="item")
			.child(v-if='expanded' ref="item1")
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
}

.child {
	width: 150px;
	height: 150px;
	position: absolute;
	top: 0;
	left: 0;
	background: #ccc;
	z-index: -2;
}
</style>
