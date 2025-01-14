<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { state } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { insert } from "@formkit/drag-and-drop"
import IconLayout1 from '@/components/icons/IconLayout1.vue'
import Resizable from '@/components/Resizable.vue'

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

const edit = ref()
onMounted(() => {

})
</script>

<template lang="pug">
.edit(ref="edit")
	// q-list(ref="doneList" bordered separator)
	// 	q-item(v-for="done in dones" :key="done.id")
	// 		q-item-section {{ done.label }}


	// ul(ref="doneList" bordered separator)
	// 	li(v-for="done in dones" :key="done.id") {{ done.label }}

	// .resizable(ref='resizable')
	// 	.handle
	Resizable
</template>

<style scoped lang="scss">
.edit {
	padding: 1rem;
	// background: #ccc;
}

.q-item {
	// margin-bottom: .5rem;
}

ul {
	display: flex;
	display: flex;
	display: flex;
	display: flex;
	display: flex;
	// flex-direction: column;: column;: column;: column;
	list-style: none;
	gap: .5rem;
	// flex-wrap: wrap;
	margin: 0;
	padding: 0;

	li {
		padding: 1rem;
		// height: 100px;
		// width: 200px;
		background: #eee;
		margin-bottom: .5rem;
		resize: horizontal;
		overflow: auto;
	}
}
</style>
