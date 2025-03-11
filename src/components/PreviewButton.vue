<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useRouter } from 'vue-router'
import { usePanels } from '@/stores/panels'
// import DiagProps from '@/components/panels/DiagProps.vue'
import CloseButton from '@/components/panels/CloseButton.vue'

const router = useRouter()
const panels = usePanels()

gsap.registerPlugin(Flip)

const emit = defineEmits(['activate', 'stop'])

// const expanded = ref<boolean>(false)

const expand = () => {
	const state = Flip.getState('.button')
	emit('activate')
	panels.setPreview(true)
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
	panels.setPreview(false)
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
.button(
	:class='{ expand: panels.preview }'
	@click='expand'
	)

	q-icon(v-if='!panels.preview'
		v-motion
		:initial='{ opacity: 0, rotate: "0deg" }'
		:enter='{ opacity: 1, rotate: "0deg", }'
		:hovered='{ rotate: "90deg", }'
		name="mdi-tune-vertical-variant"
		color="primary"
		size='24px')

	CloseButton(v-model="panels.preview" @close="close")

	// DiagProps(v-if='panels.right0'
	// 	v-motion
	// 	:initial='{ opacity: 0 }'
	// 	:enter='{ opacity: 1 }'
	// 	:delay='1000'
	// 	@next="next") 

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
		width: 400px;
		height: calc(100vh - 120px);
		right: -408px;
		border-radius: 6px;
		cursor: default;
	}
}
</style>
