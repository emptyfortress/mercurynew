<script setup lang="ts">
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations, state } from '@formkit/drag-and-drop'
import { useRouter, useRoute } from 'vue-router'

// const list = defineModel<App[] | undefined>('list')
const props = defineProps<{
	list: App[]
}>()

const router = useRouter()
const route = useRoute()
const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}

const [parent, tapes] = useDragAndDrop(props.list, config)

const navigate = (id: string) => {
	router.push(`/folder/${route.params.id}/${id}`)
}

// const calcId = computed(() => {
// 	return route.params.id.toString()
// 	// return 'list'
// })
</script>

<template lang="pug">
.parent(ref='parent')
	.it(v-for="(item, index) in tapes", :key="item.id",
		layout,
		@click.stop='navigate(item.id)',
	)
		span {{ item.label }}

		.img()
			component(:is='item.pic')
</template>

<style scoped lang="scss"></style>
