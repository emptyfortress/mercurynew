<script setup lang="ts">
import { ref } from 'vue'
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import IconBlock from '@/components/icons/IconBlock.vue'
import AddFormButton from '@/components/common/AddFormButton.vue'
import { state } from "@formkit/drag-and-drop"
import { Kind } from '@/types/enum'



const elements = ref([
	{
		id: 0,
		label: 'Автор',
		caption: 'Автор документа',
		selected: false,
		type: Kind.Man,
	},
	{
		id: 1,
		label: 'Дата создания',
		caption: 'Когда создан документ',
		selected: false,
		type: Kind.Date,
	},
	{
		id: 2,
		label: 'Строка',
		caption: 'Пример контрола строки',
		selected: false,
		type: Kind.String,
	},
	{
		id: 3,
		label: 'Текст',
		caption: 'Пример длинного текста',
		selected: false,
		type: Kind.Text,
	},
])

const [lib, libitems] = useDragAndDrop(elements.value, { sortable: false, group: 'one' })

const tmp = ref<Control[]>([])

state.on('dragStarted', () => {
	tmp.value = [...libitems.value]
})

state.on("dragEnded", () => {
	libitems.value = tmp.value
})

const create = ((e: Control) => {
	libitems.value.push(e)
})


</script>

<template lang="pug">
q-list(bordered separator ref="lib")
	q-item(v-for="item in libitems" :key="item.id")
		q-item-section(avatar)
			.big
				IconBlock
		q-item-section
			q-item-label.text-bold {{ item.label }}
			q-item-label.grey(caption) {{ item.caption }}

br
AddFormButton(@create='create')
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
