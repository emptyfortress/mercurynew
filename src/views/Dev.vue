<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'
// import { useRouter } from 'vue-router'
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

const expanded = ref(true)
const action = () => {
	expanded.value = !expanded.value
}
</script>

<template lang="pug">
q-page(padding)
	.header Папки
	.pa(ref='parent'
		layout
		:class="['pa', expanded ? 'start' : 'end']"
	)
		Div.item(v-for="(item, index) in tapes" :key="item.id" @click='action'
			:data-state="expanded"
			layout
			:transition=`{
				type: 'spring',
				visualDuration: 0.2,
				bounce: 0.2
			}`
		)
			span {{ item.label }}

</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
}
.pa {
	display: grid;
	// grid-template-columns: repeat(5, 150px);
	gap: 1rem;
	align-items: center;
	margin: 0 auto;
	width: 728px;
	border: none;
	outline: none;
	&.start {
		grid-template-columns: repeat(5, 150px);
	}
	&.end {
		grid-template-columns: repeat(1, 50px);
		// grid-template-rows: repeat(5, 50px);
	}
}
.item {
	// width: 150px;
	// height: 150px;
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
