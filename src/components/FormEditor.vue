<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import Resizable from '@/components/Resizable.vue'
import { useElementSize } from '@vueuse/core'
import { useControl } from '@/stores/controls'
import { useChangesStore } from '@/stores/changes'
import DropZone from '@/components/DropZone.vue'
import { storeToRefs } from 'pinia'
import { state } from '@formkit/drag-and-drop'

const control = useControl()
const changesStore = useChangesStore()
const { editorControls } = storeToRefs(control)

const config = {
	sortable: true,
	group: 'one',
	dragHandle: '.move',
	dragPlaceholderClass: 'ghost',
	draggable: (el: any) => el.id !== 'no-drag',
}

const [doneList, dones] = useDragAndDrop(editorControls.value, config)

watch(
	dones,
	() => {
		setTimeout(() => {
			changesStore.setHasChanges(true)
		}, 1000)
	},
	{ deep: true }
)

const edit = ref()
const { width } = useElementSize(edit)

const select = (item: Control) => {
	control.select(item)
}
const remove = (ind: number) => {
	dones.value.splice(ind, 1)
	editorControls.value.splice(ind, 1)
}

state.on('dragEnded', () => {
	editorControls.value = [...dones.value]
})

watch(
	() => control.clean,
	() => {
		dones.value.length = 0
	}
)
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
				label {{ item.label }}

		DropZone(v-else id="no-drag")
</template>

<style scoped lang="scss">
.edit {
	padding: 1rem;
}

.list {
	display: flex;
	align-content: flex-start;
	justify-content: flex-start;
	gap: 0.5rem;
	flex-wrap: wrap;
	margin: 0.5rem 2rem;
	padding: 2rem;
	background: #fff;
	border-radius: 0.5rem;
	box-shadow: var(--shad);
	min-height: 500px;
}

.ghost {
	background: hsl(213 38% 80% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	.handle,
	.digit,
	.icon {
		display: none;
	}

	label {
		visibility: hidden;
	}
}
</style>
