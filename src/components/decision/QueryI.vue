<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ChoosePoleDialog from '@/components/decision/ChoosePoleDialog.vue'
import ChooseValueDialog from '@/components/decision/ChooseValueDialog.vue'

const par = ref()
const oper = ref()
const val = ref()

const emit = defineEmits(['dirty'])

const poleDialog = ref(false)

watch(par, (val) => {
	if (val.value == 'field') {
		poleDialog.value = true
	} else if (val) {
		emit('dirty')
	}
})
watch(oper, (val) => {
	if (val) {
		emit('dirty')
	}
})
watch(val, (val) => {
	if (val) {
		emit('dirty')
	}
})
const options1 = [
	{ label: 'Все', value: 'all', type: 0 },
	{ label: 'Я', value: 'me', type: 1 },
	{ label: 'Руководитель', value: 'manager', type: 1 },
	{ label: 'Подчиненные', value: 'subordinates', type: 1 },
	{ label: 'Все подчиненные', value: 'all_subordinates', type: 1 },
	{
		label: 'Все подчиненные временно замещаемого',
		value: 'temp_replacement_subordinates',
		type: 1,
	},
	{
		label: 'Все подчиненные постоянно замещаемого',
		value: 'permanent_replacement_subordinates',
		type: 1,
	},
	{ label: 'Заместитель', value: 'deputy', type: 1 },
	{ label: 'Замещаемый', value: 'replaced', type: 1 },
	{ label: 'Я – первый активный заместитель', value: 'me_first_active_deputy', type: 1 },
	{
		label: 'Я – первый активный постоянный заместитель',
		value: 'me_first_active_permanent_deputy',
		type: 1,
	},
	{
		label: 'Я – первый активный временный заместитель',
		value: 'me_first_active_temp_deputy',
		type: 1,
	},
	{
		label: 'Я – первый активный заместитель исполнения',
		value: 'me_first_active_execution_deputy',
		type: 1,
	},
	{
		label: 'Я – первый активный заместитель ответственного исполнения',
		value: 'me_first_active_responsible_execution_deputy',
		type: 1,
	},
	{
		label: 'Я – первый активный заместитель подписи',
		value: 'me_first_active_sign_deputy',
		type: 1,
	},
	{
		label: 'Я – временный заместитель в период неактивности замещаемого',
		value: 'me_temp_deputy_inactive_period',
		type: 1,
	},
	{ label: 'Я – постоянный заместитель', value: 'me_permanent_deputy', type: 1 },
	{ label: 'Я – заместитель подписи', value: 'me_sign_deputy', type: 1 },
	{ label: 'Сегодня', value: 'today', type: 2 },
	{ label: 'Сейчас', value: 'now', type: 2 },
	{ label: 'Поле', value: 'field', type: 3 },
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

const setParam = (e: string) => {
	par.value = e
}

const valDialog = ref(false)
const calcType = computed(() => {
	return par.value?.type
})
</script>

<template lang="pug">
.node
	.myrow
		q-select(outlined label='Параметр' :options='options1' dense v-model='par')
		q-select(outlined label='Операция' :options='options2' dense v-model='oper')
		q-select(outlined label='Значение' dense v-model='val' @click='valDialog = true')

ChoosePoleDialog(v-model="poleDialog" @save='setParam')
ChooseValueDialog(v-model="valDialog" :type='calcType')
</template>

<style scoped lang="scss">
.node {
	background: #e8edf3;
	border: 1px solid #a8bbd1;
	border-radius: 4px;
	padding: 0.5rem;
	width: 100%;
	position: relative;
	min-height: 58px;
	padding: 7px 20px 10px;
	&:hover {
		border: 1px solid $primary;
	}
}
.myrow {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	column-gap: 1rem;
	width: 100%;
	row-gap: 0.5rem;
}
</style>
