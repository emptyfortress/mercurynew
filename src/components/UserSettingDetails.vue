<script setup lang="ts">
import { computed } from 'vue'
import { useServers } from '@/stores/servers'

const props = defineProps<{ id: number; type: string }>()

const server = useServers()

const current = computed(() => {
	return server.userGroups.find((el) => el.id == props.id)
})
</script>

<template lang="pug">
div
	div id: {{ id }} {{ type}}
	h6 {{ current?.name || 'fuck'}}
</template>

<style scoped lang="scss"></style>
