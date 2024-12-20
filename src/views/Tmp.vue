<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

// const expand = () => {
// 	console.log(111)
// 	const state = Flip.getState('.it, .ani')
// 	expanded.value = !expanded.value
// 	nextTick(() => {
// 		Flip.from(state, {
// 			duration: .6,
// 			targets: '.it, .ani',
// 			absolute: true,
// 			absoluteOnLeave: true,
// 			ease: "elastic.out(.5, 0.9)",
// 		})
// 	})
// }
const expanded = ref(false)
const expanded1 = ref(false)

const calcClass = (item: any) => {
	if (expanded1.value == true && item.expand == true) return 'act'
	// if (expanded1.value == true && item.expand == false) return 'inact'
	else return ''
}

const expand = (item: any) => {
	console.log(item)
	const state = Flip.getState('.it, .dialog')
	item.expand = !item.expand
	// expanded.value = !expanded.value
	nextTick(() => {
		Flip.from(state, {
			duration: .4,
			// targets: '.it, .dialog',
			absolute: true,
			// absoluteOnLeave: true,
			ease: "elastic.out(.8, 4)",
			// fade: true
		})
	})
}


const arr = ref([
	{ id: 0, expand: false },
	{ id: 1, expand: false },
	{ id: 2, expand: false },
])

// const calcId = ((item) => {
// 	return 'item' + item.id
// })
</script>

<template lang="pug">
q-page(padding)
	.list
		template(v-for="item in arr" :key='item.id' )
			.it(@click="expand(item)" :class="{ active: item.expand }" :data-flip-id='item.id') {{ item.id }}
			.backdrop(v-if='item.expand'
				data-flip-id='fuck'
				v-motion
				:initial="{ opacity: 0 }"
				:enter='{ opacity: 1, }'
				:duration='100'
				)
			.dialog(:class='{ active: item.expand }' :data-flip-id='item.id' @click='expand(item)')
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

	&.active {
		visibility: hidden;
		// display: none;
	}
}


.dialog {
	background: $secondary;
	position: fixed;
	height: 70vh;
	width: 900px;
	margin: 0 auto;
	left: 60px;
	right: 0;
	margin-top: 53px;
	border-radius: .5rem;
	// box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	display: none;
	z-index: 15;

	&.active {
		display: block;
	}
}



.zag {
	font-size: 1rem;
	text-align: center;

	.active & {
		font-size: 1.2rem;
		margin-top: 10px;
		margin-bottom: 1rem;
	}
}

.backdrop {
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0);
	backdrop-filter: blur(4px);
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 15;
}
</style>
