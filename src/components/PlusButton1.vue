<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { usePanels } from '@/stores/panels'
import CloseButton from '@/components/panels/CloseButton.vue'
import TopButton from '@/components/panels/TopButton.vue'
import PropertyPanel from '@/components/panels/PropertyPanel.vue'

const panels = usePanels()

const emit = defineEmits(['activate', 'stop'])

const expand = () => {
	emit('activate')
}

const close = () => {
	emit('stop')
	panels.setRight(false)
}
</script>

<template lang="pug">
.button(
	:class='{ expand: panels.right }'
	@click='expand'
	)
	q-icon.ic(v-if='!panels.right'
		v-motion
		:initial='{ opacity: 0, rotate: "0deg" }'
		:enter='{ opacity: 1, rotate: "0deg", }'
		:hovered='{ rotate: "90deg", }'
		name="mdi-tune-vertical-variant"
		color="primary"
		size='24px')

	CloseButton(v-model="panels.right" @close="close")

	TopButton(v-model="panels.right" @close="close")
	PropertyPanel(v-model="panels.right")

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
		width: 385px;
		height: calc(100vh - 120px);
		border-radius: 6px;
	}
}
</style>
