<script setup lang="ts">
import PropField from '@/components/common/PropField.vue'

const rootlist = [
	{
		id: 0,
		label: 'Название',
		main: 'Заявление на отпуск',
	},
]
</script>

<template lang="pug">
q-list.prop(separator)
	.dat
		label Тип:
		.val Процесс
		label Длительность:
		.val 63 ч.
		label Автор:
		.val Орлов П.С.
	PropField(
		v-for="item in rootlist",
		:key='item.id',
		:label='item.label',
		v-model:main="item.main",
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
