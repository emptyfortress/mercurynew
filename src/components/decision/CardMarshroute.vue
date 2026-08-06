<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import DndTable from '@/components/common/DndTable.vue'
import { useRouter } from 'vue-router'
import type { QTableColumn } from 'quasar'
import ConditionDialog from '@/components/condition/ConditionDialog.vue'
import type {
	ConditionNode,
	ConditionGroupNode,
	ConditionLeafNode,
} from '@/components/condition/conditionTypes'

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

const rows = computed(() => {
	const children = approveStore.selectedElement?.children ?? []
	return children.map((child, index) => ({
		...child,
		text1: '',
		first: index == 0,
		repeat: 'Всегда',
		condition: index === children.length - 1,
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
	goal.value = row.id
	conditionDialog.value = !conditionDialog.value
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

const selectedId = ref(null)
const good = ref('')

const remove = (row: any) => {
	let ind = approveStore.selectedElement?.children.findIndex((el) => el.id == row.id)
	if (ind !== undefined && ind > -1) {
		approveStore.selectedElement?.children.splice(ind, 1)
	}
}

const remove1 = (row: any) => {
	let ind = rows1.value.findIndex((el) => el.id == row.id)
	if (ind !== undefined && ind > -1) {
		rows1.value.splice(ind, 1)
	}
}

const addEtap = () => {
	approveStore.toggleAdd(null)
}

const goedit = (row: any) => {
	router.push({
		name: 'start',
		params: {
			viewId: row.id,
		},
	})
}

const colsAdd: QTableColumn[] = [
	{
		name: 'text',
		label: 'Этап',
		field: 'text',
		align: 'left',
	},
	{
		name: 'author',
		label: 'Автор',
		field: 'author',
		align: 'left',
	},
	{
		name: 'used',
		label: 'Использование',
		field: 'used',
		align: 'right',
	},
]

const selectedAdd = ref<any[]>([])
const query = ref(null)
const link = () => {
	approveStore.toggleAdd(selectedAdd.value[0])
}
const copy = () => {
	selectedAdd.value[0].template = false
	approveStore.addCopy = true
	approveStore.toggleAdd(selectedAdd.value[0])
}

const handleClick = (event: Event, row: any) => {
	selectedAdd.value[0] = row
}

// function createEmptyGroup(): ConditionGroupNode {
// 	return [
// 		{
// 			id: 'root',
// 			type: 'AND',
// 			kind: 'group',
// 			children: [],
// 		},
// 	]
// }

// const tree = ref<ConditionGroupNode>(createEmptyGroup())
const tree = ref<ConditionGroupNode>({
	id: 'root',
	type: 'AND',
	kind: 'group',
	children: [],
})

const goal = ref()

const save = (e: any) => {}
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
		DndTable(:columns='cols' :rows='rows' v-model:selected='selectedId' @removeRow="remove" @edit='goedit')
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


		.special
			q-btn.q-mt-sm(unelevated color="primary" label="Создать этап" icon="mdi-plus-circle" @click="addEtap" size="sm") 
			q-btn.q-mt-sm(unelevated color="primary" label="Добавить этап" icon="mdi-link-variant" @click="showAddDialog" size="sm") 
			template(v-if='selectedId')
				div
				q-input.q-mt-sm(v-model="good" label='Отрицательное завершение' dense outlined hideBottomSpace)
					template(v-slot:append)
						q-icon(name="mdi-dots-horizontal" color="secondary")
						q-icon(name="mdi-close" color="secondary" size="xs")
				q-input.q-mt-sm(v-model="good"  label='Положительное завершение' dense outlined)
					template(v-slot:append)
						q-icon(name="mdi-dots-horizontal" color="secondary")
						q-icon(name="mdi-close" color="secondary" size="xs")

	fieldset
		legend Настройка итоговых состояних документов
		DndTable(:columns='cols1' :rows='rows1' @removeRow="remove1")
		q-btn.q-mt-sm(unelevated color="primary" label="Добавить состояние" icon="mdi-plus-circle" @click="showAddDialog" size="sm") 

	q-dialog(v-model="addDialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card(style='width: 640px; min-height: 200px')
			q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
			q-card-section
				.text-h6 Добавить типовой этап

			q-card-section
				q-input(v-model="query" dense clearable)
					template(v-slot:prepend)
						q-icon(name="mdi-magnify" color="primary")
				q-table.q-mt-md(
					flat
					color="primary"
					:columns="colsAdd"
					:rows="approveStore.sharedEtaps"
					row-key="id"
					:filter='query'
					hideBottom
					selection="single"
					v-model:selected="selectedAdd"
					dense
					@rowClick='handleClick'
				)
					template(v-slot:body-cell-used='props')
						q-td.text-right(:props='props') {{ props.row.count }}


			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup) 
				q-space
				q-btn(flat color="primary" label="Сделать копию" @click="copy") 
				q-btn(unelevated color="primary" label="Вставить ссылку" @click="link") 

	ConditionDialog(
		v-model="conditionDialog"
		:etap-list="rows"
		:goal-stage-id='goal'
		:tree="tree"
		@update:tree="save"
	)
</template>

<style scoped lang="scss">
.special {
	display: grid;
	grid-template-columns: auto auto 50px 1fr 1fr;
	// justify-items: start;
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
</style>
