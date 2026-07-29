<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'

interface Item {
	id: number
	label: string
	semantic: string
	sign: string
	raz: boolean
	dva: boolean
}

const approveStore = useApproveStore()
const typovoy = computed(() => {
	return approveStore.selectedElement?.template ? true : false
})

const name = ref('Согласование этапа')

const options = ['Согласование', 'Подписание', 'Консолидация']

const sogl = ref<Item[]>([
	{
		id: 1,
		label: 'Согласовано',
		semantic: 'Положительная',
		sign: 'Согласовано',
		raz: false,
		dva: false,
	},
	{
		id: 2,
		label: 'Согласовано с замечаниями',
		semantic: 'Условно-положительная',
		sign: 'Согласовано с замечаниями',
		raz: false,
		dva: false,
	},
	{
		id: 3,
		label: 'Отказано',
		semantic: 'Отрицательная',
		sign: 'Отказано',
		raz: false,
		dva: false,
	},
])

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('node')
	},
}

const [parent, tapes] = useDragAndDrop(sogl.value, config)

const remove = (id: number) => {
	tapes.value = tapes.value.filter((item) => item.id !== id)
}

const sod = ref(
	'Примите участие в согласовании документов. Для этого ознакомьтесь, пожалуйста, с их содержанием, зафиксируйте свои замечания и предложения и укажите, можно ли считать документы согласованными или они требуют доработки.'
)

const selection = ref<Item | null>(null)

const select = (item: any) => {
	if (selection.value == item) {
		selection.value = null
	} else selection.value = item
}

const isSelected = (id: number) => {
	return selection.value?.id == id ? true : false
}

const vid = ref('')
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

const business = ref('')
const business1 = ref('Этап')
const dlit = ref(2)
const dlit1 = ref(1)
const rad = ref('one')
const finish = ref(false)
const sem = ref('Положительная')
const dialog = ref(false)

const submit = () => {
	if (editMode.value && editItem.value) {
		editItem.value.label = varName.value
		editItem.value.semantic = varSem.value
		editItem.value.sign = varMetka.value
		editItem.value.raz = varAdd.value
		editItem.value.dva = varAllow.value
	} else {
		let tmp = {
			id: Date.now(),
			label: varName.value,
			semantic: varSem.value,
			sign: varMetka.value || varName.value,
			raz: varAdd.value,
			dva: varAllow.value,
		}
		tapes.value.push(tmp)
	}
	dialog.value = !dialog.value
}
const varName = ref('')
const varSem = ref('Положительная')
const varMetka = ref('')
const varAdd = ref(false)
const varAllow = ref(false)

const editMode = ref(false)

const editItem = ref<Item | null>(null)

const edit = (item: Item) => {
	varName.value = item.label
	varSem.value = item.semantic
	varMetka.value = item.sign
	varAdd.value = item.raz
	varAllow.value = item.dva
	editMode.value = true
	editItem.value = item
	dialog.value = !dialog.value
}

const add = () => {
	editMode.value = false
	dialog.value = !dialog.value
}

const calcLabel = computed(() => {
	return editMode.value ? 'Сохранить' : 'Добавить'
})

const options1 = ['Процесс', 'Цикл', 'Этап']
</script>

<template lang="pug">
fieldset
	legend Задание участника этапа
	.grid2
		q-select(v-model="vid" dense label="Вид" outlined :options="options")
		q-input(v-model="name" dense label="Название" outlined)
fieldset
	legend Содержание
	q-input(v-model="sod" type="textarea" dense outlined autogrow)

fieldset
	legend Варианты решений
	.gridtable
		.tablehead Название
		.tablehead Семантика
		.tablehead Метка подписи
		.tablehead
		.tablehead

	div(ref='parent')
		.node(v-if='tapes.length < 1') Не настроено
		.node(
			v-else,
			v-for="item in tapes",
			:key="item.id",
			@click.stop='select(item)'
			:class='{selected: isSelected(item.id)}'
			)
			div {{ item.label }}
			div {{ item.semantic }}
			div {{ item.sign }}
			q-btn(flat round icon="mdi-pencil-outline" color="secondary" @click.stop="edit(item)" size="sm") 
			q-btn(flat round icon="mdi-close" color="secondary" size="sm") 
				q-menu
					q-list
						q-item.pink(clickable @click="remove(item.id)")
							q-item-section Удалить

		.row.justify-between.items-center.q-mt-sm
			q-btn(unelevated color="primary" label="Добавить" size="sm" icon="mdi-plus-circle" @click="add") 
			.q-gutter-x-md(v-if='selection')
				q-checkbox(v-model='selection.raz' label='Не добавлять решение в лист согласования' dense :disable='typovoy')
				q-checkbox(v-model='selection.dva' label='Разрешать создавать подчиненные задания' dense :disable='typovoy')

fieldset
	legend Дополнительно
	.grid2
		.column.q-gutter-y-sm
			q-input(v-model="business" dense label="Бизнес-календарь" outlined)
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="primary" )

		.column.q-gutter-y-sm
			q-select(v-model="business1" dense label="Уровень дерева версий" outlined :options="options1")

	.row.q-gutter-x-md.q-mt-md
		q-input(v-model="dlit" dense label="Длительность (часы)" outlined type="number")
		q-input(v-model="dlit1" dense label="В следующих циклах" outlined type="number")
		q-radio(v-model="rad" val='one' label="Длительность указана для задания" dense)
		q-radio(v-model="rad" val='two' label="Длительность указана для этапа" dense)

fieldset
	legend Автосогласование
	.grid2
		q-checkbox.che(v-model='finish' label='Автоматически завершать согласование по истечении срока исполнения' dense :disable='typovoy')
		q-select(v-model="sem" dense label="Семантика завершения задания" outlined :options="semoptions")

q-dialog(v-model="dialog" backdrop-filter="blur(4px) saturate(150%)")
	q-card()
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Вариант решения

		q-form(@submit="submit")
			q-card-section
				.column.q-gutter-y-sm
					q-input(v-model="varName" autofocus  dense label="Название" outlined)
					q-select(v-model="varSem" dense label="Семантика" outlined :options="semoptions")
					q-input(v-model="varMetka" dense label="Метка подписи" outlined)
					q-checkbox(v-model='varAdd' label='Не добавлять решение в лист согласования' dense)
					q-checkbox(v-model='varAllow' label='Разрешать создавать подчиненные задания' dense)
			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup) 
				q-btn(unelevated color="primary" :label="calcLabel" type="submit") 
</template>

<style scoped lang="scss">
.che {
	line-height: 1.1;
}
.grid2 {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	justify-items: stretch;
	align-items: start;
	column-gap: 2rem;
	row-gap: 0.5rem;
}
.gridtable {
	display: grid;
	grid-template-columns: repeat(3, 1fr) 54px;
	// justify-items: start;
	// align-items: stretch;
	column-gap: 1rem;
	row-gap: 0.5rem;
	background: var(--bgLight);
	padding: 3px;
}
.tablehead {
	font-size: 0.75rem;
	color: #555;
}
.node {
	padding: 4px 0.5rem;
	background: var(--bgLight);
	margin-top: 1px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr auto auto;
	align-items: center;
	user-select: none;
	cursor: pointer;
	.q-btn {
		visibility: hidden;
	}
	&:hover {
		.q-btn {
			visibility: visible;
		}
	}
	&.selected {
		background: var(--selection);
	}
}
.ghost {
	height: 36px;
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
	}
}
</style>
