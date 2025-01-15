<script setup lang="ts">
import { ref, reactive } from 'vue'
import { state } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { insert } from "@formkit/drag-and-drop"
import IconLayout1 from '@/components/icons/IconLayout1.vue'
import Resizable from '@/components/Resizable.vue'
import { useElementSize } from '@vueuse/core'
import { useControl } from '@/stores/controls'

const control = useControl()

const config = {
	sortable: true,
	group: 'one',
	dragHandle: '.move',
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


const [doneList, dones] = useDragAndDrop(control.editorControls, config)

state.on("dragEnded", (event: any) => {
	console.log(event.draggedNode.data.value)
	// const itemData = JSON.parse(event.dataTransfer?.getData('text/plain'))
	// console.log(itemData)
})

const edit = ref()
const { width } = useElementSize(edit)

const select = ((item: any) => {
	control.select(item)
})
</script>

<template lang="pug">
.edit(ref="edit")

	.list(ref="doneList")
		Resizable(v-for="(item, index) in dones" :key='item.id'  :item='item' :wid="width"  @select='select(item)')
			div {{ item.id }}
</template>

<style scoped lang="scss">
.edit {
	padding: 1rem;
}

.test {
	padding: 1rem;
	background: #ccc;
	width: 200px;
	height: 100px;
}


.list {
	display: flex;
	gap: .5rem;
	flex-wrap: wrap;
	margin: 0;
	padding: 0;

}
</style>
