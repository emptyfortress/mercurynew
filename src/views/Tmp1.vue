<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { animations, insert } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

const [parent, tapes] = useDragAndDrop([
	{ id: 0, expand: false, label: "Depeche Mode", },
	{ id: 1, expand: false, label: "Duran Duran", },
	{ id: 2, expand: false, label: "Pet Shop Boys", },
	{ id: 3, expand: false, label: "Kraftwerk", },
	{ id: 4, expand: false, label: "Tears for Fears", },
	{ id: 5, expand: false, label: "Spandau Ballet", },
],
	{
		plugins: [animations(),
			// insert({
			// 	insertPoint: (parent) => {
			// 		const div = document.createElement("div")
			// 		for (const cls of insertPointClasses) div.classList.add(cls)
			// 		return div
			// 	}
			// })
		],
		dragPlaceholderClass: 'custom'
	},
)

const calcClass = ((item: any) => {
	return item.expand ? 'active' : ''

})

const expanded = ref<boolean>(false)
const expand = ((item: any) => {
	const state = Flip.getState('.chil')
	item.expand = !item.expand
	expanded.value = !expanded.value
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.chil',
			// absolute: true,
			// absoluteOnLeave: true,
			// nested: true,
			// fade: true,

		})
	})
})

</script>

<template lang="pug">
q-page(padding)
	.pa(ref="parent")
		.chil(v-for=" (item, index) in tapes" :key="item.id"
			v-motion
			:initial="{ scale: 0, opacity: 0 }"
			:enter='{ scale: 1, opacity: 1, transition: { delay: 300 + 100 * index } }'
			@click='expand(item)'
			:class="calcClass(item)"
			)
			.con {{ item.label }}

	.backdrop(v-if='expanded'
		v-motion
		:initial="{ opacity: 0 }"
		:enter='{ opacity: 1, transition: { delay: 400 } }'
		)
</template>

<style scoped lang="scss">
.pa {
	display: grid;
	grid-template-columns: repeat(3, 150px);
	column-gap: 1rem;
	row-gap: 1rem;
	margin: 0 auto;
	width: 482px;
}

.chil {
	height: 100px;
	background: #fff;
	padding: 1rem;

	&.active {
		position: fixed;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		top: 150px;
		left: 0;
		right: 0;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
		z-index: 10;
	}
}

.custom {
	background: hsl(213 38% 81% / 1);

	.con {
		display: none;
	}

}

.dialog {
	position: fixed;
	height: 70vh;
	width: 900px;
	margin: 0 auto;
	top: 150px;
	left: 0;
	right: 0;
	border: 1px solid #ccc;
	box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	background: #fff;
	display: none;

	&.active {
		display: block;
	}
}

.backdrop {
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(2px);
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}
</style>
