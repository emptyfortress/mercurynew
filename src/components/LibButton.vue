<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { usePanels } from '@/stores/panels'
// import lib from '@/assets/img/lib.png'
import CloseButton from '@/components/panels/CloseButton.vue'
import LibContent from '@/components/LibContent.vue'

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
.button(
	:class='{ expand: panels.left }'
	@click='expand'
	)
	q-icon.ic(v-if='!panels.left'
		v-motion
		:initial='{ rotate: "0deg" }'
		:hovered='{ rotate: "90deg" }'
		name="mdi-bookshelf"
		color="primary"
		size='28px')

	CloseButton(v-model="panels.left" @close="close")

	div(v-if='panels.left'
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1 }'
		:delay='600'
		)
		.top
			.zg Библиотека
		LibContent

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
	// padding: 0.6rem;
	// padding-top: 0;
	cursor: pointer;

	.ic {
		margin-top: 9px;
	}

	&.expand {
		width: 385px;
		height: calc(100vh - 120px);
		left: -395px;
		border-radius: 6px;
	}
}

.top {
	display: block;
}

.zg {
	font-size: 1.1rem;
	color: $primary;
	text-align: center;
}
</style>
