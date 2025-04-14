<script setup lang="ts">
import { ref, watch, onMounted, onUpdated } from 'vue'
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
onUpdated(() => {
	myapps.setPath('/' + route.params.id)
})

const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}
</script>

<template lang="pug">
q-page(padding)
	Div.parent(ref='parent'
		:class="{'end': expanded}"
		@click.stop='back'
	)
		Item(
			v-model:expanded="expanded",
			v-model:tapes='tapes',
			v-model:activeItem="activeItem",
			@navigate="navigate"
		)

		Div.plus(
			@click.stop
			layout
			:transition='spring'
		)
			q-btn(unelevated round color="primary" icon='mdi-plus') 


</template>

<style scoped lang="scss">
.q-page {
	position: relative;
}
.header {
	font-size: 1.5rem;
	text-align: center;
}
.plus {
	width: 100%;
	height: 100%;
	// background: #ccc;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
