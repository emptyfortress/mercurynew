<script setup lang="ts">
import { animations } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"

const statuses = [
	{
		id: 'start',
		label: 'Подготовка'
	},
	{
		id: 'strt',
		label: 'Подготовка'
	}
]

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (el: any) => {
		return el.id !== 'no-drag'
	},
}
const [parent, tapes] = useDragAndDrop(statuses, config)
</script>

<template lang="pug">
.full
	.text-center Статусы
	.pa(ref='parent')
		div(v-if='tapes.length == 0' id="no-drag"
			v-motion
			:initial="{ y: 40, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 400 } }'
			)
			div Статусы не заданы

		.stat(v-else
			v-for="(item, index) in tapes" :key="item.id"
			v-motion
			:initial="{ y: 40, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 400 + 100 * index } }'
			)
			.hg {{ item.label }}
</template>

<style scoped lang="scss">
.pa {
	margin-top: 1rem;
}

.stat {
	border-radius: .25rem;
	text-align: left;
	cursor: pointer;
	padding: .5rem 1rem;
	background: #fff;
	width: 100%;
	margin-bottom: 1px;
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;
	height: 36px;

	* {
		display: none;
	}

}
</style>
