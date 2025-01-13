<script setup lang="ts">
import { state } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { insert } from "@formkit/drag-and-drop"
import IconLayout1 from '@/components/icons/IconLayout1.vue'

const doneItems = [
	{
		id: 4,
		label: 'Control 0',
		icon: IconLayout1
	},
]

const config = {
	sortable: true,
	group: 'one',
	plugins: [
		insert({
			insertPoint: (parent) => {
				const div = document.createElement("div")
				div.classList.add('fuck')
				return div
			}
		})
	]
}

const [doneList, dones] = useDragAndDrop(doneItems, config)

state.on("dragEnded", (event: any) => {
	console.log(event.draggedNode.data.value)
	// const itemData = JSON.parse(event.dataTransfer?.getData('text/plain'))
	// console.log(itemData)
})
</script>

<template lang="pug">
.edit
	// q-list(ref="doneList" bordered separator)
	// 	q-item(v-for="done in dones" :key="done.id")
	// 		q-item-section {{ done.label }}


	ul(ref="doneList" bordered separator)
		li(v-for="done in dones" :key="done.id") {{ done.label }}
</template>

<style scoped lang="scss">
.edit {
	padding: 1rem;
}

.q-item {
	cursor: all-scroll;
	color: $secondary;

	&:hover {
		color: $primary;
		background: #efefef;
	}
}

.grd {
	display: grid;
	grid-template-columns: repeat(3, 200px);

	// justify-items: start;
	// align-items: stretch;
	// column-gap: 1rem;
	// row-gap: .5rem;
	div {
		width: 200px;
		height: 50px;
		background: #eee;
	}
}

ul {
	display: flex;
	list-style: none;
	gap: 1rem;
	flex-wrap: wrap;

	li {
		height: 100px;
		width: 200px;
		background: #eee;
	}
}
</style>
