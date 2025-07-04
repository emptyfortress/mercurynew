<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Draggable from 'vuedraggable'
import TablerCopyPlus from '@/components/icons/TablerCopyPlus.vue'
import { useQuasar } from 'quasar'
import Server1 from '@/components/Server1.vue'
// import { servers } from '@/stores/servers'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const source = ref([
	{ id: 2, label: 'Версия 3', author: 'Орлов П.С.', mod: '23.07.25', current: true },
	{ id: 1, label: 'Версия 2', author: 'Роза Львовна', mod: '21.07.25', current: false },
	{ id: 0, label: 'Версия 1', author: 'Орлов П.С.', mod: '11.06.25', current: false },
])

const dragCounters = ref<Record<number, number>>({})
const isDraggingOver = (id: number) => dragCounters.value[id] > 0
const pendingClone = ref<any | null>(null)

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

const onDrop = (serverId: number) => {
	// if (pendingClone.value) {
	// 	const server = servers.value.find((s) => s.id === serverId)
	// 	if (!server) return
	//
	// 	const exists = server.list.some((item) => item.label === pendingClone.value.label)
	// 	if (exists) {
	// 		$q.notify({
	// 			type: 'negative',
	// 			message: `Элемент "${pendingClone.value.label}" уже существует в "${server.nick}"`,
	// 			position: 'top-right',
	// 		})
	// 	} else {
	// 		server.list.forEach((el) => (el.current = false))
	// 		server.list.unshift(pendingClone.value)
	// 		server.list[0].current = true
	//
	// 		$q.notify({
	// 			type: 'positive',
	// 			message: `Элемент "${pendingClone.value.label}" успешно добавлен в "${server.nick}"`,
	// 			position: 'top-right',
	// 		})
	// 	}
	//
	// 	pendingClone.value = null
	// }

	dragCounters.value[serverId] = 0
}

const removeFromServer = (serverId: number, index: number) => {
	// const server = servers.value.find((s) => s.id === serverId)
	// if (!server) return
	//
	// server.list.splice(index, 1)
	// if (server.list.length) {
	// 	server.list[0].current = true
	// }
}

const remove1 = (e: number) => {
	source.value.splice(e, 1)
	if (source.value.length) {
		source.value[0].current = true
	}
}

const add = () => {
	source.value.forEach((el) => (el.current = false))
	source.value.unshift({
		id: Date.now(), // Лучше Date.now() вместо index
		label: `Версия ${source.value.length + 1}`,
		current: true,
		author: 'Орлов П.С.',
		mod: '23.07.25',
	})
}
</script>

<template lang="pug">
.grid
	div
		.hd1
			img.q-mr-sm(src="@/assets/img/kp-favicon.svg", width="16" height="16")
			|Конструктор
		.constructor

			draggable.list(
				:list="source"
				:group="{ name: 'items', pull: 'clone', put: false }"
				:clone="onClone"
				item-key="id"
				:sort='false'
			)
				template(#item="{ element, index }")
					.myitem(clickable)
						// q-item-section(side)
						// 	q-icon(v-if='element.current' color="deep-purple-11" name="mdi-circle-slice-8")
						// 	q-icon(v-else name="mdi-circle-outline" color="secondary")
						q-item-section
							q-item-label.link {{ element.label }}
						q-item-section
							q-item-label() {{ element.author }}
						q-item-section.row.align-center
							q-item-label() {{ element.mod }}
								span.q-ml-sm
									q-btn(v-if='index == 0' flat round dense icon="mdi-cloud-upload-outline" color="primary") 
						.text-secondary
							// q-btn(flat round dense icon="mdi-eye-outline" @click="" size='md') 
							q-btn(flat round dense @click="add" size='md') 
								TablerCopyPlus.ic
							q-btn(flat round dense icon="mdi-delete-outline" @click="remove1(index)" size='md') 

	Server1()

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
	font-size: 1rem;
	text-align: center;
	margin-bottom: 0.5rem;
	img {
		margin-bottom: -2px;
	}
}
.grid {
	max-width: 1300px;
	margin: 1rem auto;
	display: grid;
	grid-template-columns: 1fr 1fr;
	align-items: start;
	column-gap: 1rem;
	row-gap: 0.5rem;
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
.myitem {
	display: grid;
	align-items: center;
	grid-template-columns: 1fr 1fr 1fr auto;
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
.link {
	font-weight: 600;
	color: $primary;
	text-decoration: underline;
	&:hover {
		text-decoration: none;
	}
}
// .pare {
// 	display: grid;
// 	grid-template-columns: repeat(3, 1fr);
// 	// justify-items: start;
// 	// align-items: stretch;
// 	column-gap: 0.5rem;
// 	row-gap: 0.5rem;
// }
</style>
