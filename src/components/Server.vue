<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { motion } from 'motion-v'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import IcOutlineDesktopWindows from '@/components/icons/IcOutlineDesktopWindows.vue'
import { servers } from '@/stores/servers'
import { useRouter, useRoute } from 'vue-router'
import AddButtonServer from '@/components/common/AddButtonServer.vue'

const router = useRouter()
const route = useRoute()

const activeItem = ref('')
const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('server')
	},
}

const [pare, tapes] = useDragAndDrop(servers.value, config)

const Div = motion.div

const expanded = ref<boolean>(false)

const initial = {
	opacity: 0,
	y: -20,
}

const animate = {
	opacity: 1,
	y: 0,
}
const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}

const action = async (item: any) => {
	if (activeItem.value !== '' && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = ''
		item.expand = false
		// emit('back')
		back()
		await nextTick()
	} else {
		expanded.value = true
		activeItem.value = item.id
		item.expand = true
		// emit('navigate', item.id)
		navigate(item.id)
		await nextTick()
	}
}

const calcClass = (item: any, index: number) => {
	if (expanded.value && activeItem.value !== item.id) return `em-${index! + 1}`
	else if (expanded.value && activeItem.value == item.id) return 'active'
	else return `im-${index! + 1}`
}

const plusPosition = computed(() => {
	const index = tapes.value.length
	const col = (index % 3) + 1
	let row = Math.floor(index / 3) + 1

	// Если expanded включён — сместить на одну строку ниже
	if (expanded.value) {
		row += 1
	}

	return {
		gridColumn: `${col} / ${col + 1}`,
		gridRow: `${row} / ${row + 1}`,
	}
})

const calcColor = (item: any) => {
	return item.prod ? 'red' : 'positive'
}

const navigate = (id: string) => {
	router.push(`/version/${id}`)
	activeItem.value = id
}
const back = () => {
	router.push('/version')
	activeItem.value = ''
}

// Функция для обновления URL при изменении состояния
const updateRouteParams = () => {
	router.push({
		params: {
			id: activeItem.value,
		},
	})
}
watch(activeItem, updateRouteParams)

// Функция для загрузки состояния из параметров маршрута
const loadStateFromRoute = () => {
	if (route.params.id !== '') {
		activeItem.value = route.params.id.toString()
		expanded.value = true
	} else {
		activeItem.value = ''
		expanded.value = false
	}
}
// Загружаем состояние при монтировании компонента
onMounted(loadStateFromRoute)
//
// Загружаем состояние при изменении маршрута (например, при переходе назад/вперед)
watch(() => route.params.id, loadStateFromRoute)
</script>

<template lang="pug">
div
	.hd1
		q-icon.q-mr-sm(name="mdi-database-outline" size="24px") 
		|Базы данных
	Div.pare(ref='pare',
		:class="{'end': expanded}"
	)
		Div.server(v-for="(item, index) in tapes", :key="item.id",
			@click.stop='action(item)',
			:layout-id="item.id"
			:initial="initial"
			:animate="animate"
			:transition="spring"
			:class='calcClass(item, index)'
		)
			.toprow
				q-icon.q-mr-sm(name="mdi-circle-slice-8" :color="calcColor(item)")
					q-tooltip(v-if='item.prod') Production environment
					q-tooltip(v-else) Test environment
				div {{ item.nick }}
				q-space
				q-btn(flat round dense color="primary") 
					IcOutlineDesktopWindows
			.text-center(v-if='!item.expand') {{ item.list[0].label}}

		Div.plus(:style='plusPosition'
			layout
			:initial="initial"
			:animate="animate"
			:transition="spring"
			)
			AddButtonServer
			// q-btn(unelevated round color="primary" icon='mdi-plus') 

</template>

<style scoped lang="scss">
.hd1 {
	font-size: 1rem;
	text-align: center;
	margin-bottom: 0.5rem;
	img {
		margin-bottom: -2px;
	}
}
.server {
	width: 100%;
	height: 100px;
	background: #ffffff77;
	border-radius: 0.5rem;
	border: 1px solid white;
	cursor: pointer;
	&.active {
		height: 170px;
		grid-column: 1/-1;
		grid-row: 1/2;
	}
	&:hover {
		box-shadow: var(--shad0);
	}
}
.server.drag-over {
	border: 2px dashed $primary;
	background-color: #e3f2fd;
}
.toprow {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 0 1rem 0.5rem;
}
.pare {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	column-gap: 0.5rem;
	row-gap: 0.5rem;
	&.end {
		grid-template-rows: 200px auto;
	}
}
.plus {
	width: 100%;
	height: 100px;
	background: #ffffff44;
	border-radius: 0.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	// border: 1px solid white;
}

.im-1 {
	grid-column: 1/2;
	grid-row: 1/2;
}
.im-2 {
	grid-column: 2/3;
	grid-row: 1/2;
}
.im-3 {
	grid-column: 3/4;
	grid-row: 1/2;
}
.im-4 {
	grid-column: 1/2;
	grid-row: 2/3;
}
.im-5 {
	grid-column: 2/3;
	grid-row: 2/3;
}
.im-6 {
	grid-column: 3/4;
	grid-row: 2/3;
}
.im-7 {
	grid-column: 1/2;
	grid-row: 3/4;
}
.im-8 {
	grid-column: 2/3;
	grid-row: 3/4;
}
.im-9 {
	grid-column: 3/4;
	grid-row: 3/4;
}

.em-1 {
	grid-column: 1/2;
	grid-row: 2/3;
}
.em-2 {
	grid-column: 2/3;
	grid-row: 2/3;
}
.em-3 {
	grid-column: 3/4;
	grid-row: 2/3;
}
.em-4 {
	grid-column: 1/2;
	grid-row: 3/4;
}
.em-5 {
	grid-column: 2/3;
	grid-row: 3/4;
}
.em-6 {
	grid-column: 3/4;
	grid-row: 3/4;
}
.em-7 {
	grid-column: 1/2;
	grid-row: 4/5;
}
.em-8 {
	grid-column: 2/3;
	grid-row: 4/5;
}
.em-9 {
	grid-column: 3/4;
	grid-row: 4/5;
}
</style>
