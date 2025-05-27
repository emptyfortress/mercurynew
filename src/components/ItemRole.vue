<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { motion } from 'motion-v'
// import AppPreviewNew from '@/components/AppPreviewNew.vue'
// import GroupInsidePreview from '@/components/GroupInsidePreview.vue'
import IconMenu from '@/components/IconMenu.vue'
import { uid, useQuasar } from 'quasar'

const expanded = defineModel('expanded')
const tapes = defineModel<any[]>('tapes')
const activeItem = defineModel<string>('activeItem')

const Div = motion.div

const emit = defineEmits(['navigate', 'createGroup', 'duplicate'])

const action = async (item: App) => {
	if (activeItem.value !== '' && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = ''
	} else {
		expanded.value = true
		activeItem.value = item.id

		await nextTick()
		ghostItem.value.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
	}
}

const calcClass = (item: App, index: number) => {
	if (expanded.value && activeItem.value == item.id && item.group > 1) return 'active group'
	if (expanded.value && activeItem.value == item.id) return 'active'
	if (
		item.group > 1 &&
		overItem.value &&
		hoverIndex.value !== dragIndex.value &&
		hoverIndex.value == index
	)
		return 'drop'
	if (item.group > 1) return 'group'
	if (overItem.value && hoverIndex.value !== dragIndex.value && hoverIndex.value == index)
		return 'drop'
	return ''
}

const initial = {
	opacity: 0,
	y: -20,
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
const dragIndex = ref<number>(100)
const overItem = ref(false)

const hoverItem = ref()
const hoverIndex = ref<number>(100)

const onDragStart = (item: App, n: number) => {
	draggedItem.value = item
	dragIndex.value = n
}

const $q = useQuasar()

const calcGhost = computed(() => {
	let ind = tapes.value?.findIndex((item) => item.id == activeItem.value)

	if (ind !== -1) {
		return `cl-${ind! + 1}`
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

const ghostItem = ref()

const isOver = (item: App) => {
	return overGroup.value && activeItem.value == item.id && item.group == 1
}
const duble = (e: App) => {
	emit('duplicate', e)
}
const calcIcon = (e: string) => {
	return `mdi-numeric-${e}-circle-outline`
}

const visibleItems = (items: any) => {
	return items.length <= 4 ? items : items.slice(0, 3)
}
const hasOverflow = (items: any) => items.length > 4

const calcItemClass = (item: App, id: number) => {
	return item.version == id.toString() ? 'selected' : ''
}
</script>

<template lang="pug">
Div.it(v-for="(item, index) in tapes", :key="item.id",
	@click.stop='action(item)',
	:layout-id="item.id"
	:initial="initial"
	:animate="animate"
	:transition="spring"
	:data-group="item.group > 1 ? 'true' : 'false'"
	:class='calcClass(item, index)'
)
	.ttt(v-if='!isOver(item)')
		template(v-if='expanded && item.id == activeItem')
			.head
				span(@click.stop) {{ item.label }}
					q-popup-edit(v-model="item.label" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")

		template(v-else)
			span {{ item.label }}

		// AppPreviewNew(
			v-if='activeItem == item.id && item.group == 1'
			:item='item',
			@remove='remove'
			@duplicate='duble'
			)

		.img(v-if='item.group == 1' @click='stopClick(item, $event)')
			component(:is='item.pic')
			IconMenu(@select='setIcon' :icon='item.pic.name')

.ghostItem(ref='ghostItem'
	v-if='expanded',
	:class='calcGhost'
	@click.stop
)
	div {{ label }}
	
</template>

<style scoped lang="scss">
.grid-item {
	height: 55px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 2rem;
	color: var(--icon);
}

.parent.end .it.active {
	width: 680px;
	min-height: 380px;
	padding: 0;
	top: 125px;
	.ttt {
		width: 100%;
		height: 100%;
		padding: 1rem;
	}
}

.ghostItem {
	height: 100%;
	border-radius: 0.5rem;
	border: 1px dashed $secondary;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.7rem;
	color: hsl(212 38% 53% / 1);
}
.head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	span {
		color: $primary;
		border-bottom: 1px dotted $primary;
		cursor: pointer;
	}
}
.fuc {
	width: 100%;
	height: 100%;
	background: #ccc;
}

.to {
	position: absolute;
	bottom: 1rem;
	left: 50%;
	transform: translateX(-50%);
}
.selected {
	background: var(--selection);
}
</style>
