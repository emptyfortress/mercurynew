<script setup lang="ts">
import { ref } from 'vue'
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import IconBlock from '@/components/icons/IconBlock.vue'
import AddFormButton from '@/components/common/AddFormButton.vue'
import { state } from "@formkit/drag-and-drop"

const elements = [
	{
		id: 0,
		label: 'Автор',
		caption: 'Автор документа',
		selected: false,
	},
	{
		id: 1,
		label: 'Дата создания',
		caption: 'Когда создан документ',
		selected: false,
	},
	{
		id: 2,
		label: 'Статус',
		caption: 'Текущее состояние документа',
		selected: false,
	},
]

const [lib, libitems] = useDragAndDrop(elements, {
	group: "one",
	sortable: false,
	dragPlaceholderClass: 'custom',
})

state.on("dragEnded", (event: any) => {
	elements.push(event.draggedNode.data.value)
})

const dragStart = ((event: DragEvent, item: any) => {
	event.dataTransfer?.setData('text/plain', JSON.stringify(item))
	// console.log(item)
})
</script>

<template lang="pug">
q-list(bordered separator ref="lib")
	q-item(v-for="item in libitems" :key="item.id" @dragstart="dragStart($event, item)")
		q-item-section(avatar)
			.big
				IconBlock
		q-item-section
			q-item-label.text-bold {{ item.label }}
			q-item-label.grey(caption) {{ item.caption }}

br
AddFormButton(@create='')
</template>

<style scoped lang="scss">
.q-list {
	text-align: left;
	margin: 0 1rem;
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
	font-size: 1.4rem;
}

.grey {
	color: #aaa;
}

.custom {
	background: hsl(213 38% 81% / 1);

	.con,
	.img {
		display: none;
	}

}
</style>
