<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const sections = [
	{ id: 0, label: 'Конструктор карточек', to: 'cards' },
	{ id: 5, label: 'Каталог папок', to: 'folders' },
	{ id: 1, label: 'Поиски и представления', to: '' },
	{ id: 2, label: 'Процессы', to: '' },
	{ id: 3, label: 'Справочники', to: '' },
	{ id: 4, label: 'Нумераторы', to: '' },
]

const goto = (e: string) => {
	router.push({ name: 'Emp', params: { constructorId: e } })
}
</script>

<template lang="pug">
q-page(padding)
	.hd Конструкторы сервера DV-Main
	.container
		.it.constr(v-for="item in sections" :key='item.id' @click='goto(item.to)')
			div {{ item.label }}

</template>

<style scoped lang="scss">
.hd {
	text-align: center;
	font-size: 1.3rem;
	margin-bottom: 1rem;
}
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
