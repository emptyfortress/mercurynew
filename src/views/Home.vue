<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { motion } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'
import { useApps } from '@/stores/apps'
import Item from '@/components/Item.vue'

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

const back = () => {
	router.push('/')
	expanded.value = false
}

const navigate = (id: number) => {
	router.push(`/folder/${id}`)
}
</script>

<template lang="pug">
q-page(padding)
	Div.header(
		:initial='{opacity: 0, y: -20}'
		:animate='{opacity: 1, y: 0, transition: {delay: 0.45}}'
	) Мои приложения

	Div.pa(ref='parent'
		:class="{'end': expanded}"
		@click.stop='back'
	)
		Item(
			v-model:expanded="expanded",
			v-model:tapes='tapes',
			v-model:activeItem="activeItem",
			@navigate="navigate"
		)


</template>

<style scoped lang="scss">
.q-page {
	position: relative;
}
.header {
	font-size: 1.5rem;
	text-align: center;
}
.pa {
	display: grid;
	grid-template-columns: repeat(4, 170px);
	grid-template-rows: repeat(4, 170px);
	gap: 1rem;
	margin: 0 auto;
	margin-top: 0.5rem;
	width: 728px;
	&.end {
		grid-template-columns: repeat(1, 200px);
		grid-template-rows: repeat(7, 80px);
		width: 200px;
		margin: 0;
		margin-left: calc(50% - 500px);
		.it {
			padding: 0.5rem;
			font-size: 0.85rem;
			&.active {
				padding: 1rem;
				font-size: 1.2rem;
				.img {
					font-size: 4rem;
				}
			}
		}
		.img,
		img1 {
			font-size: 1.5rem;
		}
	}
}
</style>
