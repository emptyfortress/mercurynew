<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApps } from '@/stores/apps'
import { date } from 'quasar'
import type { QTableProps } from 'quasar'
import DetailsAppEvents from '@/components/DetailsAppEvents.vue'

const props = defineProps<{ id: string; type: string }>()

const myapps = useApps()

const current = computed(() => {
	return myapps.db.find((el) => el.id == props.id)
})

const cols: QTableProps['columns'] = [
	{
		name: 'app',
		required: true,
		label: 'Приложение',
		align: 'left',
		field: 'app',
		sortable: true,
	},
	{
		name: 'author',
		required: true,
		label: 'Автор',
		align: 'left',
		field: 'author',
		sortable: true,
	},
	{
		name: 'version',
		required: true,
		label: 'Версия',
		align: 'left',
		field: 'version',
		sortable: true,
	},
	{
		name: 'status',
		required: true,
		label: 'Статус',
		align: 'left',
		field: 'status',
		sortable: true,
	},
	{
		name: 'date',
		required: true,
		label: 'Дата публикации',
		align: 'left',
		field: 'date',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	// {
	// 	name: 'action',
	// 	required: true,
	// 	label: '',
	// 	align: 'left',
	// 	field: 'action',
	// 	sortable: true,
	// },
]
const rows: any = ref([
	{
		id: 0,
		app: 'Заявки на отпуск',
		author: 'Орлов П.С.',
		date: 1755513353568,
		version: 'Базовая-сopy',
		status: 'Опубликовано',
	},
	{
		id: 1,
		app: 'Управление командировками',
		author: 'Орлов П.С.',
		date: 1752512353568,
		version: 'Пробная',
		status: 'Опубликовано',
	},
	{
		id: 2,
		app: 'Партнерский форум',
		author: 'Роза Львовна',
		date: 1751513353568,
		version: 'Базовая',
		status: 'Опубликовано',
	},
	{
		id: 3,
		app: 'Квартальный отчет',
		author: 'Роза Львовна',
		date: 1751413353568,
		version: 'Базовая',
		status: 'Опубликовано',
	},
])

const cols1: QTableProps['columns'] = [
	{
		name: 'app',
		required: true,
		label: 'Приложение',
		align: 'left',
		field: 'app',
		sortable: true,
	},
	{
		name: 'version',
		required: true,
		label: 'Версия',
		align: 'left',
		field: 'version',
		sortable: true,
	},
	{
		name: 'date',
		required: true,
		label: 'Дата публикации',
		align: 'left',
		field: 'date',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	{
		name: 'status',
		required: true,
		label: 'Статус',
		align: 'left',
		field: 'status',
		sortable: true,
	},
	{
		name: 'action',
		required: true,
		label: '',
		align: 'left',
		field: 'action',
		sortable: true,
	},
]

const rows1: any = [
	{
		id: 0,
		app: 'Заявки на отпуск',
		version: 'Версия 0',
		date: 1755513353568,
		status: 'Архив',
	},
	{
		id: 1,
		app: 'Заявки на отпуск',
		version: 'Версия 1',
		date: 1755523353569,
		status: 'Архив',
	},
	{
		id: 2,
		app: 'Заявки на отпуск',
		version: 'Базовая',
		date: 1755523553569,
		status: 'Архив',
	},
]
const page = {
	sortBy: 'date',
	descending: true,
}

const expanded = [
	{ id: 0, author: 'Роза Львовна', version: 'Пробная', published: '14.08.25 13:23' },
	{ id: 1, author: 'Лотус Тигрович', version: 'Нулевая', published: '13.08.25 10:26' },
]
</script>

<template lang="pug">
div
	h6
		q-icon(name="mdi-database-outline")
		|&nbsp;{{ current?.label || 'fuck'}}
	br
	.h7 Установленные приложения
	q-table(flat,
		:columns="cols"
		:rows="rows"
		row-key="id"
		color="primary"
		hide-bottom
		)
		template(v-slot:header='props')
			q-tr(:props='props')
				q-th(auto-width)
				q-th(v-for="col in props.cols" :key='col.name' :props="props") {{ col.label}}
				q-th(auto-width)

		template(v-slot:body='props')
			q-tr(:props='props')
				q-td(auto-width)
					q-btn.exp(flat round dense icon="mdi-chevron-right" color="primary" @click="props.expand = !props.expand" :class='props.expand ? "rot" : ""') 
				q-td(v-for="col in props.cols" :key='col.name' :props="props") {{ col.value}}
				q-td.text-right
					q-btn(flat round dense color="primary" icon="mdi-dots-vertical") 
						q-menu
							q-list
								q-item(clickable)
									q-item-section(side)
										q-icon(name="mdi-pencil" color="primary")
									q-item-section Открыть версию
								q-item(clickable color="negative")
									q-item-section(side)
										q-icon(name="mdi-delete-outline" color="negative")
									q-item-section Удалить версию

			template(v-for="item in expanded" :key='item.id')
				q-tr.inner(:props='props' v-show='props.expand' )
					q-td
					q-td
					q-td {{ item.author }}
					q-td {{ item.version }}
					q-td Архив
					q-td {{ item.published }}
					q-td
						q-btn(flat round dense color="primary" icon="mdi-dots-vertical") 
							q-menu
								q-list
									q-item(clickable)
										q-item-section(side)
											q-icon(name="mdi-pencil" color="primary")
										q-item-section Открыть версию
									q-item(clickable color="negative")
										q-item-section(side)
											q-icon(name="mdi-delete-outline" color="negative")
										q-item-section Удалить версию

	br
	DetailsAppEvents(:showDbColumn='false' :showAppColumn='true')

</template>

<style scoped lang="scss">
h6 .q-icon {
	margin-top: -3px;
	margin-right: 0.5rem;
	font-size: 1.8rem;
}
.exp {
	transition: 0.3s all ease;
}
.rot {
	transform: rotate(90deg);
}
.inner {
	background: #d2dce9;
}
</style>
