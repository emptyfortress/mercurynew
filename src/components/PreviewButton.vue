<script setup lang="ts">
import FormPreview from '@/components/FormPreview.vue'
import CloseButton from '@/components/panels/CloseButton.vue'
import TopButton1 from '@/components/panels/TopButton1.vue'
import { usePanels } from '@/stores/panels'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { nextTick } from 'vue'
import IconTableEdit from '@/components/icons/IconTableEdit.vue'

const panels = usePanels()

gsap.registerPlugin(Flip)

const emit = defineEmits(['activate', 'stop'])

// Function to animate Flip state transition
const animateFlip = (previewState: boolean) => {
	const state = Flip.getState('.button')
	panels.setPreview(previewState)
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			delay: 0.2,
		})
	})
}

// Expand the preview
const expand = () => {
	emit('activate')
	animateFlip(true)
}

// Close the preview
const close = () => {
	emit('stop')
	animateFlip(false)
}
</script>

<template lang="pug">
.button(
	:class='{ expand: panels.preview }'
	@click='expand'
	)

	IconTableEdit.ic(
		v-if='!panels.preview',
		v-motion
		:initial='{ rotate: "0deg" }'
		:hovered='{ rotate: "90deg" }'
	)

	CloseButton(v-model="panels.preview" @close="close")

	TopButton1(v-model="panels.preview")

	FormPreview(v-if='panels.preview'
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1 }'
		:delay='1000'
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
	cursor: pointer;
	padding: 0.6rem;

	&.expand {
		width: 400px;
		height: calc(100vh - 120px);
		right: -408px;
		border-radius: 6px;
		cursor: default;
		padding: 0;
	}

	.ic {
		margin-top: 2px;
		font-size: 1.5rem;
		color: $primary;
	}
}

.ic1 {
	font-size: 1.3rem;
	margin-right: 0.5rem;
}

.zg {
	font-size: 1.1rem;
	color: $primary;
	text-align: center;
}

.top1 {
	display: block;
	width: 100%;
}
</style>
