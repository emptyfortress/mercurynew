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

const propertyLabels = {
	mode: 'Режим',
	state: 'Состояние',
	role: 'Роль',
	device: 'Устройство'
}
</script>

<template lang="pug">
div.q-gutter-sm
	div.q-gutter-y-md(v-for="(item, index) in props.condition" :key="index")
		div.q-gutter-sm
			q-chip(
				v-for="(value, key) in item"
				:key="key"
				:label="`${propertyLabels[key]}: ${value}`"
				color="primary"
				text-color="white"
			)
</template>

<style scoped lang="scss"></style>
