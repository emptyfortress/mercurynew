<script setup lang="ts">
import { ref, } from 'vue'
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { insert } from "@formkit/drag-and-drop"
import Resizable from '@/components/Resizable.vue'
import { useElementSize } from '@vueuse/core'
import { useControl } from '@/stores/controls'
import DropZone from '@/components/DropZone.vue'

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

const edit = ref()
const { width } = useElementSize(edit)

const select = ((item: any) => {
	control.select(item)
})
const remove = ((ind: number) => {
	dones.value.splice(ind, 1)
	control.removeControl(ind)
})
</script>

<template lang="pug">
.edit(ref="edit")

	.list(ref="doneList" )
		template(v-if='dones.length > 0')
			Resizable(v-for="(item, index) in dones"
				:key='item.id'
				:item='item'
				:wid="width"
				@select='select(item)'
				@remove='remove(index)'
				)
				div {{ item.label }}
		DropZone(v-else)
</template>

<style scoped lang="scss">
.edit {
	padding: 1rem;
}

.list {
	display: flex;
	align-content: flex-start;
	justify-content: flex-start;
	gap: .5rem;
	flex-wrap: wrap;
	margin: .5rem 2rem;
	padding: 2rem;
	background: #fff;
	border-radius: .5rem;
	box-shadow: var(--shad);
	min-height: 500px;

}
</style>
