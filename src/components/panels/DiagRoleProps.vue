<script setup lang="ts">
import PropField from '@/components/common/PropField.vue'

const rootlist = [
	{
		id: 0,
		label: 'Название',
		main: 'Заявление на отпуск',
	},
]

const rolelist = [
	{
		id: 0,
		label: 'Название',
		main: 'Инициатор',
	},
	{
		id: 1,
		label: 'Форма',
		main: 'Просмотр',
		select: true,
		after: true,
	},
]
</script>

<template lang="pug">
			q-list.prop(separator)
				.dat
					label Тип:
					.val Роль

				PropField(
					v-for="item in rolelist",
					:key='item.id',
					:label='item.label',
					:select='item.select'
					:after="item.after"
					v-model:main="item.main",
				)
				.dat
					label Правила определения:
					q-btn(unelevated color="primary" label="Задать" size='sm') 

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
