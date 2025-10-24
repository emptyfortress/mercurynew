<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { motion } from 'motion-v'

interface PanEvent {
	isFirst?: boolean
	isFinal?: boolean
	delta?: { x?: number; y?: number }
}

const route = useRoute()
const fab = ref()
const hide = () => {
	fabOpened.value = false
}

const save = ref(true)
const notsave = ref(false)
const close = () => {
	save.value = !save.value
}

const fabOpened = ref(false)

const fabPos = ref([58, 18])
const draggingFab = ref(false)

const moveFab = (ev: PanEvent) => {
	draggingFab.value = ev.isFirst !== true && ev.isFinal !== true
	const dx = ev.delta?.x ?? 0
	const dy = ev.delta?.y ?? 0
	fabPos.value = [fabPos.value[0] - dx, fabPos.value[1] - dy]
}

const Div = motion.div
const initial = {
	opacity: 0,
	y: 120,
}
const animate = {
	opacity: 1,
	y: 0,
}
const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.5,
	delay: 2,
}
</script>

<template lang="pug">
q-page-sticky(v-if='route.meta.save' position="bottom-right" :offset="fabPos")
	Div(
		:initial="initial"
		:animate="animate"
		:transition='spring'
		)
		q-fab(ref='fab'
			v-model="fabOpened"
			color="primary"
			direction="up"
			glossy
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
				q-avatar.act(v-else size="32px" color="positive" text-color="white")
					| РЛ

			template(v-slot:active-icon="{ opened }")
				q-icon(
					:class="{ 'example-fab-animate': opened === true }"
					name="close"
				)

			.bubble(v-if="notsave")
				.text-center
					| Страница заблокирована другим пользователем. Сохранить изменения нельзя.
					q-btn(flat label="Понятно" @click.stop="hide")

			template(v-else)
				q-fab-action(color="primary" label="Сохранить" @click.stop='')
				q-fab-action(color="primary" label="Отменить изменения" @click.stop='')
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
</style>
