<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { usePanels } from '@/stores/panels'
import BpmnInfo from '@/components/panels/BpmnInfo.vue'
import TimelineInfo from '@/components/panels/TimelineInfo.vue'
import CloseButton from '@/components/panels/CloseButton.vue'
import TopButton from '@/components/panels/TopButton.vue'
import { useSelectionStore } from '@/stores/selection'
import { storeToRefs } from 'pinia'

const selectionStore = useSelectionStore()
const { current } = storeToRefs(selectionStore)

const panels = usePanels()

gsap.registerPlugin(Flip)

const emit = defineEmits(['activate', 'stop'])

const expand = () => {
	const state = Flip.getState('.button')
	emit('activate')
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			delay: 0.2,
		})
	})
}

const close = () => {
	emit('stop')
	const state = Flip.getState('.button')
	panels.setRight0(false)
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			delay: 0.2,
		})
	})
}
</script>

<template lang="pug">
.button(
	:class='{ expand: panels.right0 }'
	@click='expand'
	)

	q-icon.ic(v-if='!panels.right0'
		name="mdi-information-outline"
		color="primary"
		size='24px')

	CloseButton(v-model="panels.right0" @close="close")

	TopButton(v-model="panels.right0" @close='close')

	div(v-if="panels.right0 && !!current"
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1 }'
		:delay='600')

		BpmnInfo(v-if="current.kind === 'bpmn'")
		TimelineInfo(v-else-if="current.kind === 'timeline'")

	div(v-if="panels.right0 && !current"
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1 }'
		:delay='600')

		.grid
			.zag Ход процесса
			label Процесс начат:
			div 22.09.25 13:07
			label Инициатор:
			div Орлов П.С.
			label Длительность:
			div 14 дней
			label Текущий этап:
			.link Рассмотреть заявку
			label Просрочено:
			.link1 Согласовать заявку

</template>

<style scoped lang="scss">
.button {
	width: 48px;
	height: 48px;
	background: #fff;
	box-shadow: var(--shad0);
	border-radius: 24px;
	position: absolute;
	top: 0;
	right: -58px;
	text-align: center;
	cursor: pointer;
	.ic {
		margin-top: 11px;
	}

	&.expand {
		width: 350px;
		height: calc(100vh - 120px);
		right: -358px;
		border-radius: 6px;
		cursor: default;
	}
}
.grid {
	padding: 1rem;
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
label {
	color: #666;
}
.zag {
	grid-column: 1/-1;
	width: 100%;
	font-weight: 600;
}
.link {
	color: $primary;
	text-decoration: underline;
}
.link1 {
	color: $negative;
	text-decoration: underline;
}
</style>
