<script setup lang="ts">
import { watch } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useKeys } from '@/stores/keys'
import { useChangesStore } from '@/stores/changes'

const mykeys = useKeys()
const changesStore = useChangesStore()

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	onSort: (event: any) => {
		mykeys.updateCols(event.values)
	},
}

const [parent, tapes] = useDragAndDrop(mykeys.columns, config)

watch(
	tapes,
	() => {
		changesStore.setHasChanges(true)
	},
	{ deep: true }
)
</script>

<template lang="pug">
q-list.pa(ref='parent' dense)
	q-item(v-for="item in tapes" :key='item.id')
		q-item-section(side)
			.row.items-center
				q-icon.q-mr-sm(name="mdi-drag-vertical" size='18px')
				q-checkbox(v-model="item.active" dense size='sm')
		q-item-section()
			q-item-label {{ item.label }}
</template>

<style scoped lang="scss">
.pa .q-item {
	background: #fff;
	cursor: move;
	text-align: left;
	padding-left: 0.5rem;
}

.ghost {
	background: hsl(213 14% 90% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
	}
}
</style>
