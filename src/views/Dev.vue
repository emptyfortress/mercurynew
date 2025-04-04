<script setup lang="ts">
import { motion } from 'motion-v'
import { useRouter } from 'vue-router'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations, state } from '@formkit/drag-and-drop'
import { useList } from '@/stores/list'

const list = useList()

const Div = motion.div

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('item1')
	},
}
const [parent, tapes] = useDragAndDrop(list.lists, config)
</script>

<template lang="pug">
q-page(padding)
	.header Папки
	.pa(ref='parent')
		.item1(v-for="(item, index) in tapes" :key="item.id")
			span {{ item.label }}

</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
}
.pa {
	display: grid;
	grid-template-columns: repeat(5, 150px);
	column-gap: 1rem;
	align-items: center;
	row-gap: 1rem;
	margin: 0 auto;
	width: 728px;
	border: none;
	outline: none;
}
.item1 {
	width: 150px;
	height: 150px;
	border-radius: 0.5rem;
	text-align: center;
	margin: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	position: relative;
	background: #fff;
	border: 1px solid #fff;

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
}
.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
	}
}
</style>
