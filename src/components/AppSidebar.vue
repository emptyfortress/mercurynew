<script setup lang="ts">
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'
import { useApps } from '@/stores/apps'

const myapps = useApps()

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
</script>

<template lang="pug">
div(ref='parent')
	.it(
		v-for="item in tapes",
		:key='item.id'
	) {{ item.id }}
</template>

<style scoped lang="scss">
.it {
	background: #fff;
	padding: 1rem;
	margin-bottom: 0.5rem;
	height: 80px;
}
</style>
