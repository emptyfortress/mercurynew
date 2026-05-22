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
	div.q-gutter-y-md(v-for="(item, index) in props.condition" :key="index")
		div.q-gutter-sm
			q-chip(label="Режим" color="grey" text-color="black")
			q-chip(label="Состояние" color="grey" text-color="black")
			q-chip(label="Роль" color="grey" text-color="black")
			q-chip(label="Устройство" color="grey" text-color="black")
		
		div.q-gutter-sm
			q-chip(label="Создание" color="primary" text-color="white")
			q-chip(label="Любое" color="primary" text-color="white")
			q-chip(label="Любая" color="primary" text-color="white")
			q-chip(label="Любое" color="primary" text-color="white")
</template>

<style scoped lang="scss"></style>
