<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import DndTable from '@/components/common/DndTable.vue'

const approveStore = useApproveStore()
const name = computed(() => approveStore.selectedElement?.text)

const author = ref('admin')
const registrator = ref('registrator')
const check = ref(true)

const cols = [
	{
		name: 'text',
		label: 'Этап',
		field: 'text',
		align: 'left',
	},
	{
		name: 'first',
		label: 'Первый',
		field: 'first',
		align: 'center',
		type: 'checkbox',
	},
	{
		name: 'condition',
		label: 'Условие старта',
		field: 'condition',
		align: 'center',
	},
	{
		name: 'repeat',
		label: 'Повторять внутри цикла',
		field: 'repeat',
		align: 'left',
	},
	{
		name: 'regim',
		label: 'Режим',
		field: 'regim',
		align: 'left',
	},
	{
		name: 'marsh',
		label: 'Маршрутизация',
		field: 'marsh',
		align: 'left',
	},
	{
		name: 'sogl',
		label: 'Согласующие',
		field: 'sogl',
		align: 'left',
	},
	{
		name: 'duration',
		label: 'Длительность',
		field: 'duration',
		align: 'center',
	},
]

const rows = computed(() => {
	const children = approveStore.selectedElement?.children ?? []
	return children.map((child, index) => ({
		...child,
		first: index == 0,
		repeat: 'Всегда',
		condition: index === children.length - 1,
		regim: index == 0 ? 'Согласование' : 'Консолидация',
		marsh: index == 1 ? 'Параллельно' : 'Последовательно',
		sogl: index == 0 ? 'Согласующие' : 'Инициатор',
		duration: index == 0 ? 8 : 24,
	}))
})

const edit = () => {
	console.log(111)
}

const addDialog = ref(false)
const showAddDialog = () => {
	addDialog.value = !addDialog.value
}

const options = [
	'Всегда',
	'Никогда',
	'Для отказавших',
	'Если был завершен отрицательно',
	'Для отказавших или всем при изменении файла на след.этапах',
]

const change = (row: any, e: string) => {
	row.repeat = e
}

const cols1 = [
	{
		name: 'vid',
		label: 'Вид документа',
		field: 'vid',
		align: 'left',
	},
	{
		name: 'state',
		label: 'Состояние при положительном завершении',
		field: 'state',
		align: 'left',
	},
]

const rows1 = ref([
	{
		id: 0,
		vid: 'Рабочий',
		state: 'Согласован',
	},
	{
		id: 1,
		vid: 'Договор',
		state: 'Согласован',
	},
	{
		id: 2,
		vid: 'Заявка',
		state: 'Согласован',
	},
	{
		id: 3,
		vid: 'Служебная записка',
		state: 'Согласован',
	},
])
</script>

<template lang="pug">
.q-ma-md
	fieldset
		legend Общие
		.grid3
			q-input(v-model="name" label="Название" dense outlined :readonly='approveStore.typovoy')
			q-input(v-model="author" label="Автор" dense outlined :readonly='approveStore.typovoy')
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="secondary")
					q-icon(name="mdi-close" color="secondary" size="xs")
			q-input(v-model="registrator" label="Регистратор" dense outlined :readonly='approveStore.typovoy')
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="secondary")
					q-icon(name="mdi-close" color="secondary" size="xs")
			q-checkbox(v-model='check' label='Усовершенствованный маршрут' dense)

	fieldset
		legend Карта этапов
		DndTable(:columns='cols' :rows='rows')
			template(#cell-condition="{ row }")
				q-chip(v-if='row.condition' color="green-3" size="sm" selected clickable @click="edit") Условие
				q-chip(v-if='!row.condition' size="sm" clickable textColor="black") Задать

			template(#cell-repeat="{ row }")
				.sel
					span {{ row.repeat }}
					q-menu
						q-list
							q-item(clickable dense v-for="item in options" :key="item" @click="change(row, item)" v-close-popup)
								q-item-section {{ item }}


		q-btn.q-mt-sm(unelevated color="primary" label="Добавить этап" icon="mdi-plus-circle" @click="showAddDialog" size="sm") 

	fieldset
		legend Настройка итоговых состояних документов
		DndTable(:columns='cols1' :rows='rows1')

	q-dialog(v-model="addDialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card
			q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
			q-card-section
				.text-h6 Добавить этап

			q-card-section
				div Список типовых образцов доступных этапов
				q-input(v-model="name" dense label="Название" outlined)

			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup) 
				q-btn(unelevated color="primary" label="OK" @click="") 
</template>

<style scoped lang="scss">
.sel {
	font-size: 13px;
	color: $primary;
	span {
		display: inline-block;
		max-width: 150px; // нужная ширина
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		vertical-align: middle;

		border-bottom: 1px solid #999;
		padding: 2px 8px;
		background: #dedede;
		border-radius: 3px;
		cursor: pointer;
		&:after {
			content: '▾';
			margin-left: 6px;
		}
	}
	&:hover {
		span {
			border-bottom: 1px solid #333;
			background: #ccc;
		}
	}
}
.q-chip {
	margin: 0;
	color: $teal-10;
}
.grid3 {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
</style>
