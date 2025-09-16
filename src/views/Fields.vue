<script setup lang="ts">
import { ref } from 'vue'
import FieldList from '@/components/FieldList.vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'
import StatusList from '@/components/StatusList.vue'

// interface Chip {
// 	id: string
// 	label: string
// 	caption: string
// 	type: string
// }

interface Field {
	id: string
	label: string
	caption: string
	type: string
	def: boolean
}

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	group: 'digest',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('q-chip')
	},
}

const list = [] as Field[]

const [digest, chips] = useDragAndDrop(list, config)

const clearAll = () => {
	chips.value.length = 0
}

const clear = (index: number) => {
	chips.value.splice(index, 1)
}

const restore = ref(false)

const add = () => {
	if (item.value) {
		list.push(item.value)
	}
	restore.value = true
	setTimeout(() => {
		restore.value = false
	}, 200)
}

const test = () => {
	console.log(item.value)
}

const dragging = ref(false)
const item = ref<Field>()
const setItem = (e: Field) => {
	item.value = e
	dragging.value = true
}
const stop = () => {
	dragging.value = false
}
</script>

<template lang="pug">
q-page(padding)
	.header Поля
	.grid
		FieldList(@begin='setItem' @stop='stop' :restore='restore')

	.header Дайджест
	.droparea(ref="digest"
		@drop="add"
		:class="{ active: dragging }"
		)
		span(v-if='chips.length' contenteditable="true")
		template(v-for="(item, index) in chips" :key="item.id")
			q-chip(
				removable
				@remove='clear(index)'
				) {{ item.label }}
			span(contenteditable="true")

		q-btn(v-if='chips.length' round flat dense @click="clearAll" icon="mdi-close") 
		.comm(v-if="chips.length == 0") Перетащите сюда нужные поля и/ если необходимо, добавьте текст

	br
	br
	.header Статусы
	.grid
		StatusList()
</template>

<style scoped lang="scss">
span {
	outline: none;
	min-width: l0px;
}

.header {
	font-size: 1.5rem;
	text-align: center;
}

.grid {
	max-width: 700px;
	margin: 1rem auto;
}

.comm {
	text-align: center;
	color: $secondary;
	margin-top: 4px;

	.active & {
		color: green;
	}
}

.droparea {
	max-width: 1200px;
	min-height: 48px;
	margin: 0 auto;
	padding: 0.5rem 1rem;
	border: 1px solid $secondary;
	background: hsl(211 26% 90% / 1);
	border-radius: 0.5rem;
	position: relative;

	.q-btn {
		position: absolute;
		right: 0.5rem;
	}

	&.active {
		background: hsl(118.06deg 26% 90%);
		border: 2px dashed green;
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
