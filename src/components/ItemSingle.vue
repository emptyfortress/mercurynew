<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useApps } from '@/stores/apps'
import AddButton from '@/components/common/AddButton.vue'
import Trash from '@/components/common/Trash.vue'
import { useQuasar } from 'quasar'
// import AppPreview from '@/components/AppPreview.vue'
// import GroupPreview from '@/components/GroupPreview.vue'
import Item from '@/components/common/Item.vue'
import Group from '@/components/common/Group.vue'


const tapes = defineModel<App[]>('tapes')

tapes.value?.map((item) => (item.expand = false))

gsap.registerPlugin(Flip)

const $q = useQuasar()
const onDrop = (dropResult: number) => {
	tapes.value = applyDrag(tapes.value, dropResult)
	dragging.value = false
}

const expanded = ref<boolean>(false)
const groupexpanded = ref<boolean>(false)

// const expand = (item: App) => {
// 	if (item.group == 1) {
// 		const state = Flip.getState('.item, .ani')
// 		expanded.value = !expanded.value
// 		item.expand = !item.expand
// 		nextTick(() => {
// 			Flip.from(state, {
// 				duration: 0.4,
// 				ease: 'power3.inOut',
// 				targets: '.item, .ani',
// 				absolute: true,
// 				absoluteOnLeave: true,
// 				nested: true,
//
// 				onEnter: (elements) =>
// 					gsap.fromTo(
// 						elements,
// 						{ opacity: 0 },
// 						{ opacity: 1, duration: 0.6, ease: 'linear', delay: 0.2 }
// 					),
// 				onLeave: (elements) =>
// 					gsap.fromTo(elements, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'linear' }),
// 			})
// 		})
// 	} else {
// 		const state = Flip.getState('.group, .groupexpanded')
// 		groupexpanded.value = !groupexpanded.value
// 		item.expand = !item.expand
// 	}
// }

const myapps = useApps()


const emit = defineEmits(['create'])
const create = ((e: string) => {
	emit('create', e)
})

const dragging = ref(false)

const onDragLeave = (() => {
	dragging.value = true
})
const onDragEnter = (() => {
	dragging.value = false
})

watch(
	() => tapes.value?.length,
	(newval, oldval) => {
		if (oldval && newval && oldval > newval && !myapps.grouping) {
			$q.notify({
				message: 'Приложение удалено',
				color: 'negative',
				icon: 'mdi-check-bold',
				actions: [
					{ label: 'Отмена', color: 'white', handler: () => { /* ... */ } }
				]
			})
		}
		if (oldval && newval && oldval > newval && myapps.grouping) {
			$q.notify({
				message: 'Группа создана',
				color: 'positive',
				icon: 'mdi-check-bold',
				actions: [
					{ label: 'Отмена', color: 'white', handler: () => { /* ... */ } }
				]
			})
		}
	})

// const delay = ref(true)
// onMounted(() => {
// 	nextTick(() => {
// 		delay.value = false
// 	})
// })
//
// const calcDelay = (ind: number) => {
// 	return delay.value ? (300 + ind * 100) : 300
// }
// const calcLabel = ((item: any) => {
// 	return item.group > 1 ? 'Группа' : item.label
// })
const calcItem = ((group: number) => {
	return Item
	// return group == 1 ? Item : Group
})
// const item = tapes.value[0]
</script>

<template lang="pug">
Container(@drop="onDrop"
	@drag-leave='onDragLeave'
	@drag-enter='onDragEnter'
	orientation='horizontal'
	group-name='column'
	:remove-on-drop-out='true'
	:tag="{ value: 'div', props: { class: 'list' } }")

	Draggable(v-for="(item, index) in tapes"
		:key="item.id")

		component(:is='calcItem(item.group)'
			v-model="tapes[index]"
			:index='index'
			)

	AddButton(@create='create' mode='app')

	// GroupPreview(:expanded="groupexpanded")

	// Trash(:dragging="dragging")

</template>

<style scoped lang="scss">
.smooth-dnd-container.horizontal.list {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-items: start;
	align-items: center;

}
</style>
