<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { motion } from 'motion-v'
import { useSave } from '@/stores/save'
import { storeToRefs } from 'pinia'
import Fa7SolidDigging from '@/components/icons/Fa7SolidDigging.vue'
import { useChangesStore } from '@/stores/changes'

interface PanEvent {
	isFirst?: boolean
	isFinal?: boolean
	delta?: { x?: number; y?: number }
}

const saveStore = useSave()
const { notsave } = storeToRefs(saveStore)
const changesStore = useChangesStore()
const { hasChanges } = storeToRefs(changesStore)

const route = useRoute()
const fab = ref()
const hide = () => {
	fabOpened.value = false
}
const unhide = () => {
	saveStore.toggle()
}

const fabOpened = ref(true)

const fabPos = ref([58, 18])
const draggingFab = ref(false)

const moveFab = (ev: PanEvent) => {
	draggingFab.value = ev.isFirst !== true && ev.isFinal !== true
	const dx = ev.delta?.x ?? 0
	const dy = ev.delta?.y ?? 0
	fabPos.value = [fabPos.value[0] - dx, fabPos.value[1] - dy]
}

const handleSaveChanges = () => {
	fabOpened.value = false
	// Future save logic goes here
}
const handleCancelChanges = () => {
	fabOpened.value = false
	// Future cancel/revert logic goes here
}

const Div = motion.div
const initial = {
	opacity: 0,
	y: -120,
}
const animate = {
	opacity: 1,
	y: 0,
}
const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.5,
}
</script>

<template lang="pug">
q-page-sticky(v-if='route.meta.save && hasChanges' position="bottom-right" :offset="fabPos")
	Div(
		:initial="initial"
		:animate="animate"
		:transition='spring'
		)
		q-fab(ref='fab'
			v-model="fabOpened"
			color="primary"
			direction="up"
			:class="{ notsave: notsave }"
			:disable="draggingFab"
			v-touch-pan.prevent.mouse="moveFab"
		)
			template(v-slot:icon="{ opened }")
				q-icon(
					v-if="!notsave"
					:class="{ 'example-fab-animate--hover': opened !== true }"
					name="keyboard_arrow_up"
				)
				Fa7SolidDigging.ic(v-else)

			template(v-slot:active-icon="{ opened }")
				q-icon(
					:class="{ 'example-fab-animate': opened === true }"
					name="close"
				)

			.bubble(v-if="notsave")
				.text-center
					| Страница заблокирована другим пользователем. Сохранить изменения нельзя.
					q-btn(unelevated color="pink-8" label="Подождать" @click.stop="hide" size='sm')
					q-btn(unelevated color="pink-8" label="Снять блокировку" @click.stop="unhide" size='sm')

			template(v-else)
				q-fab-action(color="primary" label="Сохранить" @click.stop='handleSaveChanges')
				q-fab-action(color="primary" label="Отменить изменения" @click.stop='handleCancelChanges')
				q-fab-action(color="primary" icon='lightbulb' label='Помощь' @click.stop='handleCancelChanges')
</template>

<style scoped lang="scss">
.pos {
	position: fixed;
	bottom: 3rem;
	right: 13rem;
}
.save {
	background: $primary;
	color: white;
	&:hover {
		background: $positive;
	}
}
.undo {
	position: absolute;
	top: 7px;
	left: -26px;
	background: $primary;
	color: white;
	&:hover {
		background: $positive;
	}
}
.notsave {
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(180, 0, 255, 0.9);
	}
	70% {
		box-shadow: 0 0 0 20px rgba(180, 0, 255, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(180, 0, 255, 0);
	}
}
.ic {
	font-size: 2rem;
	margin-top: -3px;
	margin-left: -3px;
}
.bubble {
	width: 42ch;
	position: absolute;
	top: -103px;
	left: -250px;
	border-radius: 0.4rem;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
	padding: 0.5rem;
	font-size: 0.9rem;
	color: white;
	background: $negative;
}
</style>
