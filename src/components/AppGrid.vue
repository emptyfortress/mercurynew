<script setup lang="ts">
import { ref, onMounted, nextTick, reactive, } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

onMounted(() => {
	gsap.fromTo('.item', {
		y: 100,
		opacity: 0,
	}, {
		y: 0,
		opacity: 1,
		stagger: 0.2,
		delay: .5
	})
})

const apps = reactive([
	{ id: 0, label: 'Приложение 1', expand: false, },
	{ id: 1, label: 'Приложение 2', expand: false, },
	{ id: 2, label: 'Приложение 3', expand: false, },
	{ id: 3, label: 'Приложение 4', expand: false, },
	{ id: 4, label: 'Приложение 5', expand: false, },
	{ id: 5, label: 'Приложение 6', expand: false, },
])

const expanded = ref<boolean>(false)

const calcClass = ((item: any) => {
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
	else return ''
})

const expand = (item: any) => {
	const state = Flip.getState('.item')

	expanded.value = !expanded.value
	item.expand = !item.expand

	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			absolute: true,
			onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, }, { opacity: 1, duration: 0.6, ease: "linear", delay: .2 }),
			onLeave: (elements) => gsap.fromTo(elements, { opacity: 1, }, { opacity: 0, duration: 0.2, ease: "linear", }),
		})
	})
	if (expanded.value) {
		nextTick(() => {
			gsap.from('.desc', {
				y: 100,
				opacity: 0,
				duration: 0.3,
				delay: .3,
			})
		})
	}
}

</script>

<template lang="pug">
.grid
	.item(v-for="item in apps" :key="item.id" @click='expand(item)' :class="calcClass(item)")
		.hd {{ item.label }}
		.bl
			div
				.desc(v-if='expanded') Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, libero. Impedit, distinctio sed at optio exercitationem quos culpa? Atque vitae aspernatur possimus praesentium culpa id eum! Velit dolores eos aliquam?
				.desc(v-if='expanded') Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, libero. Impedit, distinctio sed at optio exercitationem quos culpa? Atque vitae aspernatur possimus praesentium culpa id eum! Velit dolores eos aliquam?
			q-card-actions.desc(v-if='expanded' align="right")
				q-btn(unelevated color="primary" label="Ассистент" @click.stop="") 
				q-space
				q-btn(flat color="primary" label="Отмена" @click="") 
				q-btn(unelevated color="primary" label="Настройки" @click.stop="") 

</template>

<style scoped lang="scss">
.bl {
	height: calc(100% - 1rem);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-bottom: 1rem;
	overflow: hidden;
}

.desc {
	margin-top: 1rem;
	font-size: .9rem;
}

.item {
	width: 200px;
	height: 200px;
	background: #fff;
	border-radius: .5rem;
	cursor: pointer;
	padding: 1rem;

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.active {
		position: fixed;
		height: 70vh;
		width: 80%;
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
	grid-template-columns: repeat(5, var(--width));
	gap: 1rem;
}
</style>
