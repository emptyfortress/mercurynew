<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'

gsap.registerPlugin(Flip)

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
	{
		id: '3',
		label: 'Приложение 3',
		descr: 'Это описание',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.10.24 14:00',
		group: 1,
	},
])

const onDrop = (dropResult: number) => {
	arr.value = applyDrag(arr.value, dropResult)
}

</script>

<template lang="pug">
.groupreview.list()

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
				q-icon.img(name="mdi-application-braces-outline" color="secondary" size="lg")
				// AppPreview(:item='item' v-if='expanded1')
				// Trash(:dragging="dragging" :group='true')

</template>

<style scoped lang="scss">
.smooth-dnd-container.horizontal.list {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-items: start;
	align-items: center;
	transform: none;
}

.list {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-items: start;
	align-items: center;
}

.item+.item {
	margin-right: 1rem;
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
</style>
