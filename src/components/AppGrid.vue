<script setup lang="ts">
import { ref, onMounted, nextTick, reactive, } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

onMounted(() => {
	gsap.fromTo('.item', {
		y: 100,
		opacity: 0,
		stagger: 0.2,
		delay: .5
	}, {
		y: 0,
		opacity: 1,
		stagger: 0.2,
		delay: .5
	})
})

const apps = reactive([
	{ id: 0, label: '', expand: false, },
	{ id: 1, label: '', expand: false, },
	{ id: 2, label: '', expand: false, },
	{ id: 3, label: '', expand: false, },
	{ id: 4, label: '', expand: false, },
	{ id: 5, label: '', expand: false, },
])

const expanded = ref<boolean>(false)

const calcClass = ((item: any) => {
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
	else return ''
})

const expand = async (item: any) => {
	const state = Flip.getState('.item')

	expanded.value = !expanded.value
	item.expand = !item.expand

	await nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: "power1.inOut",
			absolute: true,
			onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, }, { opacity: 1, duration: 0.6, ease: "linear", delay: .2 }),
			onLeave: (elements) => gsap.fromTo(elements, { opacity: 1, }, { opacity: 0, duration: 0.2, ease: "linear", }),
		})
	})
}

</script>

<template lang="pug">
.grid
	.item(v-for="item in apps" :key="item.id" @click='expand(item)' :class="calcClass(item)") {{ item.id }}

</template>

<style scoped lang="scss">
.item {
	width: 200px;
	height: 200px;
	background: #fff;
	border-radius: .5rem;
	cursor: pointer;
	transition: opacity .2s;

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.active {
		position: fixed;
		height: 70vh;
		width: 800px;
		margin: 0 auto;
		left: 0;
		right: 0;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.inactive {
		opacity: 0;
		user-select: none;
		display: none;
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
