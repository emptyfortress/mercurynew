<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useRouter } from 'vue-router'
import { usePanels } from '@/stores/panels'
import DiagProps from '@/components/panels/DiagProps.vue'
import CloseButton from '@/components/panels/CloseButton.vue'
import TopButton from '@/components/panels/TopButton.vue'

const router = useRouter()
const panels = usePanels()

gsap.registerPlugin(Flip)

const emit = defineEmits(['activate', 'stop'])

// const expanded = ref<boolean>(false)

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

const next = () => {
	router.push('/form')
}
</script>

<template lang="pug">
.button(
	:class='{ expand: panels.right0 }'
	@click='expand'
	)

	q-icon.ic(v-if='!panels.right0'
		v-motion
		:initial='{ opacity: 0, rotate: "0deg" }'
		:enter='{ opacity: 1, rotate: "0deg", }'
		:hovered='{ rotate: "90deg", }'
		name="mdi-tune-vertical-variant"
		color="primary"
		size='24px')

	CloseButton(v-model="panels.right0" @close="close")

	TopButton(v-model="panels.right0")
	DiagProps(v-if='panels.right0'
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1 }'
		:delay='1000'
		@next="next") 

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
</style>
