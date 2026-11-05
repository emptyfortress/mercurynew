<script setup lang="ts">
import TemplateCanvas from './TemplateCanvas.vue'
import { edgeType, selectedNode, template } from './templateConstructorState'
</script>

<template lang="pug">
TemplateCanvas(
	v-if="template"
	:key="template.id"
	:template="template"
	:edge-type="edgeType"
	@selection-change="selectedNode = $event"
	@edge-type-change="edgeType = $event"
)
.column.flex-center.full-height.q-pa-lg.text-grey-7.text-center(v-else)
	| Выберите шаблон в панели „Шаблоны“ или создайте новый
</template>
