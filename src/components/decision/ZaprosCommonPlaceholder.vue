<script setup lang="ts"></script>

<template lang="pug">
	// Common placeholder for general settings
	.q-mt-lg.zapros-common-placeholder
		div.zapros-common-content
			p Создайте общий запрос
			p В настройках можно изменить тип, источник данных и другие параметры

		div.mt-2.ml-2
			q-btn(flat color="primary" @click="toggleCreate") Создать новый запрос
</template>

<style scoped lang="scss">
.zapros-common-placeholder {
	padding: 1rem;
	border: 1px dashed var(--q-primary);
	border-radius: 4px;
	color: $secondary;
}
.zapros-common-content {
	font-size: 0.9rem;
	margin-bottom: 1rem;
}
</style>