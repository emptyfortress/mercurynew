<script setup lang="ts">
import { ref } from 'vue'
import FolderTree from '@/components/decision/FolderTree.vue'
import { useSimpleStore } from '@/stores/simpleStore'

const simpleStore = useSimpleStore()
const only = ref(false)
</script>

<template lang="pug">
q-checkbox(v-model="only" dense label='В папке будут доступны только выбранные представления')
br
FolderTree(:data="simpleStore.viewData" :isDisabled='!only')
</template>

<style scoped lang="scss"></style>
