<script setup lang="ts">
import { ref, watch, onMounted, reactive } from 'vue'
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

const action = (item: App) => {
	// expanded.value = !expanded.value
	if (item.group == 2) {
		navigate()
	} else {
		if (activeItem.value !== 0 && activeItem.value == item.id) {
			expanded.value = false
			activeItem.value = 0
		} else {
			expanded.value = true
			activeItem.value = item.id
		}
	}
}
const back = () => {
	router.push('/')
	expanded.value = false
}

const calcClass = (item: App) => {
	if (item.group == 2) return 'group1'
	if (expanded.value && activeItem.value == item.id) return 'active'
	return ''
}

const navigate = () => {
	router.push('/folder/1')
}
const calcId = (item: App) => {
	if (item.group == 2) return 'underline'
}

const initial = {
	opacity: 0,
	y: 20,
}

const animate = (index: number) => ({
	opacity: 1,
	y: 0,
	transition: { delay: index * 0.05 },
})

const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}
</script>

<template lang="pug">
q-page(padding)
	Div.header(
		:initial='{opacity: 0, y: 50}'
		:animate='{opacity: 1, y: 0, transition: {delay: 0.4}}'
	) Мои приложения

	Div.pa(ref='parent'
		:class="{'end': expanded}"
		@click.stop='back'
	)
		Div.it(v-for="(item, index) in tapes", :key="item.id",
			@click.stop='action(item)',
			:data-state="expanded",
			layout,
			:layout-id="calcId(item)"
			:class='calcClass(item)'
			:initial="initial"
			:animate="animate(index)"
			:transition="spring"
		)
			Div(layout-id='zag' v-if='item.group == 2') {{ item.label }}
			span(v-else) {{ item.label }}

			.img(v-if='item.group == 1')
				component(:is='item.pic')

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
	// background: #ccc;
	&.end {
		grid-template-columns: repeat(1, 200px);
		grid-template-rows: repeat(7, 80px);
		width: 200px;
		margin: 0;
		// margin-left: 200px;
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
.it {
	border-radius: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	background: #fff;
	border: 1px solid #fff;
	position: relative;

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
	&.group1 {
		background: hsl(213deg 83.95% 94.68%);
		border: 2px solid var(--green);
		z-index: 10;
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
.img,
.img1 {
	position: absolute;
	bottom: 0;
	left: 0.5rem;
	font-size: 3rem;
	line-height: 1;
	color: hsl(199 23% 45% / 1);
}
</style>
