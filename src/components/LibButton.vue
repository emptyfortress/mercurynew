<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import LibContent from '@/components/LibContent.vue'

gsap.registerPlugin(Flip)

const button = ref<HTMLElement>()
const emit = defineEmits(['activate', 'stop'])

const calcH = computed(() => {
	return 'calc(100vh - 120px)'
})

const expanded = ref<boolean>(false)

const expand = (item: any) => {
	expanded.value ? emit('stop') : emit('activate')
	const state = Flip.getState('.button')
	expanded.value = !expanded.value
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
	expanded.value = !expanded.value
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
	:class='{expand: expanded}'
	@click='expand'
	)
	q-icon(v-if='!expanded'
		v-motion
		:initial='{rotate: "0deg"}'
		:hovered='{rotate: "90deg"}'
		name="mdi-bookshelf"
		color="primary"
		size='28px')

	q-btn.close(flat round v-if='expanded' size="sm"
		v-motion
		:initial='{opacity: 0}'
		:enter='{opacity: 1}'
		:delay='500'
		icon='mdi-close' @click.stop='close')

	LibContent(v-if='expanded')

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
