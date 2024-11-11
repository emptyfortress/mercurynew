<script setup lang="ts">
import { ref, onMounted, nextTick, reactive, onBeforeUnmount, } from 'vue'
import { onBeforeRouteLeave, useRouter, } from 'vue-router'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useFlip } from '@/stores/flip'
import { useApps } from '@/stores/apps'
// import { useMotions } from '@vueuse/motion'
// import { useDragAndDrop } from "@formkit/drag-and-drop/vue"

const myapps = useApps()
// const motions = useMotions()

const router = useRouter()

gsap.registerPlugin(Flip)

// onMounted(() => {
// 	gsap.fromTo('.item', {
// 		y: 100,
// 		opacity: 0,
// 	}, {
// 		y: 0,
// 		opacity: 1,
// 		stagger: 0.2,
// 		delay: .5
// 	})
// })

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
	// if (expanded.value) {
	// 	nextTick(() => {
	// 		gsap.from('.desc', {
	// 			y: 100,
	// 			opacity: 0,
	// 			duration: 0.3,
	// 			delay: .3,
	// 		})
	// 	})
	// }
}

// const onBeforeEnter = (() => {
// 	console.log('beforeEnter')
// })
// const onEnter = (() => {
// 	console.log('enter')
// })
// const onLeave = (() => {
// 	console.log('leave')
// })
const list = ref(myapps.apps)

const remove = ((n: number) => {
	console.log(111)
})
</script>

<template lang="pug">
// TransitionGroup.grid(tag="div" name="list")
.list
	.item(v-for="(item, index) in myapps.apps"
		:key="item.id"
		v-motion
		:initial="{ y: 100, opacity: 0 }"
		:enter='{ y: 0, opacity: 1, transition: { delay: 100 + (100 * index) } }'
		@click='expand(item)'
		:class="calcClass(item)"
		) {{ item.label }}

	// template(#item="{ element }")
		.item {{ element.label }}

// .item(
	v-for="(item, index) in myapps.apps"
	:key="item.id"
	v-motion
	:initial="{ y: 100, opacity: 0 }"
	:enter='{ y: 0, opacity: 1, transition: { delay: 100 + (100 * index) } }'
	@click='expand(item)'
	:class="calcClass(item)")

	.hd(@click="remove(index)") {{ item.label }}
	.bl
		div(v-if='expanded')
			.desc Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, libero. Impedit, distinctio sed at optio exercitationem quos culpa? Atque vitae aspernatur possimus praesentium culpa id eum! Velit dolores eos aliquam?
			.desc Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, libero. Impedit, distinctio sed at optio exercitationem quos culpa? Atque vitae aspernatur possimus praesentium culpa id eum! Velit dolores eos aliquam?
		q-card-actions(v-if='expanded')
			RouterLink.link(@click.stop='' to='/assistent' data-flip-id='img') lkajslk
			q-space
			q-btn(flat color="primary" label="Отмена" @click="") 
			q-btn(unelevated color="primary" label="Настройки" @click.stop="") 

</template>

<style scoped lang="scss">
.btn {
	display: block;
	padding: 3px 15px;
	background: pink;
}

.link {
	display: block;
	background: pink;
	width: 124px;
	height: 124px;
}

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
		// position: fixed;
		height: 70vh;
		// width: 80%;
		width: 900px;
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
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}

.list {
	display: flex;
	gap: .5rem;
}
</style>
