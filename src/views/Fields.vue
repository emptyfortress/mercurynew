<script setup lang="ts">
import { ref } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'
import StatusList from '@/components/StatusList.vue'
import ElementTab from '@/components/ElementTab.vue'

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

const dragging = ref(false)
const item = ref<Field>()
const setItem = (e: Field) => {
	item.value = e
	dragging.value = true
}
const stop = () => {
	dragging.value = false
}

const tab = ref('field')
</script>

<template lang="pug">
q-page(padding)
	q-tabs(v-model="tab")
		q-tab(name='field' label="Поля")
		q-tab(name='status' label="Статусы")

	q-tab-panels(v-model="tab" animated)

		q-tab-panel(name='field')
			.header.q-ml-md.q-mb-md Поля

			.digest Описание приложения
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

			ElementTab(:mode='false' @begin='setItem' @stop='stop')


		q-tab-panel(name='status')
			.header Статусы
			StatusList()
</template>

<style scoped lang="scss">
.q-tab-panels {
	background: transparent;
	max-width: 800px;
	margin: 0 auto;
	height: calc(100vh - 400px);
}
span {
	outline: none;
	min-width: l0px;
}

.header {
	font-size: 1.3rem;
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
	min-height: 48px;
	margin: 0 1rem;
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
.section {
	max-width: 400px;
	margin-top: 1rem;
	margin-bottom: 1rem;
}
.digest {
	margin-left: 1rem;
}
</style>
