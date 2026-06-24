<script setup lang="ts"></script>

<template lang="pug">
	// Верхний панель - Общие настройки запроса
	.q-tab-panel(zapros-верхний)
		div.zapros-верхний-content
			div
				span.bold Улучшить релевантность
				q-btn(flat color="primary" @click="showSettings") Настроить

		div.mb-2
			p Пример: 'Проверка сделок с proporcionarом' vs 'Анализ сделок для трейдинга'
</template>

<style scoped lang="scss">
.zapros-верхний-content {
	font-size: 0.95rem;
	color: $secondary;
}
.zapros-верхний {
	background: linear-gradient(to bottom, $q-grey-10 5%, $q-grey-20);
	padding: 1.2rem;
}
</style>