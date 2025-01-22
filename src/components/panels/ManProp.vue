<script setup lang="ts">
import PropField from '@/components/common/PropField.vue'

const manList = [
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
		label: 'Выбирать только из группы',
		main: '',
		select: true,
	},
	{
		id: 6,
		label: 'Текущий пользователь по умолчанию',
		toggle: true,
		check: false
	},

]
</script>

<template lang="pug">
q-list.prop
	PropField(v-for="item in manList" :key='item.id'
		:label='item.label'
		v-model:main="item.main"
		:toggle="item.toggle"
		:select='item.select'
		:check='item.check'
		)
</template>

<style scoped lang="scss"></style>
