<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import { useApproveStore } from '@/stores/approveStore'

const cols: QTableProps['columns'] = [
	{
		name: 'vid',
		required: true,
		label: 'Вид',
		align: 'left',
		field: 'vid',
		sortable: true,
	},
	{
		name: 'state',
		required: true,
		label: 'Состояние этапа',
		align: 'left',
		field: 'state',
		sortable: true,
	},
	{
		name: 'plus',
		required: true,
		label: 'Состояние при положительном результате',
		align: 'left',
		field: 'plus',
		sortable: true,
	},
	{
		name: 'minus',
		required: true,
		label: 'Состояние при отрицательном результате',
		align: 'left',
		field: 'minus',
		sortable: true,
	},
	{
		name: 'actions',
		required: true,
		label: '',
		align: 'right',
		field: 'actions',
		sortable: false,
	},
]

const rows = ref([
	{
		id: 1,
		vid: 'Исходящий',
		state: 'На согласовании',
		plus: 'Согласован',
		minus: 'Отказано',
	},
	{
		id: 2,
		vid: 'Заявка',
		state: 'На согласовании',
		plus: 'Согласован',
		minus: 'Отказано',
	},
	{
		id: 3,
		vid: 'Служебная записка',
		state: 'На согласовании',
		plus: 'Согласован',
		minus: 'Отказано',
	},
	{
		id: 4,
		vid: 'ОРД',
		state: 'На согласовании',
		plus: 'Согласован',
		minus: 'Отказано',
	},
	{
		id: 5,
		vid: 'Рабочий',
		state: 'На согласовании',
		plus: 'Согласован',
		minus: 'Отказано',
	},
])

const edit = (row: any) => {
	dialog.value = !dialog.value
}

const remove = (e: any) => {
	rows.value = rows.value.filter((item) => item !== e)
}

const dialog = ref(false)

const semoptions = [
	'Положительная',
	'Отрицательная',
	'Условно-положительная',
	'Отмена',
	'Новый цикл',
	'Добавление согласующих',
	'Переход А',
	'Переход B',
	'Переход C',
	'Переход D',
	'Завершение',
	'Переход на новый цикл',
]

const sem = ref('Положительная')
const bus = ref('')
const otk = ref('Продолжать согласование')
const options = ['Продолжать согласование', 'Действие 1', 'Действие 2', 'Действие 3']

const approveStore = useApproveStore()
</script>

<template lang="pug">
fieldset
	legend Матрица состояний
	q-table(
		flat
		color="primary"
		:columns="cols"
		:rows="rows"
		row-key="id"
		hideBottom
		tableHeaderClass='hd'
	)

		template(v-slot:body-cell-vid='props')
			q-td.text-bold {{ props.row.vid }}
		template(v-slot:body-cell-actions='props')
			q-td.text-right(auto-width :props="props")
				.q-gutter-x-sm
					q-btn(flat round icon="mdi-pencil-outline" color="secondary" dense size="sm" @click="edit(props.row)" ) 
					q-btn(flat round icon="mdi-close" color="secondary" dense size="sm" ) 
						q-menu
							q-list
								q-item.pink(clickable @click="remove(props.row)")
									q-item-section Удалить
	q-btn.q-mt-sm(unelevated color="primary" label="Добавить" icon="mdi-plus-circle" @click="dialog = !dialog" size="sm" )

	q-dialog(v-model="dialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card
			q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
			q-card-section
				.text-h6 Диалог добавления вида

			q-card-section
				div Здесь выбор из дерева видов или редактирование выбранного
			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup) 
				q-btn(unelevated color="primary" label="OK" v-close-popup) 
fieldset
	legend Завершение этапа
	.grid2
		q-select(v-model="sem" dense label="Семантика завершения этапа по умолчанию" outlined :options="semoptions" )
		q-input(v-model="bus" dense label="При завершении этапа запускать бизнес-процесс" outlined )
			template(v-slot:append)
				q-icon(name="mdi-dots-horizontal" color="primary")
		q-select(v-model="otk" dense label="При первом отказе" outlined :options="options" )
</template>

<style scoped lang="scss">
.grid2 {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	justify-items: stretch;
	align-items: start;
	column-gap: 2rem;
	row-gap: 0.5rem;
}
:deep(.hd) {
	background: yellow;
	background: #e9eef1;
	th {
		font-size: 0.7rem;
		white-space: wrap;
	}
}
tr {
	.q-btn {
		visibility: hidden;
	}
	&:hover {
		.q-btn {
			visibility: visible;
		}
	}
}
</style>
