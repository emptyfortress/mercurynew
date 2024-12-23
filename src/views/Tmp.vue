<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import AddButton from '@/components/common/AddButton.vue'

gsap.registerPlugin(Flip)

const expand = (item: any) => {
	console.log(item)
	const state = Flip.getState('.it, .dialog')
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: .4,
			absolute: true,
			ease: "elastic.out(0.6, .8)",
		})
	})
}


const arr = ref([
	{ id: 0, expand: false, group: 1 },
	{ id: 1, expand: false, group: 2 },
	{ id: 2, expand: false, group: 1 },
])

const calcClass = ((item: any) => {
	if (item.expand && item.group == 1) return 'active'
	if (item.expand && item.group > 1) return 'active'
	if (!item.expand && item.group > 1) return 'group'
	if (!item.expand && item.group == 1) return ''

})

const dragging = ref(false)
const onDrop = (dropResult: number) => {
	arr.value = applyDrag(arr.value, dropResult)
	dragging.value = false
}
</script>

<template lang="pug">
q-page(padding)
	Container(@drop="onDrop"
		orientation='horizontal'
		group-name='column'
		:remove-on-drop-out='true'
		:tag="{ value: 'div', props: { class: 'list' } }")

		Draggable(v-for="item in arr" :key='item.id' )
			.it(@click="expand(item)"
			:class="calcClass(item)"
			:data-flip-id='item.id') {{ item.id }}

			.backdrop(v-if='item.expand'
				data-flip-id='fuck'
				v-motion
				:initial="{ opacity: 0 }"
				:enter='{ opacity: 1, }'
				:duration='100'
				)
			.dialog(:class='{ active: item.expand }' :data-flip-id='item.id' @click='expand(item)')

		// AddButton(@create='' mode='app' v-if="!expanded")
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
	}

	&.group {
		background: #ccc;
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
