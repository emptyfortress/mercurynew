<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { usePanels } from '@/stores/panels'
import CloseButton from '@/components/panels/CloseButton.vue'
import PredContent from '@/components/PredContent.vue'
// import MaterialSymbolsTableEditOutline from '@/components/icons/MaterialSymbolsTableEditOutline.vue'

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
	panels.setPred(false)
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
	:class='{ expand: panels.pred }'
	@click='expand'
	)
	q-icon(v-if='!panels.pred'
		v-motion
		:initial='{ opacity: 0, rotate: "0deg" }'
		:enter='{ opacity: 1, rotate: "0deg", }'
		:hovered='{ rotate: "90deg", }'
		name="mdi-tune-vertical-variant"
		color="primary"
		size='24px')

	// MaterialSymbolsTableEditOutline.ic(
	// 	v-if='!panels.pred',
	// 	v-motion
	// 	:initial='{ rotate: "0deg" }'
	// 	:hovered='{ rotate: "90deg" }'
	// )

	CloseButton(v-model="panels.pred" @close="close")

	.rrel(v-if='panels.pred'
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1 }'
		:delay='600'
		)
		.top(@click.stop='close')
			.zg
				q-icon.ico(name="mdi-tune-vertical-variant" color="primary")
				|Представление
		PredContent

</template>

<style scoped lang="scss">
.rrel {
	height: 100%;
	position: relative;
}

.zg .ico {
	font-size: 1.5rem;
	margin-right: 0.5rem;
	margin-bottom: 6px;
}

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
	cursor: pointer;
	padding: 0.6rem;

	.ic {
		margin-top: 11px;
		font-size: 1.5rem;
		color: $primary;
	}

	&.expand {
		width: 385px;
		height: calc(100vh - 120px);
		left: -395px;
		border-radius: 6px;
		cursor: default;
		padding: 0;
	}
}

.top {
	display: block;
	cursor: pointer;
}

.zg {
	font-size: 1.1rem;
	color: $primary;
	text-align: center;
}
</style>
