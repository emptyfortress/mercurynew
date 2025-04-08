<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { motion } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations, state } from '@formkit/drag-and-drop'
import { useList } from '@/stores/list'
import { useApps } from '@/stores/apps'

const list = useList()
const myapps = useApps()
const router = useRouter()
const route = useRoute()
const activeItem = ref(0)

// Функция для обновления URL при изменении состояния
const updateRouteParams = () => {
	router.push({
		params: {
			id: activeItem.value?.toString(),
		},
	})
}
watch(activeItem, updateRouteParams)

// Функция для загрузки состояния из параметров маршрута
const loadStateFromRoute = () => {
	if (+route.params.id !== 0) {
		activeItem.value = parseInt(route.params.id as string, 10)
		expanded.value = true
	} else {
		activeItem.value = 0
		expanded.value = false
	}
}
// Загружаем состояние при монтировании компонента
onMounted(loadStateFromRoute)
//
// Загружаем состояние при изменении маршрута (например, при переходе назад/вперед)
watch(() => route.params.id, loadStateFromRoute)

// other code
const Div = motion.div

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}
const [parent, tapes] = useDragAndDrop(myapps.apps, config)

const expanded = ref(false)

const action = (id: number) => {
	expanded.value = !expanded.value
	if (activeItem.value !== 0 && activeItem.value == id) {
		expanded.value = false
		activeItem.value = 0
	} else {
		expanded.value = true
		activeItem.value = id
	}
}
const back = () => {
	router.push('/')
	expanded.value = false
}

const calcClass = (id: number) => {
	if (expanded.value && activeItem.value == id) return 'active'
	return ''
}

const navigate = () => {
	router.push('/folder/1')
}
</script>

<template lang="pug">
q-page(padding)
	.header Мои приложения - {{ activeItem }}
	Div.pa(ref='parent'
		:class="{'end': expanded}"
		@click.stop='back'
	)
		Div.it(
			v-for="(item, index) in tapes",
			:key="item.id",
			@click.stop='action(item.id)',
			:data-state="expanded",
			layout,
			:class='calcClass(item.id)'
			:initial="{ opacity: 0, y: 20, scale: 0.5 }"
			:animate="{ opacity: 1, y: 0, scale: 1, transition: { delay: index * 0.05 }} "
			:transition="{ type: 'spring', visualDuration: 0.3, bounce: 0.22 }"
		)
			span {{ item.label }}

		Div.fold(@click.stop='navigate' layout-id="underline" layout)

</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
}
.pa {
	display: grid;
	grid-template-columns: repeat(5, 170px);
	grid-template-rows: repeat(4, 170px);
	gap: 1rem;
	margin: 0 auto;
	margin-top: 0.5rem;
	width: 914px;
	&.end {
		grid-template-columns: repeat(1, 200px);
		grid-template-rows: repeat(7, 80px);
		width: 200px;
		margin: 0;
		margin-left: 200px;
		.it {
			padding: 0.5rem;
			font-size: 0.85rem;
			&.active {
				padding: 1rem;
				font-size: 1.2rem;
			}
		}
	}
}
.it {
	border-radius: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	background: #fff;
	border: 1px solid #fff;

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
	&.active {
		width: 550px;
		height: 250px;
		position: fixed;
		top: 9rem;
		left: calc(50% - 225px);
		font-size: 2rem;
	}
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
	}
}
.plus {
	text-align: center;
	cursor: pointer;
	padding: 1rem;
	background: #fff;
	border: 1px solid #fff;
}
.fold {
	width: 100%;
	height: 100%;
	background: #fff;
}
</style>
