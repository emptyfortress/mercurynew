<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

const squares = ref([])

onMounted(() => {
	squares.value = gsap.utils.toArray('.item')
})

onMounted(() => {
	gsap.from('.item', {
		y: 100,
		opacity: 0,
		stagger: 0.2,
		delay: .2
	})
})

const apps = ref([
	{ id: 0, label: '', expand: false, },
	{ id: 1, label: '', expand: false, },
	{ id: 2, label: '', expand: false, },
	{ id: 3, label: '', expand: false, },
	{ id: 4, label: '', expand: false, },
	{ id: 5, label: '', expand: false, },
])

const items = ref()
const big = ref()
const expanded = ref<null | number>(null)

const expand = ((ind: number) => {
	let item = items.value[ind]
	const state = Flip.getState(item, big.value)
	console.log(state)
	expanded.value = ind
	console.log(state)
	nextTick(() => {
		Flip.from(state, { duration: 0.5, ease: 'power3.in' })
	})
})

const reset = (() => {
	expanded.value = null
})
</script>

<template lang="pug">
.grid()
	.item(ref='items' v-if='expanded == null' v-for="e in apps" :key="e.id" @click='expand(e.id)') {{ e.id }}
.itembig(ref='big' v-if='expanded !== null' @click='reset') {{ expanded }}
</template>

<style scoped lang="scss">
.item {
	width: 200px;
	height: 200px;
	background: #fff;
	height: var(--width);
	border-radius: .5rem;
	cursor: pointer;

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
}

.grid {
	--width: 200px;
	margin: 1rem;
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: repeat(auto-fill, var(--width));
	gap: 1rem;
}

.itembig {
	width: 600px;
	height: 600px;
	background: #fff;
	position: fixed;
	top: 1rem;
	left: 50%;
	transform: translateX(-50%);
	border: 1px solid #ccc;
	box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	border-radius: .5rem;
}
</style>
