<script setup lang="ts">
import { ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { uid } from 'quasar'

interface Row {
	id: string
	parameter: string
	operation: string
	value: string
	group: boolean
}
const rows = ref<Row[]>([])

const columns = ref<QTableColumn[]>([
	{ name: 'parameter', label: 'Параметр', field: 'parameter', align: 'left', sortable: false },
	{ name: 'operation', label: 'Операция', field: 'operation', align: 'left', sortable: false },
	{ name: 'value', label: 'Значение', field: 'value', align: 'left' },
	{ name: 'action', label: '', field: 'action', align: 'right' },
])

const pagination = ref({
	rowsPerPage: 0,
})

const emit = defineEmits(['dirty'])

const addGroup = () => {
	emit('dirty')
	rows.value.push({
		id: uid(),
		parameter: '',
		operation: '',
		value: '',
		group: true,
	})
}

const addRule = () => {
	emit('dirty')
	rows.value.push({
		id: uid(),
		parameter: 'Выберите',
		operation: 'Выберите',
		value: 'Выберите',
		group: false,
	})
}

const group = ref('И')
const toggleGroup = () => {
	group.value == 'И' ? (group.value = 'ИЛИ') : (group.value = 'И')
}

const removeRow = (id: string) => {
	rows.value = rows.value.filter((row) => row.id !== id)
	emit('dirty')
}

const options1 = [
	{ label: 'Все', value: 'all' },
	{ label: 'Я', value: 'me' },
	{ label: 'Руководитель', value: 'manager' },
	{ label: 'Подчиненные', value: 'subordinates' },
	{ label: 'Все подчиненные', value: 'all_subordinates' },
	{ label: 'Все подчиненные временно замещаемого', value: 'temp_replacement_subordinates' },
	{ label: 'Все подчиненные постоянно замещаемого', value: 'permanent_replacement_subordinates' },
	{ label: 'Заместитель', value: 'deputy' },
	{ label: 'Замещаемый', value: 'replaced' },
	{ label: 'Я – первый активный заместитель', value: 'me_first_active_deputy' },
	{
		label: 'Я – первый активный постоянный заместитель',
		value: 'me_first_active_permanent_deputy',
	},
	{ label: 'Я – первый активный временный заместитель', value: 'me_first_active_temp_deputy' },
	{
		label: 'Я – первый активный заместитель исполнения',
		value: 'me_first_active_execution_deputy',
	},
	{
		label: 'Я – первый активный заместитель ответственного исполнения',
		value: 'me_first_active_responsible_execution_deputy',
	},
	{ label: 'Я – первый активный заместитель подписи', value: 'me_first_active_sign_deputy' },
	{
		label: 'Я – временный заместитель в период неактивности замещаемого',
		value: 'me_temp_deputy_inactive_period',
	},
	{ label: 'Я – постоянный заместитель', value: 'me_permanent_deputy' },
	{ label: 'Я – заместитель подписи', value: 'me_sign_deputy' },
	{ label: 'Сегодня', value: 'today' },
	{ label: 'Сейчас', value: 'now' },
	{ label: 'Поле', value: 'field' },
]
const options2 = [
	{ label: 'Равно', value: 'equals' },
	{ label: 'Не равно', value: 'not_equals' },
	{ label: 'Является руководителем', value: 'is_manager' },
	{ label: 'В том же подразделении', value: 'same_department' },
	{ label: 'В группе с подчиненными', value: 'group_with_subordinates' },
	{ label: 'Не в группе', value: 'not_in_group' },
	{ label: 'В группе из поля карточки', value: 'group_from_card_field' },
	{ label: 'В группу из поля карточки поверхностно', value: 'group_from_card_field_shallow' },
	{ label: 'В подразделении из поля карточки', value: 'department_from_card_field' },
	{
		label: 'В подразделении из поля карточки поверхностно',
		value: 'department_from_card_field_shallow',
	},
	{ label: 'В подразделении без подчиненных', value: 'department_without_subordinates' },
	{ label: 'Не в подразделении', value: 'not_in_department' },
]
</script>

<template lang="pug">
.row.justify-between.align-end
	div Правила определения роли:
	.q-gutter-x-sm
		q-btn(unelevated color="positive" label="Создать группу" @click="addGroup" size='sm')
		q-btn(unelevated color="positive" label="Создать правило" @click="addRule" size='sm')

q-table.q-mt-md(
	:rows="rows"
	:columns="columns"
	:pagination="pagination"
	row-key="id"
	flat
	hide-pagination
)
	template(v-slot:header="props")
		q-tr(:props="props")
			q-th(auto-width)
			q-th(
				v-for="col in props.cols"
				:key="col.name"
				:props="props"
			)
				| {{ col.label }}
	template(v-slot:body="props")
		q-tr(v-if="props.row.group" :props="props")
			q-td(auto-width)
				q-btn(round flat dense color="secondary" :icon="props.expand ? 'remove' : 'add'" @click="props.expand = !props.expand" size='sm') 
			q-td(colspan='3')
				q-btn(unelevated color="primary" :label="group" @click="toggleGroup") 
			q-td.text-right
				q-btn(flat round dense icon="mdi-delete-outline" color="grey" size='sm') 
					q-menu
						q-list
							q-item(clickable @click="removeRow(props.row.id)" ).pink
								q-item-section Удалить

		q-tr(v-else :props="props")
			q-td(auto-width)
			q-td(:props="props" key='parameter')
				q-select(v-model="props.row.parameter" outlined dense :options='options1' emit-value map-options)
			q-td(:props="props" key='operation')
				q-select(v-model="props.row.operation" outlined dense :options='options2' emit-value map-options)
			q-td(:props="props" key='value')
				q-select(v-model="props.row.value" outlined dense)
			q-td(:props="props" key='action')
				q-btn(flat round dense icon="mdi-delete-outline" color="grey" size='sm') 
					q-menu
						q-list
							q-item(clickable @click="removeRow(props.row.id)" ).pink
								q-item-section Удалить
</template>

<style scoped lang="scss"></style>
