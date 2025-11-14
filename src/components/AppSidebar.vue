<script setup lang="ts">
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'
import { useApps } from '@/stores/apps'
import { useRouter, useRoute } from 'vue-router'

const myapps = useApps()
const router = useRouter()
const route = useRoute()

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
	accept: (draggedElement: HTMLElement) => {
		return !draggedElement.classList.contains('group')
	},
	onSort: (event: any) => myapps.updateApps(event.values),
}

const [parent, tapes] = useDragAndDrop(myapps.apps, config)

const go = (id: string) => {
	router.push(`/${id}`)
}
</script>

<template lang="pug">
div(ref='parent')
	.it(
		v-for="item in tapes",
		:key='item.id',
		@click="go(item.id)",
		:class="{ selected: item.id === route.params.id }"
	) {{ item.id }}
</template>

<style scoped lang="scss">
.it {
	background: #fff;
	padding: 1rem;
	margin-bottom: 0.5rem;
	height: 80px;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&.selected {
		position: relative;
		transition: transform 0.2s ease;
		&::before {
			content: '';
			position: absolute;
			top: -4px;
			left: -8px;
			width: 110%;
			height: 110%;
			background: red;
			z-index: -1;
		}
	}
}
</style>
