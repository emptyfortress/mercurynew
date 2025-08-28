<script setup lang="ts">
import { computed } from 'vue'
import { useApps } from '@/stores/apps'

const props = defineProps<{ id: number; type: string }>()

const myapps = useApps()

const current = computed(() => {
	return myapps.db.find((el) => el.id == props.id)
})
</script>

<template lang="pug">
div
	div id: {{ id }} {{ type}}
	h6 {{ current?.label || 'fuck'}}
</template>

<style scoped lang="scss"></style>
