<script setup lang="ts">
import FormPreview from '@/components/FormPreview.vue'
import CloseButton from '@/components/panels/CloseButton.vue'
import TopButton1 from '@/components/panels/TopButton1.vue'
import { usePanels } from '@/stores/panels'
import TablerSearch from '@/components/icons/TablerSearch.vue'

const panels = usePanels()

const emit = defineEmits(['activate', 'stop', 'search'])

const expand = () => {
	emit('activate')
	panels.setPreview(true)
}

const close = () => {
	emit('stop')
	panels.setPreview(false)
}

const search = () => {
	emit('search')
}
</script>

<template lang="pug">
.button(
	:class='{ expand: panels.preview }'
	@click='expand'
	)

	TablerSearch.ic(
		v-if='!panels.preview',
		v-motion
		:initial='{ rotate: "0deg" }'
		:hovered='{ rotate: "90deg" }'
	)


	TopButton1(v-model="panels.preview" @close="close")

	FormPreview(v-if='panels.preview'
		v-motion
		:initial='{ opacity: 0 }'
		:enter='{ opacity: 1 }'
		:delay='1000'
		@search='search'
		) 
	CloseButton(v-model="panels.preview" @close="close")

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
	padding: 0.6rem;
	position: relative;

	&.expand {
		width: 385px;
		height: calc(100vh - 120px);
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
</style>
