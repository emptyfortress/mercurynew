<script setup lang="ts">
import { computed, ref } from 'vue'

const splitterModel = ref(75)

const hei = computed(() => {
	return 'height: ' + (window.innerHeight - 180) + 'px;'
})
</script>

<template lang="pug">
q-page(padding)
	.container
		.text-h6 Конструктор состояний
		q-splitter(v-model="splitterModel" :limits="[0, 100]" :style="hei")
			template(v-slot:before)
				.main Конструктор состояний
			template(v-slot:after)
				.properties Настройка свойств
</template>

<style scoped lang="scss">
:deep(.q-splitter__separator) {
	background-color: transparent;
}

.main {
	border: 1px solid var(--my-border-color);
	background: var(--bg-panel);
	height: 100%;
	margin-right: 0.5rem;
	padding: 1rem;
}

.properties {
	height: 100%;
	background: var(--bg-panel);
	border: 1px solid var(--my-border-color);
	padding: 0.5rem;
}
</style>
