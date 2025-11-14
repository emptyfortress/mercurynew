<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useRouter, useRoute } from 'vue-router'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useApps } from '@/stores/apps'
import AddButtonNew1 from '@/components/common/AddButtonNew1.vue'
import { uid, useQuasar } from 'quasar'
import MdiApplicationBracesOutline from '@/components/icons/MdiApplicationBracesOutline.vue'
import Empty from '@/components/Empty.vue'
import { useKeyModifier } from '@vueuse/core'

const MdiApplicationBracesOutline1 = markRaw(MdiApplicationBracesOutline)
const myapps = useApps()
const router = useRouter()
const route = useRoute()
const shift = useKeyModifier('Shift', { initial: false })

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
	onSort: (event: any) => myapps.updateApps(event.values),
}

const [parent, tapes] = useDragAndDrop(myapps.apps, config)

const go = (id: string) => {
	router.push(`/${id}`)
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
	return ''
})

const calcStyle = computed(() => {
	return myapps.groupDrag ? 'outline: 3px dotted #143c5f;' : ''
})

const dragged = ref<App | null>(null)
const startDrag = (e: any) => {
	dragged.value = e
}
</script>

<template lang="pug">
q-page(padding)
	.parent(ref='parent')

		.plus(
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

		.it(
			v-for="item in tapes",
			:key='item.id'
			@click='go(item.id)'
		) {{ item.id }}
	
		// ItemReduced(
		// 	v-model:tapes='tapes',
		// 	v-model:activeItem="activeItem",
		// 	:shift="shift"
		// )

		// Item(
		// 	v-model:tapes='tapes',
		// 	v-model:activeItem="activeItem",
		// 	@navigate="navigate"
		// 	@createGroup='createGroup'
		// 	@drag='startDrag'
		// 	@duplicate="duble"
		// 	:shift="shift"
		// )

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
.ite {
	background: #fff;
}
</style>
