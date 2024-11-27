<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
// import { useMotion } from '@vueuse/motion'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

const button = ref<HTMLElement>()
const emit = defineEmits(['activate', 'stop'])

const calcH = computed(() => {
	return 'calc(100vh - 120px)'
})

// const { apply: btAnim, stop } = useMotion(button, {
// 	initial: {
// 		right: -58,
// 		height: '48px',
// 		width: '48px',
// 		borderRadius: '50%',
// 	},
// 	active: {
// 		right: -360,
// 		width: '348px',
// 		height: '800px',
// 		borderRadius: '8px',
// 		transition: { delay: 600 },
// 	},
// })

const setActive = async () => {
	emit('activate')
	await btAnim('active')
	stop()
}

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
		name="mdi-tune-vertical-variant"
		color="primary"
		size='24px')
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
</style>
