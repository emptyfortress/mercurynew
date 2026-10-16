<script setup lang="ts">
import ProcessInstanceCanvas from './ProcessInstanceCanvas.vue'
import { edgeType, instance, selectedNode, template } from './singleMonitorLayoutState'
</script>

<template lang="pug">
.constructor-editor
	ProcessInstanceCanvas(:instance="instance" :template="template" :edge-type="edgeType" @selection-change="selectedNode = $event")
</template>

<style scoped lang="scss">
.constructor-editor { width: 100%; height: 100%; min-height: 0; }
</style>
