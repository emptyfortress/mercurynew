<script setup lang="ts">
import { ref } from 'vue'
</script>

<template lang="pug">
q-page(padding)
	.zg Selection
	.card-stack
</template>

<style scoped lang="scss">
.zg {
	font-size: 1.3rem;
	font-weight: 500;
	text-align: center;
}

.card-stack {
	position: relative;
	width: 200px; /* Ширина карточки */
	height: 300px; /* Высота карточки */
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	transition:
		transform 0.3s ease,
		box-shadow 0.3s ease;
}

/* Псевдоэлемент для имитации второй карточки */
.card-stack::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	transform: translate(5px, 5px) rotate(2deg);
	z-index: -1; /* Помещаем под основной карточкой */
}

/* Псевдоэлемент для имитации третьей карточки */
.card-stack::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	transform: translate(10px, 10px) rotate(-2deg);
	z-index: -2; /* Помещаем под второй карточкой */
}

/* Эффект при наведении */
.card-stack:hover {
	transform: translate(0, -10px);
	box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.card-stack:hover::before {
	transform: translate(5px, 0) rotate(2deg);
}
//
// .card-stack:hover::after {
// 	transform: translate(10px, 5px) rotate(-2deg);
// }
</style>
