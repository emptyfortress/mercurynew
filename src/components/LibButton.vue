<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { usePanels } from '@/stores/panels'
import CloseButton from '@/components/panels/CloseButton.vue'
import LibContent from '@/components/LibContent.vue'
import { motion } from 'motion-v'
import { springDelay, spring } from '@/utils/springConstants'

const panels = usePanels()

const emit = defineEmits(['activate', 'stop'])

const expand = () => {
	emit('activate')
}

const close = () => {
	emit('stop')
	panels.setLeft(false)
}

const Div = motion.div
</script>

<template lang="pug">
Div.button(
	layout
	:transition='panels.left ? springDelay : spring'
	:class='{ expand: panels.left }'
	@click='expand'
	)

	q-icon.ic(v-if='!panels.left'
		v-motion
		:initial='{ rotate: "0deg" }'
		:hovered='{ rotate: "90deg" }'
		name="mdi-book-open-page-variant-outline"
		color="primary"
		size='28px')

	CloseButton(v-model="panels.left" @close="close")

	.rrel(v-if='panels.left'
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1 }'
		:delay='600'
		)
		.top(@click.stop='close')
			.zg
				q-icon(name="mdi-book-open-page-variant-outline")
				|Библиотека
		LibContent
		.info
			q-icon(name="mdi-lightbulb-outline" size="sm")
			span Перетащите элемент в поле редактора

</template>

<style scoped lang="scss">
.rrel {
	height: 100%;
	position: relative;
}

.zg .q-icon {
	font-size: 1.5rem;
	margin-right: 0.5rem;
}

.info {
	position: absolute;
	bottom: 0;
	padding: 0.5rem;
	font-size: 0.8rem;
	vertical-align: bottom;
	color: $secondary;

	.q-icon {
		margin-bottom: 3px;
	}
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

	.ic {
		margin-top: 9px;
	}

	&.expand {
		width: 385px;
		height: calc(100vh - 120px);
		left: -395px;
		border-radius: 6px;
		cursor: default;
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
