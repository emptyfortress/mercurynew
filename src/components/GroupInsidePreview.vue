<script setup lang="ts">
import { ref } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations, state } from '@formkit/drag-and-drop'
import { useRouter, useRoute } from 'vue-router'
import { motion } from 'motion-v'
import { onDropOutside } from '@/utils/useDropOutside'
import { useApps } from '@/stores/apps'

// const list = defineModel<App[] | undefined>('list')
const props = defineProps<{
	list: App[]
}>()

const myapps = useApps()
const router = useRouter()
const route = useRoute()
const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	group: 'items',
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}

const Div = motion.div
const [parent, tapes] = useDragAndDrop(props.list, config)

const navigate = (id: string) => {
	router.push(`/folder/${route.params.id}/${id}`)
}

const calcIdNew = (item: App) => {
	return item.id
}

const draggedItemIndex = ref(100)
const draggedItem = ref<App | null>(null)

const onDragStart = (e: App, n: number) => {
	draggedItemIndex.value = n
	draggedItem.value = e
}

onDropOutside(parent, (event) => {
	tapes.value.splice(draggedItemIndex.value, 1)
	if (!!draggedItem.value) {
		myapps.createApp(draggedItem.value)
	}
})
</script>

<template lang="pug">
.parent(ref='parent')
	Div.it(v-for="(item, index) in tapes", :key="item.id",
		:layout-id='calcIdNew(item)'
		@click.stop='navigate(item.id)',
		@dragstart='onDragStart(item, index)'
	)
		span {{ item.label }}

		.img()
			component(:is='item.pic')
</template>

<style scoped lang="scss">
.parent {
	width: 615px;
}
</style>
