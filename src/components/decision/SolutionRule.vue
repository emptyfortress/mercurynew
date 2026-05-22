<script setup lang="ts">
interface Props {
	mode: string
	state: string
	role: string
	device: string
}
const props = defineProps<{
	condition: Props[]
}>()
</script>

<template lang="pug">
pre {{props.condition}}
</template>

<style scoped lang="scss"></style>
