<script setup lang="ts">
import { ref, computed, watch, onMounted, onUpdated, markRaw } from 'vue'
import { motion } from 'motion-v'
import { animations } from '@formkit/drag-and-drop'
import { useRouter, useRoute } from 'vue-router'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useApps } from '@/stores/apps'
import Item from '@/components/Item.vue'
import AddButtonNew1 from '@/components/common/AddButtonNew1.vue'
import { uid, useQuasar } from 'quasar'
import IconApp from '@/components/icons/IconApp.vue'
import Empty from '@/components/Empty.vue'
import { useKeyModifier } from '@vueuse/core'

const IconApp1 = markRaw(IconApp)
const myapps = useApps()
const router = useRouter()
const route = useRoute()
const activeItem = ref('')
const shift = useKeyModifier('Shift', { initial: false })

// Функция для обновления URL при изменении состояния
const updateRouteParams = () => {
	router.push({
		params: {
			id: activeItem.value,
		},
	})
}
watch(activeItem, updateRouteParams)

watch(shift, (val) => {
	if (val) {
		updateConfig(config1)
	} else {
		updateConfig(config)
	}
})
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

// const dragStatus = ref(false)
// const setDragStatus = (e: boolean) => {
// 	dragStatus.value = e
// }

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	group: 'items',
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
	accept: (draggedElement: HTMLElement) => {
		return !draggedElement.classList.contains('group')
	},
}
const config1 = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: false,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
	accept: (draggedElement: HTMLElement) => {
		return !draggedElement.classList.contains('group')
	},
}

const expanded = ref(false)
const [parent, tapes, updateConfig] = useDragAndDrop(myapps.apps, config)

watch(tapes, (val) => {
	if (val) {
		myapps.apps = tapes.value
	}
})

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
		version: '1',
		author: 'Орлов П.С.',
		created: '22.09.2022',
		published: false,
		group: e.group,
		list: [],
		pic: e.pic,
	}
	tapes.value?.unshift(tmp)

	if (e.group == 1) {
		setTimeout(() => {
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'positive',
				message: 'Добавлено приложение',
			})
		}, 1200)
	} else {
		setTimeout(() => {
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'positive',
				message: 'Добавлена группа',
			})
		}, 1200)
	}
}

const duble = (e: any) => {
	let tmp = {
		id: uid(),
		label: 'Копия приложения',
		descr: e.description,
		expand: false,
		over: false,
		version: '1',
		author: 'Орлов П.С.',
		created: '22.09.2022',
		published: false,
		group: e.group,
		list: [],
		pic: e.pic,
	}
	tapes.value?.unshift(tmp)
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
		label: 'Копия приложения',
		descr: 'Копия описания',
		expand: false,
		over: false,
		version: '1',
		author: 'Орлов П.С.',
		created: '22.09.2022',
		published: false,
		group: 1,
		list: [],
		pic: IconApp1,
	}
	tapes.value?.unshift(tmp)
	// tapes.value?.push(tmp)

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

const createGroup = (one: App, two: App) => {
	const tmp = {
		id: uid(),
		label: one.label,
		descr: one.descr,
		version: one.version,
		expand: false,
		author: one.author,
		created: one.created,
		published: false,
		group: 1,
		pic: one.pic,
		list: [],
	}
	const tmp1 = {
		id: uid(),
		label: two.label,
		descr: two.descr,
		version: two.version,
		expand: false,
		author: two.author,
		created: two.created,
		published: false,
		group: 1,
		pic: two.pic,
		list: [],
	}

	const ind = tapes.value.findIndex((el) => el.id == two.id)

	if (ind) {
		tapes.value.splice(ind, 1)
	}

	one.group = 2
	one.label = 'Группа'
	tmp.id = uid()
	one.list = [tmp, tmp1]
}

const calcPlusClass = computed(() => {
	if (duple.value) return 'duplicate'
	if (expanded.value) return 'cl-0'
	// if (expanded.value) return `cl-${tapes.value.length}`
	return ''
})

const action = () => {
	if (expanded.value) {
		expanded.value = false
		activeItem.value = ''
	}
}
const calcStyle = computed(() => {
	return myapps.groupDrag ? 'outline: 3px dotted #143c5f;' : ''
})
</script>

<template lang="pug">
q-page(padding, @click='action')
	.parent(ref='parent'
		:class="{'end': expanded}"
		@click.stop='back'
		:style='calcStyle'
	)

		Div.plus(
			layout
			:transition='spring'
			@click.stop
			@dragover.prevent="onDragEnterPlus"
			@dragenter.prevent
			@dragleave="onDragLeavePlus"
			@drop='onDropPlus'
			:class="calcPlusClass"
		)
			AddButtonNew1(mode='app' @create='create')

		.cen( v-if='tapes.length == 0')
			Empty(mode='app')

		Item(
			v-model:expanded="expanded",
			v-model:tapes='tapes',
			v-model:activeItem="activeItem",
			@navigate="navigate"
			@createGroup='createGroup'
			@duplicate='duble'
			:shift="shift"
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
.parent {
	grid-template-rows: repeat(v-bind(row), 170px);
	&.end {
		grid-template-rows: repeat(v-bind(row1), 80px);
	}
}
.plus {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	&.duplicate {
		background: hsl(213 38% 81% / 1) !important;
		border: 2px dashed $primary;
		border-radius: 0.5rem;
	}
}
.cen {
	height: 170px;
	width: 170px;
	display: flex;
	align-items: center;
}
</style>
