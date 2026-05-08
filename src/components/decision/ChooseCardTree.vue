<script setup lang="ts">
import { ref } from 'vue'
import FolderTree from '@/components/decision/FolderTree.vue'
import { useSimpleStore } from '@/stores/simpleStore'

const simpleStore = useSimpleStore()
const only = ref(false)
</script>

<template lang="pug">
q-checkbox(v-model="only" dense label='Только выбранные типы карточек могут быть созданы в данной папке')
br
FolderTree(:data="simpleStore.treeData" :isDisabled='!only')
</template>

<style scoped lang="scss"></style>
