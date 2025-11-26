<script setup>
import Set from '@/components/Set.vue'
import Dashboard from '@/components/Dashboard.vue'
import { useAppTour } from '@/tour'
import { useRoute } from 'vue-router'

const { startTour } = useAppTour()
const route = useRoute()

function start() {
	startTour(route)
	console.log(111)
}
</script>

<template lang="pug">
q-page(padding)
	.zg How to place a giraffe into a refrigerator?
	div
		button(@click="start") Запустить тур по приложению

	section
		h3(data-tour="home-title") Главная страница
		div(data-tour="home-stats") Статистика пользователей

	Dashboard
	Set


</template>

<style lang="scss">
.q-page {
	overflow: hidden;
}

.zg {
	font-size: 1.3rem;
	font-weight: 500;
	text-align: center;
}

.grid {
	max-width: 1200px;
	margin: 1rem auto;
	display: flex;
	flex-direction: column;
	gap: 3rem;
}
</style>
