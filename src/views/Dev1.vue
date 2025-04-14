<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { motion } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import { useApps } from '@/stores/apps'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'

const myapps = useApps()
const router = useRouter()
const route = useRoute()

const list = computed(() => {
	return myapps.apps.filter((item) => item.id == +route.params.id)[0].list
})

const Div = motion.div

const back = () => {
	router.push(myapps.path)
}

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it1')
	},
}
const [parent, tapes] = useDragAndDrop(list.value, config)

// expand item
const expanded = ref(false)
const activeItem = ref(0)

const action = (item: App) => {
	if (activeItem.value !== 0 && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = 0
	} else {
		expanded.value = true
		activeItem.value = item.id
	}
}

const calcClass = (item: App) => {
	if (expanded.value && activeItem.value == item.id) return 'active'
	return ''
}

const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}
const initial = {
	opacity: 0,
	y: 20,
}
const anim = {
	opacity: 1,
	y: 0,
	transition: { duration: 0.2, delay: 0.3 },
}
// copy code
// Функция для обновления URL при изменении состояния
const updateRouteParams = () => {
	router.push({
		params: {
			item: activeItem.value?.toString(),
		},
	})
}
watch(activeItem, updateRouteParams)

// Функция для загрузки состояния из параметров маршрута
const loadStateFromRoute = () => {
	if (+route.params.item !== 0) {
		activeItem.value = parseInt(route.params.item as string, 10)
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
watch(() => route.params.item, loadStateFromRoute)
</script>

<template lang="pug">
q-page(padding)
	Div.box(@click.stop='back', layout-id="underline")
		.header
			span Маркетинг

		Div.parent1(ref='parent',
			:class="{'end': expanded}",
			layout
		)
			Div.it1(
				v-for="(item, index) in tapes",
				:key="item.id",
				:class='calcClass(item)'
				layout
				@click.stop='action(item)'
				:transition="spring"
				:initial="initial"
				:animate="anim"
			)
				span {{ item.label }}
				.img
					component(:is='item.pic')

</template>

<style scoped lang="scss">
.header {
	text-align: center;
	color: $primary;
	margin-bottom: 0.8rem;
	span {
		font-size: 1.2rem;
		border-bottom: 1px dotted $primary;
	}
}
.ic {
	font-size: 1.9rem;
	margin-bottom: -5px;
	margin-right: 0.5rem;
}
.box {
	margin: 0 auto;
	margin-top: 1rem;
	width: 860px;
	padding: 0.5rem;
	background: hsl(213deg 83.95% 94.68%);
	border: 2px solid var(--green);
	border-radius: 0.5rem;
	z-index: 10;
}
.it1 {
	border-radius: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	background: #fff;
	border: 1px solid #fff;
	position: relative;
	border: 1px solid $secondary;
	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
	&.active {
		font-size: 1.2rem;
	}
}
.parent1 {
	display: grid;
	grid-template-columns: repeat(4, 170px);
	grid-template-rows: repeat(1, 170px);
	gap: 1rem;
	margin: 0 auto;
	margin-top: 1rem;

	&.end {
		grid-template-columns: repeat(1, 200px);
		grid-template-rows: repeat(4, 80px);
		.it1 {
			padding: 0.5rem;
			font-size: 0.85rem;
			grid-column: 1/2;
			.img {
				font-size: 1.2rem;
			}
			&.active {
				grid-column: 2/4;
				grid-row: 1/4;
				padding: 1rem;
				font-size: 1.2rem;
				.img {
					font-size: 4rem;
				}
			}
		}
	}
}
.img {
	position: absolute;
	bottom: 0;
	left: 0.5rem;
	font-size: 3rem;
	line-height: 1;
	color: hsl(199 23% 45% / 1);
}
</style>
