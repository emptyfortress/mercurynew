<script setup lang="ts">
import { ref } from 'vue'

const diag = [
	{
		id: 0,
		role: 'Инициатор',
		etaps: ['Создание заявки', 'Согласование', 'Рассмотрение'],
	},
	{
		id: 1,
		role: 'Руководитель',
		etaps: ['Этап 1', 'Этап 2'],
	},
]

const selection = ref<string | null>(null)

const select = (n: string) => {
	if (selection.value == n) {
		selection.value = null
	} else selection.value = n
}

const calcClass = (s: string) => {
	return selection.value == s ? 'selected' : ''
}

const calcClass1 = (s: string) => {
	return selection.value == s ? 'selected' : ''
}
</script>

<template lang="pug">
.role(v-for="item in diag"
	:key='item.id'
	:class='calcClass(item.role)'
	@click='select(item.role)'
	)
	.user
		q-avatar(color="info" icon="mdi-account" size="sm")
	.block(v-for="etap in item.etaps" :key='etap'
		:class='calcClass(etap)'
		@click.stop='select(etap)'
		) {{ etap }}
</template>

<style scoped lang="scss">
.role {
	display: flex;
	padding: 1rem;
	padding-left: 7rem;
	gap: 4rem;
	border: 2px solid #999;
	cursor: pointer;
	position: relative;
	.user {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
	}
	&.selected {
		border: 3px solid $primary;
		background: $accent;
	}
}
.block {
	width: 150px;
	height: 80px;
	background: #ccc;
	cursor: pointer;
	&.selected {
		border: 3px solid black;
		background: $accent;
	}
}
</style>
