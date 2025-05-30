<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useKeys } from '@/stores/keys'
import { useQuasar } from 'quasar'

const props = defineProps({
	// button: {
	// 	type: Boolean,
	// 	default: false,
	// },
	folder: {
		type: String,
		required: true,
		default: '',
	},
})

const poisk = defineModel('poisk')
const $q = useQuasar()

const mykeys = useKeys()
const isFake = ref(true)

const isLoaded = ref(false)

watch(poisk, (val) => {
	if (val) {
		refresh()
	}
})

const refresh = () => {
	isLoaded.value = false
	setTimeout(() => {
		isLoaded.value = true
	}, 2000)

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Запрос выполнен, данные обновлены',
			position: 'bottom',
		})
	}, 2100)

	isFake.value = false
	poisk.value = false
}

onMounted(() => {
	setTimeout(() => {
		isLoaded.value = true
	}, 1000)
})

const rows = [
	{
		id: 0,
		date: '2025-02-20',
		date1: '2025-01-20',
		author: 'Иванов И.И.',
		comment: 'Внеочередной',
		status: 'Согласовано',
	},
	{
		id: 1,
		date: '2025-02-21',
		date1: '2025-03-21',
		author: 'Сидоров А.А.',
		status: 'Согласовано',
	},
	{
		id: 2,
		date: '2025-02-22',
		date1: '2025-03-22',
		author: 'Петров П.П.',
		comment: 'За прошлый год',
		status: 'Подготовка',
	},
	{
		id: 3,
		date: '2025-02-23',
		date1: '2025-02-23',
		author: 'Васильев В.В.',
		comment: 'Учебный',
		status: 'На согласовании',
	},
	{
		id: 4,
		date: '2025-02-24',
		date1: '2025-03-24',
		author: 'Козлов Д.Д.',
		status: 'На доработке',
	},
]

const newRows = [
	{
		id: 100,
		date: '2025-03-01',
		date1: '2025-04-15',
		author: 'Я',
		comment: 'Учебный',
		status: 'Завершено',
	},
	{
		id: 101,
		date: '2025-03-05',
		date1: '2025-04-20',
		author: 'Кузнецов В.А.',
		comment: '',
		status: 'Согласовано',
	},
	{
		id: 102,
		date: '2025-03-10',
		date1: '2025-04-25',
		author: 'Я',
		comment: 'Уточнить даты',
		status: 'Подготовка',
	},
	{
		id: 103,
		date: '2025-03-12',
		date1: '2025-04-28',
		author: 'Я',
		comment: 'Срочно!',
		status: 'На согласовании',
	},
	{
		id: 104,
		date: '2025-03-15',
		date1: '2025-05-01',
		author: 'Михайлов С.В.',
		comment: 'По болезни',
		status: 'На доработке',
	},
]

const calcClass = computed(() => {
	if (mykeys.theme == 1) return 'contr'
	if (mykeys.theme == 2) return 'mex'
	if (mykeys.theme == 3) return 'mex1'
	if (mykeys.theme == 4) return 'water'
	return 'def'
})

const emit = defineEmits(['startPred'])
const action = () => {
	emit('startPred')
}

const myrows = computed(() => {
	return isFake.value ? rows : newRows
})
</script>

<template lang="pug">
.loading.q-mt-md
	.flo
		.inf Предпросмотр папки "{{ props.folder }}"
		q-btn(round icon="mdi-tune-vertical-variant" color="primary" @click="action" size="12px") 
			q-tooltip Настройки представления

	.ready(v-if='isLoaded')
		q-table(bordered
			flat
			:columns="mykeys.activeColumns"
			:rows="myrows"
			hide-bottom
			:table-header-class="calcClass"
		)

	q-markup-table(v-else)
		thead
			tr
				th.text-left()
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
		tbody
			tr(v-for="n in 5" :key="n")
				td.text-right
					q-skeleton( type="text" width="150px")
				td.text-right
					q-skeleton( type="text" width="150px")
				td.text-right
					q-skeleton( type="text" width="150px")
				td.text-right
					q-skeleton( type="text" width="150px")

</template>

<style scoped lang="scss">
.flo {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 0.5rem;
	font-size: 1.1rem;
}

.ready {
	position: relative;
}

.water {
	font-size: 6.5rem;
	font-weight: 600;
	position: absolute;
	transform-origin: center center;
	top: 9rem;
	left: 50%;
	transform: translateX(-50%) rotate(-15deg);
	z-index: 3;
	color: red;
	opacity: 0.1;
	line-height: 0;
}
:deep(.q-table th) {
	font-size: 0.7rem;
	font-weight: 400;
	border: 1px solid #fff;
}
:deep(.q-table thead tr) {
	height: 28px;
}
:deep(.q-table thead tr.def) {
	background: #ccc;
}
:deep(.q-table thead tr.contr) {
	background: #333;
	color: #fff;
}
:deep(.q-table thead tr.mex1) {
	background: orange;
}
:deep(.q-table thead tr.mex) {
	background: $amber-10;
	color: #fff;
}
:deep(.q-table thead tr.water) {
	background: $blue-3;
	color: $blue-10;
}
</style>
