<script setup lang="ts">
import { computed } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'
import Start from '@/components/decision/Start.vue'
import FolderStart from '@/components/decision/FolderStart.vue'

const simpleStore = useSimpleStore()
// const { selectedElement } = storeToRefs(simpleStore)
const { currentNode, selectedElement } = storeToRefs(simpleStore)

// const isFolder = computed(() => selectedElement.value?.sourceType === 'folderData')

const componentName = computed(() => {
	if (!selectedElement.value) return 'div'
	return selectedElement.value.sourceType === 'folderData' ? FolderStart : Start
})
</script>

<template lang="pug">
component(:is="componentName")
</template>
