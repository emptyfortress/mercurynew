<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import IconLayout1 from '@/components/icons/IconLayout1.vue'

const doneItems = [
	{
		id: 4,
		label: 'Control 0',
		icon: IconLayout1
	},
]

const [doneList, dones] = useDragAndDrop(doneItems, { group: "controls" })

</script>

<template lang="pug">
.edit
	q-list(ref="doneList" bordered separator)
		q-item(v-for="done in dones" :key="done.id")
			q-item-section {{ done.label }}

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
</style>
