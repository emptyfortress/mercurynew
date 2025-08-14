<script setup lang="ts">
import { ref, computed, onMounted, watch, markRaw } from 'vue'
import { motion } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import { useApps } from '@/stores/apps'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations, state } from '@formkit/drag-and-drop'
import AddButtonNew from '@/components/common/AddButtonNew.vue'
import Trash from '@/components/common/Trash.vue'
import { uid, useQuasar } from 'quasar'
import IconApp from '@/components/icons/IconApp.vue'
import AppPreviewNew from '@/components/AppPreviewNew.vue'

const myapps = useApps()
const router = useRouter()
const route = useRoute()
const IconApp1 = markRaw(IconApp)

const list = computed(() => {
	return myapps.apps.filter((item) => item.id == route.params.id)[0].list
})

const Div = motion.div

const back = () => {
	router.push(myapps.path)
}

const currentItem = computed({
	get() {
		let tmp = myapps.apps.find((el) => el.id == calcId.value)
		return tmp ? tmp.label : 'Label'
	},
	set(val) {
		let tmp = myapps.apps.find((el) => el.id == calcId.value)
		if (tmp) tmp.label = val
	},
})

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
const activeItem = ref('')

const action = (item: App) => {
	if (activeItem.value !== '' && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = ''
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
	transition: { duration: 0.1, delay: 0.4 },
}
// copy code
// Функция для обновления URL при изменении состояния
const updateRouteParams = () => {
	router.push({
		params: {
			item: activeItem.value,
		},
	})
}
watch(activeItem, updateRouteParams)

// Функция для загрузки состояния из параметров маршрута
const loadStateFromRoute = () => {
	if (route.params.item !== '') {
		activeItem.value = route.params.item[0]
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
watch(() => route.params.item, loadStateFromRoute)

const calcId = computed(() => {
	return route.params.id.toString()
})

// trash code
const dragStatus = ref(false)
const confirm = ref(false)

state.on('dragStarted', () => {
	dragStatus.value = true
})

state.on('dragEnded', () => {
	dragStatus.value = false
})

const duple = ref(false)
const onDragEnterPlus = () => {
	duple.value = true
}
const onDragLeavePlus = () => {
	duple.value = false
}

const $q = useQuasar()
const onDropPlus = () => {
	duple.value = false
	let tmp = {
		id: uid(),
		label: 'Копия названия',
		descr: 'Копия описания',
		expand: false,
		over: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.09.2022',
		published: 0,
		group: 1,
		list: [],
		pic: IconApp1,
		versions: [
			{
				id: 0,
				label: 'Базовая версия',
				value: 'Базовая версия',
				descr: 'Стартовая версия приложения',
				author: 'Орлов П.С.',
				created: '22.10.24 14:00',
				modified: '',
				published: 0,
				current: true,
			},
		],
	}
	tapes.value?.push(tmp)

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Приложение дублировано',
		})
	}, 1200)
}

const draggedItem = ref(100)
const setDragged = (n: number) => {
	draggedItem.value = n
}
const remove = () => {
	tapes.value.splice(draggedItem.value, 1)
	$q.notify({
		icon: 'mdi-check-bold',
		color: 'negative',
		message: 'Приложение удалено',
		actions: [
			{
				label: 'Отмена',
				color: 'white',
				handler: () => {
					/* ... */
				},
			},
		],
	})
}

const create = (e: any) => {
	let tmp = {
		id: uid(),
		label: e.label,
		descr: e.description,
		expand: false,
		over: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.09.2022',
		published: 0,
		group: 1,
		list: [],
		pic: IconApp1,
		versions: [
			{
				id: 0,
				label: 'Базовая версия',
				value: 'Базовая версия',
				descr: 'Стартовая версия приложения',
				author: 'Орлов П.С.',
				created: '22.10.24 14:00',
				modified: '',
				published: 0,
				current: true,
			},
		],
	}
	list.value?.push(tmp)
	// myapps.createApp(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлено новое приложение',
		})
	}, 1200)
}

const row = computed(() => {
	return Math.floor(list.value.length / 4 + 1)
})
const row1 = computed(() => {
	return list.value.length + 1
})
</script>

<template lang="pug">
q-page(padding)
	Div.box(
		@click.stop='back',
		:layout-id="calcId"
		:transition='spring'
		:class='{big: expanded}'
	)
		.header
			span(@click.stop) {{ currentItem }}
				q-popup-edit(v-model="currentItem" auto-save v-slot="scope")
					q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")

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
				@dragstart='setDragged(index)'
				:transition="spring"
				:initial="initial"
				:animate="anim"
			)
				span {{ item.label }}

				AppPreviewNew(
					v-if='activeItem == item.id'
					:item='item',
					@remove='remove'
				)

				.img
					component(:is='item.pic')

			Div.plus(
				layout
				:transition='spring'
				@dragover.prevent="onDragEnterPlus"
				@dragenter.prevent
				@dragleave="onDragLeavePlus"
				@drop='onDropPlus'
				:class="{ duplicate: duple }"
			)
				AddButtonNew(mode='app' @create='create')

	Trash(v-model="dragStatus" @remove="remove" :group='true' :duple='duple')

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
	width: 850px;
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
	grid-template-rows: repeat(v-bind(row), 170px);
	gap: 1rem;
	margin: 0 auto;
	margin-top: 1rem;

	&.end {
		grid-template-columns: repeat(1, 200px);
		grid-template-rows: repeat(v-bind(row1), 80px);
		.it1 {
			padding: 0.5rem;
			font-size: 0.85rem;
			grid-column: 1/2;
			.img {
				font-size: 1.2rem;
			}
			&.active {
				grid-column: 2/4;
				grid-row: 1/6;
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
.plus {
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
	&.duplicate {
		background: hsl(213 38% 81% / 1) !important;
		border: 2px dashed $primary;
		border-radius: 0.5rem;
	}
}
</style>
