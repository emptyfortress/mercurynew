<script setup lang="ts">
import ProcessInstanceCanvas from './ProcessInstanceCanvas.vue'
import { edgeType, instance, isInstanceEditing, selectedNode, template } from './singleMonitorLayoutState'

</script>

<template lang="pug">
.constructor-editor
	ProcessInstanceCanvas(
		:readonly="!isInstanceEditing"
		:instance="instance"
		:template="template"
		:edge-type="edgeType"
		@selection-change="selectedNode = $event"
		@edge-type-change="edgeType = $event"
	)
</template>

<style scoped lang="scss">
.constructor-editor { width: 100%; height: 100%; min-height: 0; }
</style>
