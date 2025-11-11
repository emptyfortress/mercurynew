<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { usePanels } from '@/stores/panels'
import CloseButton from '@/components/panels/CloseButton.vue'
import PredContent from '@/components/PredContent.vue'
import { motion } from 'motion-v'
import { springDelay, spring } from '@/utils/springConstants'
// import MaterialSymbolsTableEditOutline from '@/components/icons/MaterialSymbolsTableEditOutline.vue'

const panels = usePanels()

const emit = defineEmits(['activate', 'stop'])

const expand = () => {
	emit('activate')
}

const close = () => {
	emit('stop')
	panels.setPred(false)
}

const Div = motion.div
</script>

<template lang="pug">
.button(
	:class='{ expand: panels.pred }'
	@click='expand'
	)

	q-icon(v-if='!panels.pred'
		v-motion
		:initial='{ opacity: 0, rotate: "0deg" }'
		:enter='{ opacity: 1, rotate: "0deg" }'
		:hovered='{ rotate: "90deg" }'
		name="mdi-tune-vertical-variant"
		color="primary"
		size='24px')

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
		CloseButton(v-model="panels.pred" @close="close")

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
