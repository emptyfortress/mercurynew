<script setup lang="ts">
import { ref, computed, watch, onMounted, onUpdated, markRaw } from 'vue'
import { motion } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations, state } from '@formkit/drag-and-drop'
import { useApps } from '@/stores/apps'
import Item from '@/components/Item.vue'
import AddButtonNew from '@/components/common/AddButtonNew.vue'
import { uid, useQuasar } from 'quasar'
import IconApp from '@/components/icons/IconApp.vue'
import Trash from '@/components/common/Trash.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useKeyModifier } from '@vueuse/core'

const IconApp1 = markRaw(IconApp)
const myapps = useApps()
const router = useRouter()
const route = useRoute()
const activeItem = ref('')

// Функция для обновления URL при изменении состояния
const updateRouteParams = () => {
	router.push({
		params: {
			id: activeItem.value,
		},
	})
}
watch(activeItem, updateRouteParams)
const shift = useKeyModifier('Shift')

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
const config1 = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: false,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}

const [parent, tapes, updateConfig] = useDragAndDrop(myapps.apps, config)

watch(shift, (val) => {
	if (val) {
		updateConfig(config1)
	} else {
		updateConfig(config)
	}
})

const expanded = ref(false)

const back = () => {
	router.push('/')
	expanded.value = false
}

const navigate = (id: number) => {
	router.push(`/folder/${id}`)
}
onUpdated(() => {
	myapps.setPath('/' + route.params.id.toString())
})

const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}

const $q = useQuasar()
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
		group: 1,
		list: [],
		pic: IconApp1,
	}
	tapes.value?.push(tmp)
	// myapps.createApp(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлено новое приложение',
		})
	}, 1200)
}

// trash code
const dragStatus = ref(false)
const confirm = ref(false)

state.on('dragStarted', () => {
	if (!expanded.value) {
		dragStatus.value = true
	}
})

state.on('dragEnded', () => {
	dragStatus.value = false
})
const removeGroup = () => {
	tapes.value.splice(draggedItem.value, 1)
	$q.notify({
		icon: 'mdi-check-bold',
		color: 'negative',
		message: 'Группа удалена',
	})
}

const draggedItem = ref(100)

const setDragged = (n: number) => {
	draggedItem.value = n
}

const remove = () => {
	if (tapes.value[draggedItem.value].group > 1) {
		confirm.value = true
	} else {
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
}

const duple = ref(false)
const onDragEnterPlus = () => {
	duple.value = true
}
const onDragLeavePlus = () => {
	duple.value = false
}
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
		group: 1,
		list: [],
		pic: IconApp1,
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

const row = computed(() => {
	return Math.floor(tapes.value.length / 4 + 1)
})
const row1 = computed(() => {
	return tapes.value.length + 1
})

const onDrop = (event: Event) => {
	event.preventDefault()
	console.log(111)
	console.log(draggedItem.value)
}
</script>

<template lang="pug">
q-page(padding,
	@dragover.prevent
	@drop='onDrop'
)
	.parent(ref='parent'
		:class="{'end': expanded}"
		@click.stop='back'
	)

		Item(
			v-model:expanded="expanded",
			v-model:tapes='tapes',
			v-model:activeItem="activeItem",
			@navigate="navigate"
			@dragged='setDragged'

		)

		Div.plus(
			layout
			:transition='spring'
			@click.stop
			@dragover.prevent="onDragEnterPlus"
			@dragenter.prevent
			@dragleave="onDragLeavePlus"
			@drop='onDropPlus'
			:class="{ duplicate: duple }"
		)
			AddButtonNew(mode='app' @create='create')

	Trash(v-model="dragStatus" @remove="remove" :duple='duple')
	ConfirmDialog(v-model="confirm" @remove="removeGroup")
</template>

<style scoped lang="scss">
.q-page {
	position: relative;
}
.header {
	font-size: 1.5rem;
	text-align: center;
}
.parent {
	grid-template-rows: repeat(v-bind(row), 170px);
	&.end {
		grid-template-rows: repeat(v-bind(row1), 80px);
	}
}
.plus {
	width: 100%;
	height: 100%;
	// background: #ccc;
	display: flex;
	justify-content: center;
	align-items: center;

	&.duplicate {
		background: hsl(213 38% 81% / 1) !important;
		border: 2px dashed $primary;
		border-radius: 0.5rem;
	}
}
</style>
