<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { motion } from 'motion-v'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { uid, useQuasar } from 'quasar'
import AddButtonNew from '@/components/common/AddButtonNew.vue'
import ItemRole from '@/components/ItemRole.vue'
import Empty from '@/components/Empty.vue'
import { useRouter, useRoute } from 'vue-router'
// import TrashSimple from '@/components/common/TrashSimple.vue'

const router = useRouter()
const route = useRoute()
const activeItem = ref('')

const roles = ref([
	{
		id: '1',
		label: 'Инициатор',
		expand: false,
		avatar: 'avatar2',
		active: true,
	},
])
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

const $q = useQuasar()

const expanded = ref<boolean>(false)

const create = (e: any) => {
	let tmp = {
		id: uid(),
		label: e.label,
		expand: false,
		avatar: e.avatar,
		active: false,
	}
	tapes.value?.unshift(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлена роль',
		})
	}, 1200)
}

const duble = (e: any) => {
	let tmp = {
		id: uid(),
		label: e.label + '-copy',
		expand: false,
		avatar: e.avatar,
		active: false,
	}
	tapes.value?.unshift(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Роль дублирована',
		})
	}, 1200)
}

const remove = (e: number) => {
	expanded.value = false
	tapes.value?.splice(e, 1)
}

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}

const [parent, tapes] = useDragAndDrop(roles.value, config)

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
		label: draggedItem.value.label + '-copy',
		expand: false,
		avatar: draggedItem.value.avatar,
		active: false,
	}
	tapes.value?.unshift(tmp)
	// tapes.value?.push(tmp)

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлена роль',
		})
	}, 1200)
}

const role = ref()

// new code **************************************
const Div = motion.div

const back = () => {
	router.push('/roles')
	expanded.value = false
}
const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}
const calcPlusClass = computed(() => {
	if (duple.value) return 'duplicate'
	if (expanded.value) return 'cl-0'
	// if (expanded.value) return `cl-${tapes.value.length}`
	return ''
})

const row = computed(() => {
	return Math.floor(tapes.value.length / 4 + 1)
})
const row1 = computed(() => {
	return tapes.value.length + 1
})
const navigate = (id: number) => {
	router.push(`/roles/${id}`)
}
const action = () => {
	if (expanded.value) {
		expanded.value = false
		activeItem.value = ''
	}
}

const draggedItem = ref()
const dragStatus = ref(false)

const setDragged = (e: any) => {
	draggedItem.value = e
	dragStatus.value = true
}
const unsetDragged = () => {
	console.log(1111)
	dragStatus.value = false
}
</script>

<template lang="pug">
q-page(padding, @click='action')
	.header Роли
	.parent(ref='parent'
		:class="{'end': expanded}"
		@click.stop='back'
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
			.temp
				q-btn(
					round,
					icon="mdi-plus",
					color="primary"
					v-motion
					:initial="{opacity: 0, rotate: -720, scale: .5}"
					:enter='{opacity: 1, rotate: 0, scale: 1}'
					:delay='500'
				) 
			// AddButtonNew(mode='role' @create='create')

		.cen( v-if='tapes.length == 0')
			Empty(mode='role')

		ItemRole(
			v-model:expanded="expanded",
			v-model:tapes='tapes',
			v-model:activeItem="activeItem",
			@navigate="navigate"
			@duplicate="duble"
			@remove="remove"
			@drag='setDragged'
			@undrag="unsetDragged"
		)

	// TrashSimple(v-model="dragStatus" @remove="remove")
</template>

<style scoped lang="scss">
.parent {
	grid-template-rows: repeat(v-bind(row), 170px);
	&.end {
		grid-template-rows: repeat(v-bind(row1), 60px);
	}
}

.header {
	font-size: 1.5rem;
	text-align: center;
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

.add {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background: #fff;
	margin-top: -1rem;
	margin-left: 5rem;
	background: hsl(199 23% 69% / 1);
}

.list {
	display: flex;
}

.plusCont {
	width: 150px;
	height: 150px;
	border-radius: var(--rad);
	display: flex;
	justify-content: center;
	align-items: center;

	&.duplicate {
		background: hsl(213 38% 81% / 1) !important;
		border: 2px dashed $primary;
	}
}

.grid {
	width: 400px;
	margin: 1rem auto 0;
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	justify-content: center;
}

.hr {
	width: 400px;
	margin: 1rem auto;
	border-top: 1px solid #dedede;
	text-align: left;
	padding-top: 1rem;
	// grid-column: 1/-1;
}
.val span {
	color: $primary;
	border-bottom: 1px dotted $primary;
}
.temp {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	border-radius: 0.5rem;
	background: #ffffff55;
}
</style>
