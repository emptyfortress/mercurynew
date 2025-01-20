<script setup lang="ts">
import PropField from '@/components/common/PropField.vue'

const temp = [
	{
		id: 0,
		label: 'Название',
		main: '',
		// placeholder: 'place',
	},
	{
		id: 1,
		label: 'Тип',
		main: 'Просмотр',
		select: true,
		options: ['Создание', 'Просмотр', 'Read only']
	}
]
</script>

<template lang="pug">
q-list.prop
	PropField(v-for="item in temp" :key='item.id'
		:label='item.label'
		v-model:main="item.main"
		:select="item.select"
		:options="item.options"
		)
</template>

<style scoped lang="scss">
.prop {
	margin: .5rem 1rem;
}
</style>
