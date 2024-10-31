<script setup lang="ts">
import { ref, onMounted, nextTick, reactive, computed } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

// onMounted(() => {
// 	squares.value = gsap.utils.toArray('.item')
// })

// onMounted(() => {
// 	gsap.from('.item', {
// 		y: 100,
// 		opacity: 0,
// 		stagger: 0.2,
// 		delay: .5
// 	})
// })

const apps = reactive([
	{ id: 0, label: '', expand: false, },
	{ id: 1, label: '', expand: false, },
	{ id: 2, label: '', expand: false, },
	{ id: 3, label: '', expand: false, },
	{ id: 4, label: '', expand: false, },
	{ id: 5, label: '', expand: false, },
])

const items = ref()
const big = ref()
const expanded = ref<boolean>(false)

const squares = ref([])
onMounted(() => {
	squares.value = gsap.utils.toArray('.square')
})

const calcVis = ((item: any) => {
	if (expanded.value == false) return true
	if (expanded.value == true && item.expand == true) return true
	return false
})

const expand = async (item: any) => {
	const state = Flip.getState('.item')
	expanded.value = true
	item.expand = true
	await nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			fade: true,
			absolute: true,
			toggleClass: "flipping",
			ease: "power1.inOut"
		})
	})
}

const reset = (() => {
	expanded.value = false
})
</script>

<template lang="pug">
.grid
	template(v-for="item in apps" :key="item.id")
		.item(v-if='calcVis(item)'  @click='expand(item)' :class="{ active: item.expand }" ) {{ item.id }}

</template>

<style scoped lang="scss">
.item {
	width: 200px;
	height: 200px;
	background: #fff;
	border-radius: .5rem;
	cursor: pointer;

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.active {
		position: fixed;
		// left: 50%;
		height: 70vh;
		width: 600px;
		margin: 0 auto;
		left: 0;
		right: 0;
	}
}

.itembig {
	position: relative;
	flex-shrink: 0;
	flex-grow: 0;
	height: 90%;
	aspect-ratio: 1/1;
	border: 1px solid #ccc;
	background: #fff;
	box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	border-radius: .5rem;
	display: none;

	&.active {
		display: block;
		z-index: 2;
	}
}

.item,
.item.flipping {
	visibility: visible;
}

.grid {
	--width: 200px;
	margin: 1rem;
	display: grid;
	// grid-auto-flow: row;
	// grid-template-columns: repeat(auto-fill, var(--width));
	grid-template-columns: repeat(5, var(--width));
	gap: 1rem;
}
</style>
