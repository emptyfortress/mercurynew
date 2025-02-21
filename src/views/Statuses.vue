<script setup lang="ts">
import { ref } from 'vue'
import FieldList from '@/components/FieldList.vue'
import StatusList from '@/components/StatusList.vue'
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { animations } from "@formkit/drag-and-drop"

interface Chip {
	id: string
	label: string
	caption: string
	type: string
}

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	group: 'digest',
	draggable: (el: any) => {
		return el.id !== 'nodrag'
	},
}

const list = [] as Chip[]


const [digest, chips] = useDragAndDrop(list, config)

</script>

<template lang="pug">
q-page(padding)
	.header Атрибуты ?
	.grid
		div
			StatusList
		div
			FieldList
	.header Дайджест
	.droparea(ref="digest")
		q-chip(v-for="item in chips"
			:key="item.id"
			removable
			) {{ item.label }}
		q-btn#nodrag(v-if='chips.length' round flat dense @click="" icon="mdi-close") 
		.comm(v-if="chips.length == 0") Перетащите сюда нужные поля и/ если необходимо, добавьте текст

</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
}

.grid {
	max-width: 1200px;
	margin: 1rem auto;
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 4rem;
	row-gap: .5rem;
}

.comm {
	text-align: center;
	color: $secondary;
	margin-top: 4px;
}

.droparea {
	max-width: 1200px;
	min-height: 48px;
	margin: 0 auto;
	padding: .5rem 1rem;
	border: 1px solid $secondary;
	background: hsl(211 26% 90% / 1);
	border-radius: .5rem;
	position: relative;

	.q-btn {
		position: absolute;
		right: .5rem;
	}
}

.q-chip {
	padding: 2px 8px;
	background: white;
	color: $secondary;
	border: 1px solid $secondary;
}

:deep(.q-chip__icon--remove) {
	color: $secondary;
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		visibility: hidden;
	}

}
</style>
