<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

const tapes = defineModel<App[]>('tapes')
gsap.registerPlugin(Flip)

const onDrop = (dropResult: number) => {
	tapes.value = applyDrag(tapes.value, dropResult)
}

const expanded = ref<boolean>(false)
const expand = (item: any) => {
	const state = Flip.getState('.item')
	expanded.value = !expanded.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			absolute: true,
			onEnter: (elements) =>
				gsap.fromTo(
					elements,
					{ opacity: 0 },
					{ opacity: 1, duration: 0.6, ease: 'linear', delay: 0.2 }
				),
			onLeave: (elements) =>
				gsap.fromTo(elements, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'linear' }),
		})
	})
}

const calcClass = (item: App) => {
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
	if (item.group == true) return 'group'
	else return ''
}
</script>

<template lang="pug">
Container(@drop="onDrop" orientation='horizontal' group-name='column')
	Draggable(v-for="(item, index) in tapes"
		:key="item.id")
		.item(
			v-motion
			:initial="{ y: 100, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 100 + (100 * index) } }'
			@click='expand(item)'
			:class="calcClass(item)"
			)
			div(v-if='item.group') Группа
			div(v-else) {{ item.label }}
</template>

<style scoped lang="scss">
.item {
	width: 200px;
	height: 200px;
	background: #fff;
	// border-radius: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	margin: 0.5rem;
	position: relative;

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.active {
		position: fixed;
		height: 70vh;
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
	&.group {
		box-shadow: 1px 1px 5px rgba($color: #000000, $alpha: 0.2);

		&:before {
			content: '';
			display: block;
			width: 200px;
			height: 200px;
			background: #fff;
			// border-radius: 0.5rem;
			position: absolute;
			top: 0px;
			left: 0px;
			transform: rotate(3deg);
			z-index: -2;
			box-shadow:
				2px 2px 3px rgba($color: #000000, $alpha: 0.2),
				-1px -1px 2px rgba($color: #000000, $alpha: 0.2);
		}
	}

	&.green {
		background: #a8d7a8;
	}
}
</style>
