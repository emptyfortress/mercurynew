<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import Trash from '@/components/common/Trash.vue'
import AppPreview from '@/components/AppPreview.vue'
// import { useMotions } from '@vueuse/motion'

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

const arr = ref([
	{
		id: '0',
		label: 'Приложение 0',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		group: 1,
	},
	{
		id: '1',
		label: 'Приложение 1',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		group: 1,
	},
	{
		id: '2',
		label: 'Приложение 2',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		group: 2,
	},
])

const dragging = ref(false)

const onDragLeave = (() => {
	dragging.value = true
})
const onDragEnter = (() => {
	dragging.value = false
})
const onDrop = (dropResult: number) => {
	arr.value = applyDrag(arr.value, dropResult)
	dragging.value = false
}

const expand1 = (item: any) => {
	const state = Flip.getState('.item, .ani')
	expanded1.value = !expanded1.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: .4,
			ease: 'power3.inOut',
			targets: '.item, .ani',
			absolute: true,
			absoluteOnLeave: true,
			nested: true,

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
</script>

<template lang="pug">
Container(@drop="onDrop"
	@drag-leave='onDragLeave'
	@drag-enter='onDragEnter'
	orientation='horizontal'
	group-name='column'
	:remove-on-drop-out='true'
	:tag="{ value: 'div', props: { class: 'list' } }")

	Draggable(v-for="(item, index) in arr" :key="item.id")
		.item(v-if='props.expanded'
			v-motion
			:initial="{ x: -1000 }"
			:enter="{ x: 0, transition: { stiffness: 90, damping: 12, delay: 300 + 100 * index } }"
			:leave='{ x: -1000, transition: { stiffness: 90, damping: 12, delay: 300 + 100 * index } }'
			@click='expand1(item)'
			:class="calcClass(item)"
			)
			div {{ item.id }}

			AppPreview(:item='item' v-if='expanded1')

	Trash(:dragging="dragging")
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

.item {
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

.list {
	// background: pink;
}
</style>
