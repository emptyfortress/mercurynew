<script setup lang="ts">
import type { QTableProps } from 'quasar';

const cols: QTableProps['columns'] = [
	{
		name: 'screen',
		required: true,
		label: 'Скриншот',
		align: 'center',
		field: 'screen',
		// format: (val: string) => val,
		sortable: false
	},
	{
		name: 'name',
		required: true,
		label: 'Название',
		align: 'left',
		field: 'name',
		// format: (val: string) => val,
		sortable: false
	},
	{
		name: 'page',
		required: true,
		label: 'Страница',
		align: 'left',
		field: 'page',
		format: (val: string) => val,
		sortable: false
	},
	{
		name: 'diff',
		required: true,
		label: 'Отличия',
		align: 'left',
		field: 'diff',
		format: (val: string) => val,
		sortable: false
	},
]

interface Screen {
	id: number
	screen: string
	name: string
	page: string
	diff: string
}

const getImageUrl = (name: string) => new URL(`../assets/img/screenshots/${name}.png`, import.meta.url).href

const rows: Screen[] = [
	{
		id: 0,
		screen: 'plus',
		name: 'Кнопка "Добавить"',
		page: 'Главная',
		diff: 'lajsdlkaj',
	}
]
</script>

<template lang="pug">
q-page(padding)
	.container
		h6 Общие компоненты
		br
		q-table(
			:columns='cols'
			:rows='rows'
			hide-bottom
			)
			template(v-slot:body-cell-screen='props')
				q-td(:props="props")
					q-img(:src='getImageUrl(props.value)' style="max-width: 50px" fit='none')

		// q-img(:src='getImageUrl("plus")' width='32px' fit="cover")
</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
}


.container {
	max-width: 800px;
}
</style>
