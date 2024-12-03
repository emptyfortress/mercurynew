<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import LibContent from '@/components/LibContent.vue'
import { usePanels } from '@/stores/panels'

const panels = usePanels()

gsap.registerPlugin(Flip)

const button = ref<HTMLElement>()
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
	panels.setLeft(false)
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
.button(ref='button'
	:class='{expand: panels.left}'
	@click='expand'
	)
	q-icon(v-if='!panels.left'
		v-motion
		:initial='{rotate: "0deg"}'
		:hovered='{rotate: "90deg"}'
		name="mdi-bookshelf"
		color="primary"
		size='28px')

	q-btn.close(flat round v-if='panels.left' size="sm"
		v-motion
		:initial='{opacity: 0}'
		:enter='{opacity: 1}'
		:delay='500'
		icon='mdi-close' @click.stop='close')

	LibContent(v-if='panels.left')

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
	left: -58px;
	text-align: center;
	padding: 0.6rem;
	cursor: pointer;
	&.expand {
		width: 385px;
		height: calc(100vh - 120px);
		left: -395px;
		border-radius: 6px;
	}
}
.close {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
}
</style>
