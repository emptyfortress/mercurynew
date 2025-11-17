<script setup lang="ts">
import { ref, nextTick, onMounted, computed } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'
import { useApps } from '@/stores/apps'
import { useRouter, useRoute } from 'vue-router'

const myapps = useApps()
const router = useRouter()
const route = useRoute()
const dragging = ref(false)
const dragId = ref<null | string>(null)

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
	onSort: (event: any) => {
		myapps.updateApps(event.values)
	},
	onDragstart: (event: any) => {
		dragging.value = true
	},
	onDragend: async (event: any) => {
		console.log(event)
		dragging.value = false
		console.log('end')
		await nextTick()
		const activeEl = parent.value?.querySelector('.it.selected')
		if (activeEl) {
			moveIndicator(activeEl)
		}
	},
}

const [parent, tapes] = useDragAndDrop(myapps.apps, config)

const selected = ref<null | string>(null)
const indicator = ref<null | HTMLElement>(null)

function select(id: string, event: any) {
	router.push(`/${id}`)
	selected.value = id
	const curApp = tapes.value.find((el: App) => el.id == id)
	if (curApp) {
		myapps.setCurrentApp(curApp)
	}
	moveIndicator(event.currentTarget)
}

function moveIndicator(el: any) {
	const rect = el.getBoundingClientRect()
	const parentRect = parent.value?.getBoundingClientRect()

	indicator.value!.style.transform = `translateY(${rect.top - parentRect!.top}px)`
	// indicator.value!.style.height = `${rect.height}px`
}

onMounted(async () => {
	await nextTick()
	const activeEl = parent.value?.querySelector('.it.selected')
	if (activeEl) {
		moveIndicator(activeEl)
	}
})

const showIndicator = computed(() => {
	return true
})
</script>

<template lang="pug">
div
	.plus
		q-btn(unelevated round icon="mdi-plus" color="primary") 
	.list(ref='parent')
		.it(
			v-for="item in tapes",
			:key='item.id',
			@click="select(item.id, $event)",
			:class="{ selected: item.id === route.params.id }"
		) {{ item.label }}

			.img(v-if='item.group == 1')
				component(:is='item.pic')

		.indicator(ref='indicator' v-show='showIndicator')
</template>

<style scoped lang="scss">
.list {
	position: relative;
}
.it {
	background: #fff;
	padding: 0.5rem;
	margin-bottom: 0.8rem;
	height: 90px;
	cursor: pointer;
	transition: background-color 0.2s ease;
}
.indicator {
	position: absolute;
	left: -16px;
	top: -4px;
	width: calc(100% + 22px);
	height: 98px;
	background: var(--violet);
	border-radius: 0.5rem;
	z-index: -1;

	/* Главное — плавное движение */
	transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.plus {
	width: 100%;
	height: 80px;
	background: rgba(255, 255, 255, 0.4);
	border-radius: 0.5rem;
	margin-bottom: 0.7rem;
	display: flex;
	justify-content: center;
	align-items: center;
	&:hover {
		box-shadow: var(--shad0);
	}
}
</style>
