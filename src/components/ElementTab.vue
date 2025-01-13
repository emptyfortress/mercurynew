<script setup lang="ts">
import { ref } from 'vue'
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
// import IconLayout from '@/components/icons/IconLayout.vue'
import IconLayout1 from '@/components/icons/IconLayout1.vue'
import IconLayout2 from '@/components/icons/IconLayout2.vue'
import IconLayout3 from '@/components/icons/IconLayout3.vue'
import IconLayout4 from '@/components/icons/IconLayout4.vue'
import IconLayout5 from '@/components/icons/IconLayout5.vue'
import IconLayout6 from '@/components/icons/IconLayout6.vue'

const elements = [
	{
		id: 0,
		label: 'Control 1',
		icon: IconLayout1
	},
	{
		id: 5,
		label: 'Control 2',
		icon: IconLayout6
	},
	{
		id: 1,
		label: 'Control 3',
		icon: IconLayout2
	},
	{
		id: 2,
		label: 'Control 4',
		icon: IconLayout3
	},
	{
		id: 3,
		label: 'Control 3',
		icon: IconLayout4
	},
]

const [lib, libitems] = useDragAndDrop(elements, {
	group: "one",
	sortable: false
})

const dragStart = ((event: DragEvent, item: any) => {
	event.dataTransfer?.setData('text/plain', JSON.stringify(item))
	// console.log(item)
})
</script>

<template lang="pug">
q-list(bordered separator ref="lib")
	q-item(v-for="item in libitems" :key="item.id" @dragstart="dragStart($event, item)")
		q-item-section {{ item.label }}
</template>

<style scoped lang="scss">
.q-list {
	text-align: left;
}

.q-item {
	cursor: all-scroll;
	color: $secondary;

	&:hover {
		color: $primary;
		background: #efefef;
	}

}

.big {
	font-size: 3rem;
}
</style>
