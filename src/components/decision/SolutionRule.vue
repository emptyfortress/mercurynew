<script setup lang="ts">
interface Condition {
	mode: string
	state: string
	role: string
	device: string
}

interface Props {
	condition: Condition[]
}

const props = defineProps<Props>()
</script>

<template lang="pug">
div.q-gutter-sm
	q-chip(
		v-for="(item, index) in props.condition"
		:key="index"
		color="primary"
		text-color="white"
	)
		| {{ item.mode }} - {{ item.state }} - {{ item.role }} - {{ item.device }}
</template>

<style scoped lang="scss"></style>
