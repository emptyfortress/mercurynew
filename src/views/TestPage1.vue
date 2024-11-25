<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import { useKeyModifier } from '@vueuse/core'
import { useApps } from '@/stores/apps'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

const myapps = useApps()
const tapes = ref([...myapps.apps])

const onDrop = (dropResult: number) => {
	console.log('fuck')
	tapes.value = applyDrag(tapes.value, dropResult)
}

const shift = useKeyModifier('Shift')

const type = computed(() => {
	return shift.value ? 1 : 0
})

const acceptDrop = () => {
	return !shift.value
}

const hoverItem = ref()
const draggingItem = ref()

const onDragEnter = (index: number) => {
	hoverItem.value = index
}
const onDragLeave = () => {
	hoverItem.value = null
}

const calcOver = (index: number) => {
	if (hoverItem.value == index && index !== draggingItem.value) return 'green'
	return ''
}

const onDragStart = (n: number) => {
	draggingItem.value = n
}

const onDrop1 = () => {
	let item = tapes.value[hoverItem.value]
	item.group = true
	// console.log(item)

	onDragLeave()
	tapes.value.splice(draggingItem.value, 1)
	draggingItem.value = null
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

const calcClass = (item: any) => {
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
	else return ''
}
</script>

<template lang="pug">
q-page(padding)

	ul
		Container(v-if='type == 0' @drop="onDrop" orientation='horizontal' :should-accept-drop='acceptDrop' group-name='column')
			Draggable(v-for="(item, index) in tapes"
				:key="item.id")
				.item.group(
					v-motion
					:initial="{ y: 100, opacity: 0 }"
					:enter='{ y: 0, opacity: 1, transition: { delay: 100 + (100 * index) } }'
					@click='expand(item)'
					:class="calcClass(item)"
					) {{ item.id }}

		.item(v-if='type == 1' v-for="(item, index) in tapes"
			:key="item.id"
			:draggable='true'
			@dragstart='onDragStart(index)'
			@dragover.prevent="onDragEnter(index)"
			@dragenter.prevent
			@dragleave="onDragLeave"
			@drop='onDrop1'
			:class='calcOver(index)'
			) {{ item.id }} jj

</template>

<style scoped lang="scss">
q-page {
	// position: relative;
}

ul {
	display: flex;
	flex-wrap: wrap;
}

.target {
	position: fixed;
	left: 50%;
	bottom: 1rem;
	width: 200px;
	height: 100px;
	background: #ccc;
	border: 2px dashed black;
}

.fuck {
	width: 200px;
	height: 200px;
	background: #fff;
	margin: 0.5rem;
	position: relative;

	&.group {
		box-shadow:
			2px 2px 3px rgba($color: #000000, $alpha: 0.2),
			-1px -1px 2px rgba($color: #000000, $alpha: 0.2);

		&:before {
			content: '';
			display: block;
			width: 200px;
			height: 200px;
			background: #fff;
			position: absolute;
			top: 0px;
			left: 0px;
			z-index: -2;
			transform: rotate(5deg);
			box-shadow: 1px 1px 5px rgba($color: #000000, $alpha: 0.2);
		}
	}

	&.green {
		background: #a8d7a8;
	}
}

.link {
	position: absolute;
	bottom: 2rem;
	right: 2rem;
	background: #fff;
	background: pink;
	width: 124px;
	height: 124px;
}

.item {
	width: 200px;
	height: 200px;
	background: #fff;
	// border-radius: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	margin: 0.5rem;

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
		// box-shadow:
		// 2px 2px 3px rgba($color: #000000, $alpha: 0.2),
		// -1px -1px 2px rgba($color: #000000, $alpha: 0.2);

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
			z-index: -2;
			transform: rotate(5deg);
			box-shadow: 1px 1px 5px rgba($color: #000000, $alpha: 0.2);
		}
	}

	&.green {
		background: #a8d7a8;
	}
}
</style>
