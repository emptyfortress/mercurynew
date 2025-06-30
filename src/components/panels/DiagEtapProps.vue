<script setup lang="ts">
import PropField from '@/components/common/PropField.vue'

const list = [
	{
		id: 0,
		label: 'Название',
		main: 'Создание заявления',
	},
	{
		id: 1,
		label: 'Исполнитель',
		main: 'Инициатор',
		select: true,
	},
	{
		id: 2,
		label: 'Форма',
		main: 'Создание',
		select: true,
		after: true,
		navigate: '/form',
	},
	{
		id: 2,
		label: 'Текущий статус',
		main: 'Подготовка',
		select: true,
		disable: true,
	},
]
</script>

<template lang="pug">
q-list.prop(separator)
	.dat
		label Тип:
		.val Этап
	PropField(
		v-for="item in list",
		:key='item.id',
		:label='item.label',
		:select="item.select"
		:disable='item.disable'
		v-model:main="item.main",
		:after='item.after'
		:navigate='item.navigate'
	)

</template>

<style scoped lang="scss">
.prop {
	margin-left: 0.5rem;
	margin-right: 0.5rem;
	margin-top: 1rem;
}
.dat {
	display: grid;
	grid-template-columns: 110px 1fr;
	justify-items: start;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 0.5rem;
}
label {
	text-align: left;
	line-height: 1.2;

	&.start {
		align-self: start;
	}
}
</style>
