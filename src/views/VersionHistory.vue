<script setup lang="ts">
import { ref } from 'vue'
import Draggable from 'vuedraggable'
import TablerCopyPlus from '@/components/icons/TablerCopyPlus.vue'

const source = ref([
	{ id: 2, label: 'Версия 3', current: true },
	{ id: 1, label: 'Версия 2', current: false },
	{ id: 0, label: 'Версия 1', current: false },
])

const list2 = ref([
	{ id: 1, label: 'Версия 2', current: true },
	{ id: 0, label: 'Версия 1', current: false },
])

const servers = ref([
	{
		id: 0,
		nick: 'DV-test',
		list: [
			{ id: 1, label: 'Версия 2', current: true },
			{ id: 0, label: 'Версия 1', current: false },
		],
	},
	{
		id: 1,
		nick: 'DV-prod',
		list: [{ id: 0, label: 'Версия 1', current: true }],
	},
])

const dragCounters = ref<Record<number, number>>({})

const isDraggingOver = (id: number) => dragCounters.value[id] > 0

const dragCounter = ref(0)
const isDraggingOverServer1 = ref(false)
const isDraggingOverServer2 = ref(false)
const pendingClone = ref<any | null>(null)

// Клонируем вручную
const onClone = (original: any) => {
	pendingClone.value = {
		...original,
		id: Date.now(),
	}
}

const onDragEnter = (id: number) => {
	if (!dragCounters.value[id]) dragCounters.value[id] = 0
	dragCounters.value[id]++
}

const onDragLeave = (id: number) => {
	if (dragCounters.value[id]) {
		dragCounters.value[id]--
		if (dragCounters.value[id] < 0) {
			dragCounters.value[id] = 0
		}
	}
}

const notifyDuplicate = (item: { label: string }) => {
	console.log(`❗ Элемент с label "${item.label}" уже существует в list2`)
}

const onDrop = (serverId: number) => {
	if (pendingClone.value) {
		const server = servers.value.find((s) => s.id === serverId)
		if (!server) return

		const exists = server.list.some((item) => item.label === pendingClone.value.label)

		if (exists) {
			notifyDuplicate(pendingClone.value)
		} else {
			server.list.forEach((el) => (el.current = false))
			server.list.unshift(pendingClone.value)
			server.list[0].current = true
		}

		pendingClone.value = null
	}

	if (serverId === 0) isDraggingOverServer1.value = false
	if (serverId === 1) isDraggingOverServer2.value = false

	dragCounter.value = 0
	dragCounters.value[serverId] = 0 // очистка при drop
}

const move = (e: any) => {
	list2.value.map((el) => (el.current = false))
	list2.value.unshift(e)
}

const removeFromServer = (serverId: number, index: number) => {
	const server = servers.value.find((s) => s.id === serverId)
	if (!server) return

	server.list.splice(index, 1)

	// Переназначить current, если список не пуст
	if (server.list.length) {
		server.list[0].current = true
	}
}

const remove1 = (e: number) => {
	source.value.splice(e, 1)
	if (source.value.length) {
		source.value[0].current = true
	}
}

const add = () => {
	source.value.map((el) => (el.current = false))
	source.value.unshift({
		id: source.value.length,
		label: `Версия ${source.value.length + 1}`,
		current: true,
	})
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
					:list="source"
					:group="{ name: 'items', pull: 'clone', put: false }"
					:clone="onClone"
					item-key="id"
					:sort='false'
				)
					template(#item="{ element, index }")
						.myitem(clickable)
							q-item-section(side)
								q-icon(v-if='element.current' color="deep-purple-11" name="mdi-circle-slice-8")
								q-icon(v-else name="mdi-circle-outline" color="secondary")
							q-item-section {{ element.label }}
							.text-secondary
								q-btn(flat round dense icon="mdi-eye-outline" @click="" size='md') 
								q-btn(flat round dense @click="add" size='md') 
									TablerCopyPlus.ic
								q-btn(flat round dense icon="mdi-delete-outline" @click="remove1(index)" size='md') 
			div
				.server(v-for="server in servers" :key="server.id"
					:class="{ 'drag-over': isDraggingOver(server.id) }"
					@dragenter.prevent="onDragEnter(server.id)"
					@dragleave.prevent="onDragLeave(server.id)"
					@drop.prevent="onDrop(server.id)"
				)

					.hd1
						.lin
							q-icon.ic(name="mdi-server-network-outline")
							|{{ server.nick }}

					draggable.dr.list(
						:list="server.list"
						:group="{ name: 'items', pull: false, put: false }"
						item-key="id"
					)
						template(#item="{ element, index }")
							.myitem(clickable)
								q-item-section(side)
									q-icon(v-if='element.current' color="deep-purple-11" name="mdi-circle-slice-8")
									q-icon(v-else name="mdi-circle-outline" color="secondary")
								q-item-section {{ element.label }}
								.text-secondary(v-if='element.current')
									q-btn(
										flat round dense,
										icon="mdi-delete-outline",
										@click="removeFromServer(server.id, index)"
										size='md'
									) 

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
	align-items: start;
	column-gap: 1rem;
	row-gap: 0.5rem;
	.server,
	.constructor {
		padding: 1rem;
		background: #ffffff77;
		border-radius: 0.5rem;
		border: 1px solid white;
		margin-bottom: 0.5rem;
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
.plu {
	grid-column: 2/3;
}
</style>
