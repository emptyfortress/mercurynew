<script setup lang="ts">
import ProcessInstanceCanvas from './ProcessInstanceCanvas.vue'
import { edgeType, instance, selectedNode, template } from './singleMonitorLayoutState'

const edgeTypeOptions = [
	{ label: 'Кривая Безье', value: 'default' },
	{ label: 'Простая кривая', value: 'simplebezier' },
	{ label: 'Прямая', value: 'straight' },
	{ label: 'Ступенчатая', value: 'step' },
	{ label: 'Ступенчатая со скруглением', value: 'smoothstep' },
] as const
</script>

<template lang="pug">
.constructor-editor
	ProcessInstanceCanvas(:instance="instance" :template="template" :edge-type="edgeType" @selection-change="selectedNode = $event")
	.edge-type-control
		q-btn(flat round dense color="primary" icon="mdi-cog")
			q-tooltip(anchor="top middle" self="bottom middle" :offset="[0, 0]") Настройки типа связей
			q-menu(anchor="top left" self="bottom left")
				.text-bold.text-center Тип связи
				q-list(dense)
					q-item(v-for="option in edgeTypeOptions" :key="option.value" clickable v-close-popup @click="edgeType = option.value")
						q-item-section {{ option.label }}
						q-item-section(side)
							q-icon(v-if="edgeType === option.value" name="mdi-check" color="primary")
</template>

<style scoped lang="scss">
.constructor-editor { position: relative; width: 100%; height: 100%; min-height: 0; }
.edge-type-control { position: absolute; z-index: 5; bottom: 0.75rem; left: 0.75rem; }
</style>
