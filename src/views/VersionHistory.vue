<script setup lang="ts">
import { ref } from 'vue'
import Draggable from 'vuedraggable'
import TablerCopyPlus from '@/components/icons/TablerCopyPlus.vue'

const list1 = ref([
	{ id: 2, label: 'Версия 3', current: true },
	{ id: 1, label: 'Версия 2', current: false },
	{ id: 0, label: 'Версия 1', current: false },
])

const list2 = ref([
	{ id: 1, label: 'Версия 2', current: true },
	{ id: 0, label: 'Версия 1', current: false },
])

const dragCounter = ref(0)
const isDraggingOverServer = ref(false)
const pendingClone = ref<any | null>(null)

// Клонируем вручную
const onClone = (original: any) => {
	pendingClone.value = {
		...original,
		id: Date.now(),
	}
}

const onDragEnter = () => {
	dragCounter.value++
	isDraggingOverServer.value = true
}

const onDragLeave = () => {
	dragCounter.value--
	if (dragCounter.value <= 0) {
		isDraggingOverServer.value = false
		dragCounter.value = 0
	}
}

const notifyDuplicate = (item: { label: string }) => {
	console.log(`❗ Элемент с label "${item.label}" уже существует в list2`)
}

const onDrop = () => {
	if (pendingClone.value) {
		const exists = list2.value.some((item) => item.label === pendingClone.value.label)

		if (exists) {
			notifyDuplicate(pendingClone.value)
		} else {
			list2.value.map((el) => (el.current = false))
			list2.value.unshift(pendingClone.value)
		}

		pendingClone.value = null
	}

	isDraggingOverServer.value = false
	dragCounter.value = 0
}

const move = (e: any) => {
	list2.value.map((el) => (el.current = false))
	list2.value.unshift(e)
}

const options = [
	{ id: 1, label: 'DV-test' },
	{ id: 2, label: 'DV-prod' },
]

const prod = ref('DV-test')
const setSer = (e: string) => {
	prod.value = e
}
const calcClass = (e: string) => {
	return prod.value == e ? 'selected' : ''
}
</script>

<template lang="pug">
q-page(padding)
	.cont
		.hd История изменений приложения
		.grid
			.constructor
				.hd1
					img.q-mr-sm(src="@/assets/img/kp-favicon.svg", width="18" height="18")
					|Конструктор
				draggable.list(
					:list="list1"
					:group="{ name: 'items', pull: 'clone', put: false }"
					:clone="onClone"
					item-key="id"
					:sort='false'
				)
					template(#item="{ element }")
						.myitem(clickable)
							q-item-section(side)
								q-icon(v-if='element.current' color="deep-purple-11" name="mdi-circle-slice-8")
								q-icon(v-else name="mdi-circle-outline" color="secondary")
							q-item-section {{ element.label }}
							.text-secondary
								q-btn(v-if='element.current' flat round dense icon="mdi-cloud-upload-outline" @click="move(element)" size='md') 
								q-btn(flat round dense icon="mdi-pencil-outline" @click="" size='md') 
								q-btn(flat round dense @click="" size='md') 
									TablerCopyPlus.ic
								q-btn(flat round dense icon="mdi-delete-outline" @click="" size='md') 
			.server(
				:class="{ 'drag-over': isDraggingOverServer }"
				@dragenter.prevent="onDragEnter"
				@dragleave.prevent="onDragLeave"
				@drop.prevent="onDrop"
			)
				.hd1
					.lin
						q-icon.ic(name="mdi-server-network-outline")
						|{{ prod }}
						q-icon.q-ml-sm(name="mdi-chevron-down" color="primary")
						q-menu()
							q-list
								q-item(
									clickable,
									v-for="el in options",
									:key='el.id',
									@click='setSer(el.label)'
									:class='calcClass(el.label)'
									v-close-popup
								)
									q-item-section(side)
										q-icon.ic(name="mdi-server-network-outline" color="primary")
									q-item-section
										q-item-label {{ el.label }}

				draggable.dr.list(
					:list="list2"
					:group="{ name: 'items', pull: false, put: false }"
					item-key="id"
				)
					template(#item="{ element }")
						.myitem(clickable)
							q-item-section(side)
								q-icon(v-if='element.current' color="deep-purple-11" name="mdi-circle-slice-8")
								q-icon(v-else name="mdi-circle-outline" color="secondary")
							q-item-section {{ element.label }}
							.text-secondary(v-if='element.current')
								q-btn(flat round dense icon="mdi-delete-outline" @click="" size='md') 

</template>

<style scoped lang="scss">
.cont {
	max-width: 1400px;
	margin: 0 auto;
}
.current {
	background: var(--selection);
}

.hd {
	font-size: 1.3rem;
	text-align: center;
}
.hd1 {
	font-size: 1.1rem;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	.lin {
		color: $primary;
		cursor: pointer;
		.ic {
			font-size: 1.6rem;
			margin-right: 0.5rem;
			color: $primary;
		}
	}
}
.grid {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 1rem;
	row-gap: 0.5rem;
	.server,
	.constructor {
		padding: 1rem;
		background: #ffffff77;
		border-radius: 0.5rem;
		border: 1px solid white;
	}
}
.server.drag-over {
	border: 2px dashed $primary;
	background-color: #e3f2fd;
}
.dr {
	height: 100%;
}
.list {
	margin-top: 1rem;
}
.myitem {
	display: grid;
	align-items: center;
	grid-template-columns: auto 1fr auto;
	// min-height: 48px;
	cursor: pointer;
	padding: 0.5rem;
	&:hover {
		background: white;
	}
}
.myitem:not(:last-child) {
	border-bottom: 1px solid #ccc;
}
.ic {
	width: 20px;
	height: 20px;
}
.selected {
	background: var(--selection);
}
</style>
