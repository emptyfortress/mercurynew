<script setup lang="ts">
import { computed } from 'vue'
import { MarkerType, Panel, VueFlow } from '@vue-flow/core'
import type { Connection, Edge, EdgeMouseEvent, Node, NodeMouseEvent } from '@vue-flow/core'
import { Background, ControlButton, Controls, PanelPosition } from '@vue-flow/additional-components'
import type { EdgeType } from './types'

const nodes = defineModel<Node[]>('nodes', { required: true })
const edges = defineModel<Edge[]>('edges', { required: true })
const interactive = defineModel<boolean>('interactive', { required: true })
const edgeType = defineModel<EdgeType>('edgeType', { required: true })
const props = defineProps<{ edgeTypeOptions: ReadonlyArray<{ label: string; value: EdgeType }> }>()
const emit = defineEmits<{
	(event: 'node-click', payload: NodeMouseEvent): void
	(event: 'edge-click', payload: EdgeMouseEvent): void
	(event: 'pane-click'): void
	(event: 'connect', connection: Connection): void
	(event: 'add-node'): void
}>()
const defaultEdgeOptions = computed(() => ({
	style: { strokeWidth: 2 },
	markerEnd: MarkerType.ArrowClosed,
	type: edgeType.value,
}))
</script>

<template lang="pug">
VueFlow(
	v-model:nodes="nodes"
	v-model:edges="edges"
	:default-edge-options="defaultEdgeOptions"
	fit-view-on-init
	:nodes-draggable="interactive"
	:nodes-connectable="interactive"
	:elements-selectable="interactive"
	@node-click="emit('node-click', $event)"
	@pane-click="emit('pane-click')"
	@edge-click="emit('edge-click', $event)"
	@connect="emit('connect', $event)"
)
	Background(:gap="16" :size="1" pattern-color="#9aa9b5")
	Controls(:position="PanelPosition.TopRight" :show-interactive="false")
		template(v-slot:top="")
			ControlButton(
				:title="interactive ? 'Отключить редактирование' : 'Включить редактирование'"
				@click="interactive = !interactive"
			)
				q-icon(:name="interactive ? 'lock_open' : 'lock'")
	Panel(position="bottom-right")
		q-btn(fab color="primary" icon="add" title="Добавить состояние" :disable="!interactive" @click="emit('add-node')")
	Panel(position="bottom-left")
		q-btn(flat round color="primary" icon="mdi-cog" title="Настройки типа связей")
			q-menu(anchor="top left" self="bottom left")
				.text-bold.text-center Тип связи
				q-list(dense)
					q-item(v-for="option in edgeTypeOptions" :key="option.value" clickable v-close-popup @click="edgeType = option.value")
						q-item-section {{ option.label }}
						q-item-section(side)
							q-icon(v-if="edgeType === option.value" name="mdi-check" color="primary")
</template>
