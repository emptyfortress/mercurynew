<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useRouter } from 'vue-router'
import LibContent from '@/components/LibContent.vue'

const router = useRouter()

gsap.registerPlugin(Flip)

const button = ref<HTMLElement>()
const emit = defineEmits(['activate', 'stop'])

const expanded = ref<boolean>(false)

const expand = () => {
	if (expanded.value) return
	emit('activate')
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

const next = () => {
	router.push('/form')
}
</script>

<template lang="pug">
.button(ref='button'
	:class='{expand: expanded}'
	@click='expand'
	)
	q-icon(v-if='!expanded'
		v-motion
		:initial='{opacity: 0, rotate: "0deg"}'
		:enter='{opacity: 1, rotate: "0deg",}'
		:hovered='{rotate: "90deg", }'
		name="mdi-tune-vertical-variant"
		color="primary"
		size='24px')

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
	right: -58px;
	text-align: center;
	padding: 0.6rem;
	cursor: pointer;
	&.expand {
		width: 385px;
		height: calc(100vh - 120px);
		right: -395px;
		border-radius: 6px;
	}
}
.next {
	position: absolute;
	top: 20rem;
	left: 4rem;
}
.close {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
}
</style>
