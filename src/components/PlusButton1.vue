<script setup lang="ts">
import { ref, nextTick, } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { usePanels } from '@/stores/panels'
import prop from '@/assets/img/formprop.png'
import CloseButton from '@/components/panels/CloseButton.vue'

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
	panels.setRight(false)
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
	:class='{ expand: panels.right }'
	@click='expand'
	)
	q-icon(v-if='!panels.right'
		v-motion
		:initial='{ opacity: 0, rotate: "0deg" }'
		:enter='{ opacity: 1, rotate: "0deg", }'
		:hovered='{ rotate: "90deg", }'
		name="mdi-tune-vertical-variant"
		color="primary"
		size='24px')

	CloseButton(v-model="panels.right" @close="close")

	.zg(v-if='panels.right'
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1 }'
		:delay='600'
		) Свойства
	br
	img(v-if='panels.right' :src="prop"
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1 }'
		:delay='600'
		)

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

.zg {
	font-size: 1.1rem;
	color: $primary;
}
</style>
