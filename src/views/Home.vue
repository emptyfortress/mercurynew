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
	router.push('/dev/folder/1')
}
</script>

<template lang="pug">
q-page(padding)
	.header Мои приложения - {{ activeItem }}
	Div.pa(ref='parent'
		:class="{'end': expanded}"
		@click.stop='back'
	)
		template(v-for="(item, index) in tapes", :key="item.id",)
			Div.it(v-if='item.group == 1'
				@click.stop='action(item.id)',
				:data-state="expanded",
				layout,
				:class='calcClass(item.id)'
				:initial="{ opacity: 0, y: 20, scale: 0.5 }"
				:animate="{ opacity: 1, y: 0, scale: 1, transition: { delay: index * 0.05 }} "
				:transition="{ type: 'spring', visualDuration: 0.3, bounce: 0.2 }"
			)
				span {{ item.label }}

				.img(v-if='item.group == 1')
					component(:is='item.pic')

			Div.it.group1(v-if='item.group == 2'
				@click.stop='navigate',
				layout-id="underline",
				:initial="{ opacity: 0, y: 20, scale: 0.5 }"
				:animate="{ opacity: 1, y: 0, scale: 1, transition: { delay: index * 0.05 }} "
			) 
				span {{ item.label }}

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
	background: #ccc;
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
