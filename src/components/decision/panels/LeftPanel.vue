<script setup lang="ts">
import { ref, computed } from 'vue'
import { useElementSize } from '@vueuse/core'
import LibMenu from '@/components/decision/LibMenu.vue'

const el = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(el)

const hei = computed(() => `height: ${height.value}px;`)
</script>

<template lang="pug">
// .panel-content
//   p левая панель
q-scroll-area.list(ref='el')
	LibMenu
</template>

<style scoped lang="scss">
// .panel-content {
// 	padding: 1rem;
// }
.list {
	height: calc(100vh - 170px);
	padding: 0;
	margin: 0;
}
</style>
