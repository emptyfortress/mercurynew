<script setup lang="ts">
import { useDiagram } from '@/stores/diagram'

const mydiagram = useDiagram()

const diag = [
	{
		id: 0,
		role: 'Инициатор',
		etaps: ['Создание заявления', 'Согласование', 'Рассмотрение'],
	},
	{
		id: 1,
		role: 'Руководитель',
		etaps: ['Этап 1', 'Этап 2'],
	},
]

const select = (n: string) => {
	mydiagram.select(n)
}

const calcClass = (s: string) => {
	return mydiagram.selection == s ? 'selected' : ''
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
		div {{ item.role }}
	.block(v-for="etap in item.etaps" :key='etap'
		:class='calcClass(etap)'
		@click.stop='select(etap)'
		) {{ etap }}
</template>

<style scoped lang="scss">
.role {
	display: flex;
	padding: 1rem;
	padding-left: 9rem;
	gap: 3rem;
	border: 2px solid #999;
	cursor: pointer;
	position: relative;

	.user {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		font-size: .8rem;
	}
}

.block {
	width: 150px;
	height: 80px;
	background: #fff;
	cursor: pointer;
	border: 3px solid #ccc;
}

.selected {
	border: 3px solid $primary;
	background: var(--selection);
}
</style>
