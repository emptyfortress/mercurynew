<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'


const props = defineProps({
	expanded: {
		type: Boolean,
		required: true,
		default: false
	}
})

gsap.registerPlugin(Flip)

const expanded1 = ref(false)

const calcClass = (item: any) => {
	if (expanded1.value == true && item.expand == true) return 'act'
	if (expanded1.value == true && item.expand == false) return 'inact'
	else return ''
}

const arr = [
	{ id: 0, expand: false },
	{ id: 1, expand: false },
	{ id: 2, expand: false },
]

const expand1 = (item: any) => {
	const state = Flip.getState('.child')
	expanded1.value = !expanded1.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: .4,
			targets: '.child',
			absolute: true,
			absoluteOnLeave: true,
			ease: "elastic.out(.8, 1)",
		})
		console.log(333)
	})
}
</script>

<template lang="pug">
.item(v-if='props.expanded'
	v-for="(item, index) in arr"
	v-motion
	:initial="{ x: -1000 }"
	:enter="{ x: 0, transition: { stiffness: 90, damping: 12, delay: 300 + 100 * index } }"
	)

// div(v-if='props.expanded')
// 	.zag Группа
// 	.some()
// 		.child(
// 			v-for="(el, index) in arr" :key='el.id'
// 			@click.stop="expand1(el)"
// 			:class="calcClass(el)"
// 			v-motion
// 			:initial="{ scale: .3, opacity: 0 }"
// 			:enter="{ scale: 1, opacity: 1, transition: { delay: 200 + 100 * index } }"
// 			)
</template>

<style scoped lang="scss">
.some {
	display: flex;
	justify-content: center;
	gap: 1rem;
}

.child {
	width: 150px;
	height: 150px;
	background: #fff;

	&.act {
		position: fixed;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		left: 60px;
		right: 0;
		// margin-top: 53px;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);

	}

	&.inact {
		display: none;
	}

}

.zag {
	font-size: 1rem;
	text-align: center;

	.groupactive & {
		font-size: 1.2rem;
		margin-top: 10px;
		// margin-bottom: 1rem;
	}
}
</style>
