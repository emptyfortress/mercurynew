<script setup lang="ts">
import { useDiagram } from '@/stores/diagram'

const mydiagram = useDiagram()

const diag = [
	{
		id: 0,
		role: 'Инициатор',
		etaps: ['', 'Создание заявления', 'Доработка'],
	},
	{
		id: 1,
		role: 'Руководитель',
		etaps: ['Согласование', ''],
	},
]

const select = (n: string) => {
	mydiagram.select(n)
}

const calcClass = (s: string) => {
	if (s == '') return 'event'
	return mydiagram.selection == s ? 'selected' : ''
}
</script>

<template lang="pug">
.role(v-for="item in diag"
	:key='item.id'
	:class='calcClass(item.role)'
	@click='select(item.role)'
	)
	.block(v-for="etap in item.etaps" :key='etap'
		:class='calcClass(etap)'
		@click.stop='select(etap)'
		) {{ etap }}

	.user
		q-avatar(color="info" icon="mdi-account" size="sm")
		div {{ item.role }}
</template>

<style scoped lang="scss">
.role {
	display: flex;
	padding: 1rem;
	padding-left: 9rem;
	gap: 3rem;
	border: 2px solid #666;
	cursor: pointer;
	position: relative;
	min-height: 200px;

	.user {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		font-size: .8rem;
	}
}


.block {
	width: 160px;
	height: 80px;
	background: #fff;
	cursor: pointer;
	border: 3px solid #666;
	border-radius: .8rem;
	padding: 1rem;

	&.event {
		width: 50px;
		height: 50px;
		border-radius: 25px;
		border: 3px solid #666;
		background: #fff;
	}

}

.selected {
	border: 3px solid $primary;
	background: var(--selection);
}
</style>
