<script setup lang="ts">
import PropField from '@/components/common/PropField.vue'

const list = [
	{
		id: 0,
		label: 'Метка',
		main: '',
	},
	{
		id: 1,
		label: 'Подсказка',
		main: '',
	},
	{
		id: 2,
		label: 'Текст-заполнитель',
		main: '',
	},
	{
		id: 3,
		label: 'Обязательное поле',
		toggle: true,
		check: false,
	},
	{
		id: 7,
		label: 'Запрет на изменение',
		toggle: true,
		check: false,
	},
	{
		id: 5,
		label: 'Тип',
		radio: true,
		group: [
			{ label: 'Дата', val: 'date' },
			{ label: 'Дата / время', val: 'time' },
		],
		startValue: 'date'
	},
	{
		id: 6,
		label: 'Текущее время по умолчанию',
		toggle: true,
		check: false,
	},

]
</script>

<template lang="pug">
q-list.prop
	PropField(v-for="item in list" :key='item.id'
		:label='item.label'
		v-model:main="item.main"
		:toggle="item.toggle"
		:check='item.check'
		:radio='item.radio'
		:group='item.group'
		:startValue='item.startValue'
		)
</template>

<style scoped lang="scss"></style>
