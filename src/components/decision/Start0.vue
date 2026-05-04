<script setup lang="ts">
import { computed } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'
import Start from '@/components/decision/Start.vue'
import FolderStart from '@/components/decision/FolderStart.vue'

const simpleStore = useSimpleStore()
const { selectedElement } = storeToRefs(simpleStore)

const isFolder = computed(() => selectedElement.value?.sourceType === 'folderData')
</script>

<template lang="pug">
component(:is="isFolder ? FolderStart : Start")
</template>
