<script setup lang="ts">
import { useSimpleStore } from '@/stores/simpleStore'

const simpleStore = useSimpleStore()
</script>

<template lang="pug">
div
	q-expansion-item(icon="mdi-menu" label="Основные настройки")
		div dummy text for basic settings

	q-expansion-item(icon="mdi-security" label="Безопасность")
		div dummy text for security settings

	q-expansion-item(icon="mdi-palette" label="Внешний вид")
		div dummy text for appearance settings
</template>

<style scoped lang="scss">
.text-h6 span {
	font-size: 1rem;
	margin-left: 1rem;
}
</style>
