<script setup lang="ts">
import { ref, computed, watch, onMounted, onUpdated, markRaw } from 'vue'
import { motion } from 'motion-v'
import { animations } from '@formkit/drag-and-drop'
import { StagePlaySpotlight, StagePlayScene } from 'vue-stage-play'
import MyTour from '@/components/MyTour.vue'
import { useRouter, useRoute } from 'vue-router'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useApps } from '@/stores/apps'
import Item from '@/components/Item.vue'
import AddButtonNew1 from '@/components/common/AddButtonNew1.vue'
import { uid, useQuasar } from 'quasar'
import MdiApplicationBracesOutline from '@/components/icons/MdiApplicationBracesOutline.vue'
import Empty from '@/components/Empty.vue'
import { useKeyModifier } from '@vueuse/core'
import { spring } from '@/utils/springConstants'
import LoaderSkeleton from '@/components/LoaderSkeleton.vue'

const MdiApplicationBracesOutline1 = markRaw(MdiApplicationBracesOutline)
const myapps = useApps()
const router = useRouter()
const route = useRoute()
const activeItem = ref('')
const shift = useKeyModifier('Shift', { initial: false })

// NEW: loading flag
const loading = ref(false)

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
		let app = myapps.apps.find((el) => el.id == activeItem.value)
		if (app) {
			myapps.setCurrentApp(app)
		}
	} else {
		activeItem.value = ''
		expanded.value = false
	}
}
// Загружаем состояние при монтировании компонента
onMounted(() => {
	loadStateFromRoute()
	// Show loader on every visit to main route if enabled
	if (route.path === '/' && myapps.showLoader) {
		loading.value = true
		setTimeout(() => {
			loading.value = false
		}, 2500)
	} else {
		loading.value = false
	}
})

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
		created: 1755513353568,
		published: 0,
		group: e.group,
		list: [],
		pic: e.pic,
		master: true,
		versions: [
			{
				id: 0,
				label: 'Базовая версия',
				value: 'Базовая версия',
				descr: 'Стартовая версия приложения',
				created: 1755513353568,
				author: 'Орлов П.С.',
				modified: null,
				published: 0,
				current: true,
			},
		],
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
		label: 'Копия приложения ' + e.label,
		descr: e.description,
		expand: false,
		over: false,
		version: '1',
		author: 'Орлов П.С.',
		created: 1755513353568,
		published: 0,
		group: e.group,
		list: [],
		pic: e.pic,
		master: false,
		versions: [
			{
				id: 0,
				label: 'Базовая версия',
				value: 'Базовая версия',
				descr: 'Стартовая версия приложения',
				author: 'Орлов П.С.',
				created: 1755513353568,
				modified: null,
				published: 0,
				current: true,
			},
		],
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
		label: dragged.value!.label + '-copy',
		descr: dragged.value!.descr,
		expand: false,
		over: false,
		version: '1',
		author: 'Орлов П.С.',
		created: 1755513353568,
		published: 0,
		group: 1,
		list: [],
		pic: MdiApplicationBracesOutline1,
		master: false,
		versions: [] as Ver[],
	}
	tmp.versions.push(dragged.value!.versions[0])
	tapes.value?.unshift(tmp)

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

const createGroup = (one: any, two: any) => {
	const tmp = {
		id: uid(),
		label: one.label,
		descr: one.descr,
		version: one.version,
		expand: false,
		author: one.author,
		created: one.created,
		published: 0,
		group: 1,
		pic: one.pic,
		list: [],
		versions: one.versions,
	}
	const tmp1 = {
		id: uid(),
		label: two.label,
		descr: two.descr,
		version: two.version,
		expand: false,
		author: two.author,
		created: two.created,
		published: 0,
		group: 1,
		pic: two.pic,
		list: [],
		versions: two.versions,
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

const dragged = ref<App | null>(null)
const startDrag = (e: any) => {
	dragged.value = e
}
</script>

<template lang="pug">
q-page(padding, @click='action')
	//- Loader overlay using LoaderSkeleton component
	LoaderSkeleton(v-if="loading" paddingTop='42px')
	StagePlaySpotlight

	.parent(ref='parent'
		:class="{'end': expanded}"
		@click.stop='back'
		:style='calcStyle'
	)
		StagePlayScene(:act-name="'home-tour'" :scene="1")
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
			template(#voiceOver="scopedProps")
				MyTour(
					:title="'Шаг 1: Добавление'"
					:content="'Здесь вы можете добавить новое приложение или группу.'"
					:has-prev-scene="scopedProps.hasPrevScene"
					:has-next-scene="scopedProps.hasNextScene"
					@prev="scopedProps.prevScene()"
					@next="scopedProps.nextScene()"
					@done="scopedProps.cut()"
				)

		.cen( v-if='tapes.length == 0')
			Empty(mode='app')
		
		StagePlayScene(:act-name="'home-tour'" :scene="2")
			Item(
				v-model:expanded="expanded"
				v-model:tapes='tapes'
				v-model:activeItem="activeItem"
				@navigate="navigate"
				@createGroup='createGroup'
				@drag='startDrag'
				@duplicate="duble"
				:shift="shift"
			)
			template(#voiceOver="scopedProps")
				MyTour(
					:title="'Шаг 2: Рабочая область'"
					:content="'Это ваша основная рабочая область, где находятся все приложения. Вы можете перетаскивать их, чтобы изменить порядок.'"
					:has-prev-scene="scopedProps.hasPrevScene"
					:has-next-scene="scopedProps.hasNextScene"
					@prev="scopedProps.prevScene()"
					@next="scopedProps.nextScene()"
					@done="scopedProps.cut()"
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
.par1 {
	margin-top: 1rem;
	width: 1100px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: repeat(6, 170px);
	gap: 1rem;
	// justify-content: center;
	// align-items: center;
	.bl {
		display: flex;
		justify-content: center;
		align-items: center;
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
