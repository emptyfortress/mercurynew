<script setup lang="ts">
import type { QTableProps } from 'quasar'

const props = defineProps({
	bd: {
		type: String,
		required: true,
		default: '',
	},
})

const options = ['Кадровики', 'Администрация', 'Автор', 'Исполнитель', 'Согласующие', 'Контролер']

const cols: QTableProps['columns'] = [
	{
		name: 'role',
		required: true,
		label: 'Роль',
		align: 'left',
		field: 'role',
		sortable: true,
	},
	{
		name: 'group',
		required: true,
		label: 'Группа в конструкторе',
		align: 'left',
		field: 'group',
		sortable: true,
	},
	{
		name: 'group1',
		required: true,
		label: 'Группа в ' + props.bd,
		align: 'left',
		field: 'group1',
		sortable: true,
	},
]

const rows: any = [
	{
		id: 0,
		role: 'Кадровик',
		group: 'HR-отдел',
		group1: 'Отдел кадров',
	},
	{
		id: 1,
		role: 'Согласующий',
		group: 'Согласующие',
		group1: 'Согласующие',
	},
	{
		id: 2,
		role: 'Контролер',
		group: 'Контролеры',
		group1: 'Администрация',
	},
]
</script>

<template lang="pug">
.q-mb-sm Справочник сотрудников
q-table(flat,
	:columns="cols"
	:rows="rows"
	row-key="id"
	color="primary"
	hide-bottom
	)
	template(v-slot:header='props')
		q-tr.grey
			q-td(v-for="item in props.cols") {{ item.label }}

	template(v-slot:body-cell-group1='props')
		q-td(:props="props")
			q-select(v-model="props.row.group1" :options='options' dense outlined)

</template>

<style scoped lang="scss">
.q-select {
	min-width: 200px;
}
.grid {
	display: grid;
	grid-template-columns: auto auto 200px;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.grey {
	height: 28px;
	.q-td {
		// background: #cecece;
		background: var(--middle);
		font-size: 0.8rem;
		font-weight: 600;
		border: 1px solid #fff;
		border-bottom: 1px solid $secondary;
	}
}
</style>
