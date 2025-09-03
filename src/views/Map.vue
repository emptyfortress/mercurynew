<script setup lang="ts">
const dat = [
	{ id: 0, label: 'Приложение', val: 'Заявки на отпуск' },
	{ id: 1, label: 'Приложение', val: 'Заявки на отпуск' },
]
</script>

<template lang="pug">
q-page(padding)
	.cont
		.inf
			template(v-for="item in dat" :key='item.id')
				label {{ item.label }}:
				.val {{ item.val }}
</template>

<style scoped lang="scss">
.cont {
	max-width: 1400px;
	margin: 1rem auto;
}
.inf {
	max-width: 800px;
	margin: 0 auto;
	background: white;
	padding: 1rem;
	border-radius: 0.4rem;
	box-shadow: var(--shad0);
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: start;
	column-gap: 2rem;
	row-gap: 0.25rem;
}
label {
	color: #666;
}
</style>
