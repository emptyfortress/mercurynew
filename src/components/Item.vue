<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import AppPreviewNew from '@/components/AppPreviewNew.vue'
import GroupInsidePreview from '@/components/GroupInsidePreview.vue'
import IconMenu from '@/components/IconMenu.vue'

const expanded = defineModel('expanded')
const tapes = defineModel<App[]>('tapes')
const activeItem = defineModel<string>('activeItem')

const Div = motion.div

const emit = defineEmits(['navigate', 'createGroup'])

const action = (item: App) => {
	if (activeItem.value !== '' && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = ''
	} else {
		expanded.value = true
		activeItem.value = item.id
	}
}

const calcClass = (item: App, index: number) => {
	if (expanded.value && activeItem.value == item.id && item.group > 1) return 'active group'
	if (expanded.value && activeItem.value == item.id) return 'active'
	if (item.group > 1) return 'group'
	return ''
}

const initial = {
	opacity: 0,
	y: 20,
}

const animate = {
	opacity: 1,
	y: 0,
}

const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}

const overGroup = ref(false)

const draggedItem = ref()
const dragIndex = ref<number | null>(null)

const onDragStart = (item: App, n: number) => {
	draggedItem.value = item
	dragIndex.value = n
}

const onDragEnter = (app: App) => {
	if (activeItem.value == app.id && draggedItem.value?.group == 1) {
		overGroup.value = true
	}
}
const onDragLeave = () => {
	overGroup.value = false
}

const onDrop1 = (el: App, n: number) => {
	if (el.id == draggedItem.value?.id || draggedItem.value?.group > 1) return
	if (el.group > 1) {
		el.list.push(draggedItem.value)
	}
	if (el.id !== activeItem.value) return
	emit('createGroup', el, draggedItem.value)
	overGroup.value = false
	draggedItem.value = null
}

const remove = (el: App) => {
	const ind = tapes.value?.findIndex((item) => item.id == el.id)
	if (ind !== undefined) {
		tapes.value?.splice(ind, 1)
		expanded.value = false
	}
}

const calcGhost = computed(() => {
	let ind = tapes.value?.findIndex((item) => item.id == activeItem.value)

	if (ind !== -1) {
		return `cl-${ind}`
	}
	return ''
})

const label = computed(() => {
	let item = tapes.value?.find((el) => el.id == activeItem.value)
	if (item) return item.label
	return ''
})

const setIcon = (icon: any) => {
	let item = tapes.value?.find((el) => el.id == activeItem.value)
	if (item) {
		item.pic = icon
	}
}

function stopClick(item: App, event: MouseEvent) {
	if (item.id === activeItem.value) {
		event.stopPropagation()
	}
}
</script>

<template lang="pug">
Div.it(v-for="(item, index) in tapes", :key="item.id",
	@click.stop='action(item)',
	:layout-id="item.id"
	:class='calcClass(item, index)'
	:initial="initial"
	:animate="animate"
	:transition="spring"
	@dragstart='onDragStart(item, index)'
	@dragenter='onDragEnter(item)'
	@dragover.prevent
	@dragleave='onDragLeave'
	@drop='onDrop1(item, draggedItem)'
)
	.createGroup(v-if='item.group < 2 && activeItem == item.id && overGroup')
		div Создать группу приложений


	template(v-else)

		template(v-if='expanded && item.id == activeItem')
			.head
				span(@click.stop) {{ item.label }}
					q-popup-edit(v-model="item.label" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
		template(v-else)
			span {{ item.label }}


		AppPreviewNew(
			v-if='activeItem == item.id && item.group == 1'
			:item='item',
			@remove='remove'
		)

		GroupInsidePreview(
			v-if='activeItem == item.id && item.group > 1'
			v-model:list="item.list"
			@removeGroup='remove(item)'
		)

		.img(v-if='item.group == 1' @click='stopClick(item, $event)')
			component(:is='item.pic')
			IconMenu(@select='setIcon' :icon='item.pic.name')


		template(v-if='item.group > 1 && activeItem !== item.id')
			.img1
				component(:is='el.pic' v-for="el in item.list" :key="el.id")

.ghostItem(
	v-if='expanded',
	:class='calcGhost'
	@click.stop
)
	div {{ label }}
	
</template>

<style scoped lang="scss">
.img1 {
	bottom: 0.5rem;
	left: 0.8rem;
	font-size: 1.5rem;
}
.createGroup {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: var(--ghost);
	width: 100%;
	height: 100%;
	border-radius: 0.25rem;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.3rem;
	color: $primary;
}
.ghostItem {
	height: 100%;
	background: var(--ghost);
	border-radius: 0.5rem;
	box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.15);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.7rem;
	color: hsl(212 38% 53% / 1);
}
.head span {
	color: $primary;
	border-bottom: 1px dotted $primary;
	cursor: pointer;
}
</style>
