<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

const sections = [
	{ id: 0, label: 'Конструктор карточек', to: '/decisions' },
	{ id: 1, label: 'Поиски и представления', to: '' },
]

const goto = (e: string) => {
	router.push(e)
}
</script>

<template lang="pug">
q-page(padding)
	.container
		.it.constr(v-for="item in sections" :key='item.id' @click='goto(item.to)')
			div {{ item.label }}

</template>

<style scoped lang="scss">
.container {
	max-width: 1100px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	column-gap: 1rem;
	row-gap: 1rem;
}
.constr {
	width: 100%;
	height: 100px;
	background: #fff;
}
</style>
