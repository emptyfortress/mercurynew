<script setup lang="ts">
import { computed } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { useApproveStore } from '@/stores/approveStore'
import { storeToRefs } from 'pinia'
import Start from '@/components/decision/Start.vue'
import FolderStart from '@/components/decision/FolderStart.vue'
import ApproveInside from '@/components/decision/ApproveInside.vue'

const simpleStore = useSimpleStore()
const approveStore = useApproveStore()
const { selectedElement } = storeToRefs(simpleStore)

const componentName = computed(() => {
	if (approveStore.selectedElement) return ApproveInside
	if (!selectedElement.value) return 'div'
	return selectedElement.value.sourceType === 'folderData' ? FolderStart : Start
})
</script>

<template lang="pug">
component(:is="componentName")
</template>
