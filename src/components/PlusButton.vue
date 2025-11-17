<script setup lang="ts">
// import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePanels } from '@/stores/panels'
import DiagProps from '@/components/panels/DiagProps.vue'
import CloseButton from '@/components/panels/CloseButton.vue'
import TopButton from '@/components/panels/TopButton.vue'
import { motion } from 'motion-v'
import { springDelay, spring } from '@/utils/springConstants'

const router = useRouter()
const panels = usePanels()

const emit = defineEmits(['activate', 'stop'])

const expand = () => {
	emit('activate')
}

const close = () => {
	emit('stop')
	panels.setRight0(false)
}

const next = () => {
	router.push('/form')
}

// const Div = motion.div
</script>

<template lang="pug">
.button(
	:class='{ expand: panels.right0 }'
	@click='expand'
	)

	q-icon.ic(
		v-if='!panels.right0'
		v-motion
		:initial='{ opacity: 0, rotate: "0deg" }'
		:enter='{ opacity: 1, rotate: "0deg" }'
		:hovered='{ rotate: "90deg" }'
		name="mdi-tune-vertical-variant"
		color="primary"
		size='24px')

	CloseButton(v-model="panels.right0" @close="close")

	TopButton(v-model="panels.right0" @close='close')
	DiagProps(
		v-if='panels.right0'
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1, transition: { delay: 0.2 } }'
		@next="next") 
</template>

<style scoped lang="scss">
.button {
	width: 48px;
	height: 48px;
	background: #fff;
	box-shadow: var(--shad0);
	border-radius: 24px;
	text-align: center;
	cursor: pointer;
	transition: all 0.2s ease;
	position: relative;
	.ic {
		margin-top: 11px;
	}

	&.expand {
		width: 350px;
		height: calc(100vh - 120px);
		// right: -358px;
		border-radius: 6px;
		cursor: default;
	}
}
</style>
