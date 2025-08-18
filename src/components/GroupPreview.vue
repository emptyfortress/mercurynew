<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import Trash from '@/components/common/Trash.vue'
import AppPreview from '@/components/AppPreview.vue'
import IconMicrophone from '@/components/icons/IconMicrophone.vue'
import IconPresentation from '@/components/icons/IconPresentation.vue'
// import AddButton from '@/components/common/AddButton.vue'

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
		label: 'Подготовка публикации',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: 1755513353568,
		published: 0,
		group: 1,
		pic: IconPresentation,
		list: [],
		master: false,
		versions: [
			{
				id: 0,
				label: 'Базовая версия',
				value: 'Базовая версия',
				descr: 'Стартовая версия приложения',
				author: 'Орлов П.С.',
				created: 1755513353568,
				modified: null,
				published: 0,
				current: true,
			},
		],
	},
	{
		id: '1',
		label: 'Партнерский форум',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: 1755513353568,
		published: 0,
		group: 1,
		pic: IconMicrophone,
		list: [],
		master: false,
		versions: [
			{
				id: 0,
				label: 'Базовая версия',
				value: 'Базовая версия',
				descr: 'Стартовая версия приложения',
				author: 'Орлов П.С.',
				created: 1755513353568,
				modified: null,
				published: 0,
				current: true,
			},
		],
	},
])

const dragging = ref(false)

const onDragLeave = () => {
	dragging.value = true
}
const onDragEnter = () => {
	dragging.value = false
}
const onDrop = (dropResult: number) => {
	arr.value = applyDrag(arr.value, dropResult)
	dragging.value = false
}

const expand1 = (item: any) => {
	const state = Flip.getState('.item')
	expanded1.value = !expanded1.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			// targets: '.item',
			absolute: true,
			// absoluteOnLeave: true,
			// nested: true,

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
.groupreview()
	Container(@drop="onDrop"
		@drag-leave='onDragLeave'
		@drag-enter='onDragEnter'
		orientation='horizontal'
		group-name='column'
		:remove-on-drop-out='true'
		:tag="{ value: 'div', props: { class: 'list' } }")


		Draggable(v-for="(item, index) in arr" :key="item.id")
			.item(
				@click.stop='expand1(item)'
				:class="calcClass(item)"
				)
				.hg {{ item.label }}
				.img
					component(:is='item.pic')
				AppPreview(:item='item' v-if='expanded1')

	Trash(:dragging="dragging" :group='true')
</template>

<style scoped lang="scss">
.smooth-dnd-container.horizontal.list {
	display: flex;
	flex-wrap: wrap;
	justify-items: start;
	align-items: center;
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

.myicon {
	position: absolute;
	bottom: 0;
	left: 0.5rem;
}
</style>
