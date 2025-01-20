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
		id: 4,
		label: 'Видимость',
		toggle: true,
		check: true,
	},
]
</script>

<template lang="pug">
q-list.prop
	PropField(v-for="item in list" :key='item.id'
		:label='item.label'
		v-model:main="item.main"
		:toggle="item.toggle"
		:select='item.select'
		:check='item.check'
		:radio='item.radio'
		:group='item.group'
		:startValue='item.startValue'
		)
</template>

<style scoped lang="scss"></style>
