<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { motion } from 'motion-v'
import AppPreviewNew from '@/components/AppPreviewNew.vue'
import GroupInsidePreview from '@/components/GroupInsidePreview.vue'
import IconMenu from '@/components/IconMenu.vue'
import { uid, useQuasar } from 'quasar'

const expanded = defineModel('expanded')
const tapes = defineModel<App[]>('tapes')
const activeItem = defineModel<string>('activeItem')

const props = defineProps({
	shift: {
		type: Boolean,
		required: true,
		default: false,
	},
})

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

const onDragEnter = (app: App, index: number) => {
	if (props.shift) {
		hoverItem.value = app
		hoverIndex.value = index
		overItem.value = true
	}
	if (
		activeItem.value == app.id &&
		draggedItem.value?.group == 1 &&
		draggedItem.value?.id !== app.id
	) {
		overGroup.value = true
	}
}
const onDragLeave = () => {
	overGroup.value = false
	hoverIndex.value = 100
}

const $q = useQuasar()
const onDrop1 = (el: App, n: number) => {
	if (hoverIndex.value == dragIndex.value) return
	if (props.shift == true) {
		let tmp = {} as App
		if (hoverItem.value.group == 1) {
			tmp.id = uid()
			tmp.label = 'Группа'
			tmp.descr = ''
			tmp.expand = false
			tmp.version = ''
			tmp.author = ''
			tmp.group = 1
			tmp.list = []
		} else tmp = hoverItem.value

		tmp.group = 2
		tmp.list.push(hoverItem.value)
		tmp.list.push(draggedItem.value)

		tapes.value?.splice(hoverIndex.value, 1, tmp)
		tapes.value?.splice(dragIndex.value, 1)

		draggedItem.value = 100
		hoverItem.value = 100
		overItem.value = false
		setTimeout(() => {
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'positive',
				message: 'Создана группа приложений',
			})
		}, 1200)
	}

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
	@dragstart='onDragStart(item, index)'
	@dragenter.prevent
	@dragover.prevent='onDragEnter(item, index)'
	@dragleave='onDragLeave'
	@drop='onDrop1(item, draggedItem)'
)
	.ttt(v-if='!isOver(item)')
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
			@duplicate='duble'
		)

		q-btn.addAbs(v-if='activeItem == item.id && item.group > 1' flat round icon="mdi-plus-circle" color="primary" @click.stop) 
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

	.createGroup(v-if='isOver(item)')
		div Создать группу приложений

.ghostItem(ref='ghostItem'
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
	// font-size: 1.5rem;
}

.parent.end .it.active {
	width: 650px;
	min-height: 400px;
	padding: 0;
	.ttt {
		width: 100%;
		height: 100%;
		padding: 1rem;
	}
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
	border-radius: 0.5rem;
	border: 1px dashed $secondary;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.7rem;
	color: hsl(212 38% 53% / 1);
}
.head {
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
.addAbs {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
}

.drop {
	outline: 3px dashed $primary;
}
.dropGroup {
	outline: 3px dashed $primary;
}
</style>
