<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import DndTable from '@/components/common/DndTable.vue'
import { useRouter } from 'vue-router'
import ConditionDialog from '@/components/condition/ConditionDialog.vue'
import type { ConditionGroupNode } from '@/components/condition/conditionTypes'
import type { TreeElement } from '@/components/condition/conditionTypes'
import { dragContext } from '@he-tree/vue'

interface List {
	id: string
	text: string
	text1: string
	selected: boolean
	hidden: boolean
	type: number
	author: string
	condition?: ConditionGroupNode
}

const router = useRouter()

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

const etapsRows = computed(() => {
	var children: TreeElement[] = []
	if (!!approveStore.selectedElement) {
		children = approveStore.getChildren(approveStore.selectedElement.id)
	}
	return children.map((child, index) => ({
		...child,
		text1: '',
		first: index == 0,
		repeat: 'Всегда',
		condition: child.condition,
		regim: index == 0 ? 'Согласование' : 'Консолидация',
		marsh: index == 1 ? 'Параллельно' : 'Последовательно',
		sogl: index == 0 ? 'Согласующие' : 'Инициатор',
		duration: index == 0 ? 8 : 24,
		selected: false,
		hidden: false,
		author: 'admin',
	}))
})

const conditionDialog = ref(false)

const setCondition = (row: any) => {
	goal.value = row
	conditionDialog.value = !conditionDialog.value
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
const change1 = (row: any, e: string) => {
	row.state = e
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

const selectedId = ref(null)
const good = ref('')

const remove = (row: TreeElement) => {
	const parentId = approveStore.selectedElement?.id
	if (!parentId) return
	const idx = row.parentId?.indexOf(parentId)
	if (idx !== undefined && idx > -1) {
		row.parentId?.splice(idx, 1)
	}
}

const remove1 = (row: any) => {
	let ind = rows1.value.findIndex((el) => el.id == row.id)
	if (ind !== undefined && ind > -1) {
		rows1.value.splice(ind, 1)
	}
}

const goedit = (row: any) => {
	router.push({
		name: 'start',
		params: {
			viewId: row.id,
		},
	})
}

const tree = ref<ConditionGroupNode>({
	id: 'root',
	type: 'AND',
	kind1: 'group',
	children: [],
})

const goal = ref<List | null>(null)

const save = (e: any) => {
	if (goal.value) {
		goal.value.condition = e
	}
}

const isOverTable = ref(false)

function onTableDrop() {
	const draggedData = dragContext.dragNode?.data
	if (!draggedData) return

	draggedData.first = false
	draggedData.repeat = 'Всегда'
	draggedData.condition = null
	draggedData.regim = 'Консолидация'
	draggedData.marsh = 'Последовательно'
	draggedData.sogl = 'Инициатор'
	draggedData.duration = 24
	draggedData.selected = false
	draggedData.hidden = false

	const newParentId = approveStore.selectedElement?.id
	if (newParentId && !draggedData.parentId.includes(newParentId)) {
		draggedData.parentId.push(newParentId)
	}
}

function checkDropAllowed() {
	return dragContext.dragNode?.data?.filetype === 3
}

const options1 = ['Согласован', 'Отклонен', 'Делегирован', 'Делегирован', 'В архиве', 'Черновик']

const addState = () => {
	rows1.value.push({
		id: Date.now(),
		vid: 'Новый вид',
		state: 'Черновик',
	})
}

const marshList = computed(() => {
	return approveStore.getParentsInfo(approveStore.selectedElement?.parentId)
})

const goto = (id: string) => {
	router.push({
		name: 'start',
		params: { viewId: id },
	})
}
</script>

<template lang="pug">
.q-ma-md
	fieldset
		legend Согласования ({{ approveStore.selectedElement?.parentId?.length }})
		.emp(v-if='approveStore.selectedElement?.parentId?.length == 0')
			q-icon.q-mr-md(name="mdi-information-outline" color="secondary" size="md")
			|Данный маршрут нигде не используется.
		template(v-else)
			.warn()
				q-icon.q-mr-md(name="mdi-information-outline" size="md" color="primary")
				|Данный маршрут используется в согласованиях: 
				.list(v-for="item in marshList" :key="item.id" @click='goto(item.id)') {{ item.name }}

	fieldset
		legend Общие
		.grid3
			q-input(v-model="name" label="Название" dense outlined )
			q-input(v-model="author" label="Автор" dense outlined )
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="secondary")
					q-icon(name="mdi-close" color="secondary" size="xs")
			q-input(v-model="registrator" label="Регистратор" dense outlined )
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="secondary")
					q-icon(name="mdi-close" color="secondary" size="xs")
			q-checkbox(v-model='check' label='Усовершенствованный маршрут' dense)

	fieldset
		legend Карта этапов
		.info
			q-icon(name="mdi-information" color="primary" size="sm")
			div Чтобы добавить этап в маршрут - перетащите его в таблицу из дерева слева.
		DndTable(
			:columns='cols',
			:rows='etapsRows',
			v-model:selected='selectedId',
			v-model:drag-over='isOverTable',
			@removeRow="remove",
			@edit='goedit',
			@table-drop="onTableDrop"
			:can-drop-checker="checkDropAllowed"
		)
			template(#cell-condition="{ row }")
				q-chip(v-if='row.condition' color="green-3" size="sm" selected clickable @click.stop="setCondition(row)") Условие
				q-chip(v-if='!row.condition' size="sm" clickable textColor="black" @click.stop='setCondition(row)') Задать

			template(#cell-repeat="{ row }")
				.sel(@click.stop)
					span {{ row.repeat }}
					q-menu
						q-list
							q-item(clickable dense v-for="item in options" :key="item" @click="change(row, item)" v-close-popup)
								q-item-section {{ item }}



	fieldset
		legend Настройка семантики завершения
		.grid4
			label Отрицательное завершение:
			q-input(v-model="good" dense outlined hideBottomSpace)
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="secondary")
					q-icon(name="mdi-close" color="secondary" size="xs")
			div 
			label Положительное завершение:
			q-input(v-model="good" dense outlined)
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="secondary")
					q-icon(name="mdi-close" color="secondary" size="xs")

	fieldset
		legend Настройка итоговых состояних документов
		DndTable(:columns='cols1' :rows='rows1' @removeRow="remove1" simple)
			template(#cell-state='{row}')
				.sel(@click.stop)
					span {{ row.state }}
					q-menu
						q-list
							q-item(clickable dense v-for="item in options1" :key="item" @click="change1(row, item)" v-close-popup)
								q-item-section {{ item }}
		q-btn.q-mt-sm(unelevated color="primary" label="Добавить состояние" icon="mdi-plus-circle" @click="addState" size="sm") 

	ConditionDialog(
		v-model="conditionDialog"
		:etap-list="etapsRows"
		:goal-stage='goal'
		:tree="tree"
		@update:tree="save"
	)
</template>

<style scoped lang="scss">
.special {
	display: grid;
	grid-template-columns: auto auto 50px 1fr 1fr;
	align-items: center;
	column-gap: 0.5rem;
	row-gap: 0.5rem;
}
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
		padding: 1px 8px;
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
.fold {
	font-size: 0.9rem;
}
.grid4 {
	display: grid;
	grid-template-columns: auto 1fr 50px auto 1fr;
	align-items: center;
	column-gap: 0.5rem;
}
.info {
	padding: 3px 1rem;
	border: 1px solid var(--my-border-color);
	display: flex;
	align-items: center;
	margin-bottom: 0.5rem;
	background: hsl(216, 44%, 83%);
	gap: 1rem;
	font-size: 0.8rem;
}
.warn {
	display: flex;
	align-items: center;
	white-space: wrap;
	.list {
		font-weight: 600;
		color: $primary;
		margin-left: 1rem;
		cursor: pointer;
		text-decoration: underline;
	}
}
</style>
