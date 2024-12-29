<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { animations, insert } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useKeyModifier } from '@vueuse/core'
import AddButton from '@/components/common/AddButton.vue'

gsap.registerPlugin(Flip)

const shift = useKeyModifier('Shift')

const sortable = ref(true)

const toggle = (() => {
	sortable.value = !sortable.value
	updateConfig({ sortable: true })
})

const config = {
	plugins: [animations(),
		// insert({
		// 	insertPoint: (parent) => {
		// 		const div = document.createElement("div")
		// 		for (const cls of insertPointClasses) div.classList.add(cls)
		// 		return div
		// 	}
		// })
	],
	dragPlaceholderClass: 'custom',
	sortable: true
}

const [parent, tapes, updateConfig] = useDragAndDrop([
	{ id: 0, expand: false, label: "Depeche Mode", },
	{ id: 1, expand: false, label: "Duran Duran", },
	{ id: 2, expand: false, label: "Pet Shop Boys", },
	{ id: 3, expand: false, label: "Kraftwerk", },
	{ id: 4, expand: false, label: "Tears for Fears", },
	{ id: 5, expand: false, label: "Spandau Ballet", },
],
	config)

const expanded = ref<boolean>(false)

const calcClass = ((item: any) => {
	if (expanded.value && item.expand) return 'active'
	if (expanded.value && !item.expand) return 'inactive'
	else return ''

})


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

const sort = ref(false)
</script>

<template lang="pug">
q-page(padding)
	.all
		.pa(ref='parent')
			.chil(v-for=" (item, index) in tapes" :key="item.id"
				v-motion
				:initial="{ y: 40, opacity: 0 }"
				:enter='{ y: 0, opacity: 1, transition: { delay: 400 + 100 * index } }'
				@click='expand(item)'
				:class="calcClass(item)"
				)
				.con {{ item.label }}
		.row.items-center.justify-between
			q-toggle.q-mt-md(v-if='!expanded'
				v-motion
				:initial="{ opacity: 0 }"
				:enter='{ opacity: 1, transition: { delay: 800 } }'
				v-model="sort" label="Группировка")
			AddButton(v-if='!expanded' @create='create' mode="app")

	// .backdrop(v-if='expanded')
</template>

<style scoped lang="scss">
.all {
	margin: 0 auto;
	width: 728px;
}

.pa {
	display: grid;
	grid-template-columns: repeat(4, 170px);
	column-gap: 1rem;
	align-items: center;
	row-gap: 1rem;
	margin: 0 auto;
	width: 728px;
}

.chil {
	width: 170px;
	height: 170px;
	background: #fff;
	cursor: pointer;
	padding: 1rem;
	position: relative;
	border-radius: var(--rad);
	// margin: .5rem;

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

	&.inactive {
		display: none;
	}
}

.custom {
	background: hsl(213 38% 81% / 1);

	.con {
		display: none;
	}

}

.backdrop {
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 100, 200, 0.1);
	backdrop-filter: blur(2px);
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}
</style>
