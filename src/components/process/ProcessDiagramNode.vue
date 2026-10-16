<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import type { OnResizeEnd } from '@vue-flow/node-resizer'
import '@vue-flow/node-resizer/dist/style.css'
import LucideArrowLeftRight from '@/components/icons/LucideArrowLeftRight.vue'
import LucideCalendarClock from '@/components/icons/LucideCalendarClock.vue'
import LucideCirclePlay from '@/components/icons/LucideCirclePlay.vue'
import LucideCircleStop from '@/components/icons/LucideCircleStop.vue'
import LucideCodeXml from '@/components/icons/LucideCodeXml.vue'
import LucideFileCode2 from '@/components/icons/LucideFileCode2.vue'
import LucideGitFork from '@/components/icons/LucideGitFork.vue'
import LucideGitMerge from '@/components/icons/LucideGitMerge.vue'
import LucideLayers2 from '@/components/icons/LucideLayers2.vue'
import LucideListFilter from '@/components/icons/LucideListFilter.vue'
import LucideListOrdered from '@/components/icons/LucideListOrdered.vue'
import LucideListTree from '@/components/icons/LucideListTree.vue'
import LucideShieldAlert from '@/components/icons/LucideShieldAlert.vue'
import LucideShuffle from '@/components/icons/LucideShuffle.vue'
import LucideSplit from '@/components/icons/LucideSplit.vue'
import LucideTrash2 from '@/components/icons/LucideTrash2.vue'
import LucideWorkflow from '@/components/icons/LucideWorkflow.vue'

const props = defineProps<{
	id?: string
	type?: string
	selected?: boolean
	data: {
		label?: string
		libraryType?: string
		shape?: string
		[key: string]: unknown
	}
}>()
const emit = defineEmits<{
	'resize-end': [size: { id: string; x: number; y: number; width: number; height: number }]
}>()

const libraryIcons: Record<string, Component> = {
	start: LucideCirclePlay,
	end: LucideCircleStop,
	function: LucideCodeXml,
	scenario: LucideFileCode2,
	and: LucideGitMerge,
	or: LucideGitFork,
	branch: LucideSplit,
	subprocess: LucideLayers2,
	condition: LucideListFilter,
	counter: LucideListOrdered,
	schedule: LucideCalendarClock,
	collection: LucideListTree,
	delete: LucideTrash2,
	exchange: LucideArrowLeftRight,
	'universal-exchange': LucideShuffle,
	'error-handler': LucideShieldAlert,
}

const shape = computed(() => props.data.shape === 'gateway' || props.data.shape === 'exchange'
	? props.data.shape
	: 'standard')
const icon = computed(() => libraryIcons[props.data.libraryType ?? '']
	?? (props.type === 'input' ? LucideCirclePlay : props.type === 'output' ? LucideCircleStop : LucideWorkflow))

function onResizeEnd({ params }: OnResizeEnd) {
	if (!props.id) return
	emit('resize-end', { id: props.id, ...params })
}
</script>

<template lang="pug">
.process-diagram-node(:class="[`process-diagram-node--${shape}`, { 'is-selected': selected }]")
	NodeResizer(v-if="shape !== 'gateway'" :is-visible="selected" :min-height="50" :auto-scale="false" :handle-style="{ width: '8px', height: '8px' }" @resize-end="onResizeEnd")
	Handle(v-if="type !== 'input'" type="target" :position="Position.Left")
	.process-diagram-node__surface
		component.process-diagram-node__icon(:is="icon")
		span.process-diagram-node__label(v-if="shape !== 'gateway'") {{ data.label ?? 'Без названия' }}
		q-tooltip(v-if="shape === 'gateway'") {{ data.label ?? 'Без названия' }}
	Handle(v-if="type !== 'output'" type="source" :position="Position.Right")
</template>

<style scoped lang="scss">
.process-diagram-node {
	position: relative;
	// width: 210px;
	height: 100%;
	min-height: 50px;
	color: var(--process-node-color, #263746);
}

.process-diagram-node__surface {
	display: grid;
	width: 100%;
	height: 100%;
	min-height: 50px;
	box-sizing: border-box;
	grid-template-columns: 2.25rem minmax(0, 1fr);
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem;
	border: 1px solid var(--process-node-border, #93a4b5);
	border-radius: 10px;
	background: var(--process-node-fill, #fff);
	color: inherit;
	box-shadow: 0 3px 12px #1d354014;
}

.process-diagram-node__icon {
	width: 2rem;
	height: 2rem;
	color: var(--q-primary);
}

.process-diagram-node__label {
	min-width: 0;
	text-align: left;
	font-size: 0.8rem;
	line-height: 1.25;
	overflow-wrap: anywhere;
}

.process-diagram-node--gateway {
	width: 48px;
	height: 48px;
	min-height: 48px;
}

.process-diagram-node--gateway .process-diagram-node__surface {
	display: flex;
	height: 48px;
	min-height: 48px;
	flex-direction: column;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.25rem;
	border-radius: 50%;
	text-align: center;
}

.process-diagram-node--gateway .process-diagram-node__icon {
	width: 1.5rem;
	height: 1.5rem;
}

.process-diagram-node--exchange {
	// width: 210px;
}

.process-diagram-node--exchange .process-diagram-node__surface {
	position: relative;
	border: 0;
	border-radius: 0;
	background: var(--process-node-border, #93a4b5);
	filter: drop-shadow(0 3px 3px #1d35401c);
	clip-path: polygon(12% 0, 100% 0, 88% 100%, 0 100%);
}

.process-diagram-node--exchange .process-diagram-node__surface::before {
	position: absolute;
	inset: var(--process-node-border-width, 1px);
	background: var(--process-node-fill, #fff);
	content: '';
	clip-path: polygon(12% 0, 100% 0, 88% 100%, 0 100%);
}

.process-diagram-node--exchange .process-diagram-node__icon,
.process-diagram-node--exchange .process-diagram-node__label {
	z-index: 1;
}

.process-diagram-node.is-selected .process-diagram-node__surface {
	outline: 2px solid var(--q-primary);
	outline-offset: 3px;
}

.process-diagram-node :deep(.vue-flow__resize-control.line) {
	box-sizing: border-box;
	padding: 0;
	background: transparent;
}

.process-diagram-node :deep(.vue-flow__resize-control.line.top),
.process-diagram-node :deep(.vue-flow__resize-control.line.bottom) {
	height: 1px;
}

.process-diagram-node :deep(.vue-flow__resize-control.line.left),
.process-diagram-node :deep(.vue-flow__resize-control.line.right) {
	width: 1px;
}

.process-diagram-node :deep(.vue-flow__resize-control.handle) {
	width: 8px;
	height: 8px;
	box-sizing: border-box;
}
</style>
