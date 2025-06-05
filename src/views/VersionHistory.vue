<script setup lang="ts">
import { ref } from 'vue'
import Draggable from 'vuedraggable'

const list1 = ref([
	{ id: 0, label: 'label1' },
	{ id: 1, label: 'label2' },
	{ id: 2, label: 'label3' },
])

const list2 = ref([{ id: 3, label: 'label4' }])

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

// const onDrop = () => {
// 	if (pendingClone.value) {
// 		list2.value.push(pendingClone.value)
// 		pendingClone.value = null
// 	}
// 	isDraggingOverServer.value = false
// 	dragCounter.value = 0
// }

const notifyDuplicate = (item: { label: string }) => {
	console.log(`❗ Элемент с label "${item.label}" уже существует в list2`)
}

const onDrop = () => {
	if (pendingClone.value) {
		const exists = list2.value.some((item) => item.label === pendingClone.value.label)

		if (exists) {
			notifyDuplicate(pendingClone.value)
		} else {
			list2.value.push(pendingClone.value)
		}

		pendingClone.value = null
	}

	isDraggingOverServer.value = false
	dragCounter.value = 0
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
				draggable(
					:list="list1"
					:group="{ name: 'items', pull: 'clone', put: false }"
					:clone="onClone"
					item-key="id"
					:sort='false'
				)
					template(#item="{ element }")
						q-item(clickable)
							q-item-section(side)
								q-icon(name="mdi-close" color="primary")
							q-item-section {{ element.label }}
			.server(
				:class="{ 'drag-over': isDraggingOverServer }"
				@dragenter.prevent="onDragEnter"
				@dragleave.prevent="onDragLeave"
				@drop.prevent="onDrop"
			)
				.hd1.lin
					q-icon.ic(name="mdi-server-network-outline")
					|DV-test
					q-icon.q-ml-sm(name="mdi-chevron-down" color="primary")
				draggable.dr(
					:list="list2"
					:group="{ name: 'items', pull: false, put: false }"
					item-key="id"
				)
					template(#item="{ element }")
						q-item(clickable)
							q-item-section(side)
								q-icon(name="mdi-close" color="primary")
							q-item-section {{ element.label }}
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
	&.lin {
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
	}
}
.server.drag-over {
	border: 2px dashed $primary;
	background-color: #e3f2fd;
}
.dr {
	// background: yellow;
	height: 100%;
}
</style>
