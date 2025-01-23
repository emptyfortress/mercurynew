<script setup lang="ts">
import { ref, watch, nextTick, } from 'vue'
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { animations } from "@formkit/drag-and-drop"
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

const props = defineProps<{
	list: App[]
}>()

const mylist = ref(props.list)

gsap.registerPlugin(Flip)

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
}
const [parent, tapes, updateConfig] = useDragAndDrop(mylist.value, config)

const expanded = ref<boolean>(false)
const actionExpand = ((item: App) => {
	const state = Flip.getState('.chil')
	item.expand = !item.expand
	expanded.value = !expanded.value
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.chil',

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
})

const calcClass = ((item: any, index: number) => {
	if (expanded.value && item.expand) return 'active'
	if (expanded.value && !item.expand) return 'inactive'
	else return ''

})
</script>

<template lang="pug">
.par(ref='parent')
	.chil(v-for="(item, index) in tapes"
		:key="item.id" :id="item.id"
		@click.stop='actionExpand(item)'
		:class="calcClass(item, index)"
		)
		.con {{ item.label }}
			.img
				component(:is='item.pic')
</template>

<style scoped lang="scss">
.par {
	display: flex;
	gap: 1rem;
	justify-content: start;
}

.chil {
	width: 170px;
	height: 170px;
	background: #fff;
	cursor: pointer;
	padding: 1rem;
	position: relative;
	border-radius: var(--rad);
	border: 1px solid $secondary;

	&.active {
		position: fixed;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		top: -40px;
		left: -2px;
		right: 0;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
		z-index: 10;
	}

	&.inactive {
		display: none;
	}

	&:hover {
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	.con,
	.img,
	.img1 {
		display: none;
	}

}

.img {
	position: absolute;
	bottom: 0;
	left: 0.5rem;
	font-size: 3rem;
	line-height: 1;
	color: hsl(199 23% 45% / 1);
}
</style>
