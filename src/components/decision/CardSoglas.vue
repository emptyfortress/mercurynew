<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import DndTable from '@/components/common/DndTable.vue'
import { useRouter } from 'vue-router'
import type { TreeElement } from '@/components/condition/conditionTypes'
import { dragContext } from '@he-tree/vue'

const router = useRouter()
const approveStore = useApproveStore()
const name = computed(() => approveStore.selectedElement?.text)
const start = ref(false)
const files = ref(false)

const cols = [
	{
		name: 'route',
		label: 'Маршрут',
		field: 'text',
		align: 'left',
	},
	{
		name: 'descr',
		label: 'Описание условия',
		field: 'descr',
		align: 'left',
	},
	{
		name: 'condition',
		label: 'Условие',
		field: 'condition',
		align: 'left',
	},
	{
		name: 'priority',
		label: 'Приоритет',
		field: 'priority',
		align: 'center',
	},
]

const rows = computed(() => {
	var children: TreeElement[] = []
	if (!!approveStore.selectedElement) {
		children = approveStore.getChildren(approveStore.selectedElement.id)
	}
	return children.map((child, index) => ({
		...child,
		descr: '',
		condition: '',
		priority: 2,
	}))
})

const defaultRoute = computed(() => {
	return rows.value[0].text
})

const restRows = computed(() => {
	// return rows.value.slice(1)
	return rows.value
})

const remove = (row: TreeElement) => {
	const parentId = approveStore.selectedElement?.id
	if (!parentId) return
	const idx = row.parentId?.indexOf(parentId)
	if (idx !== undefined && idx > -1) {
		row.parentId?.splice(idx, 1)
	}
}

const selectedId = ref(rows.value[0].id)

const goedit = (row: any) => {
	router.push({
		name: 'start',
		params: {
			viewId: row.id,
		},
	})
}

interface List {
	id: string
	parentId: string[]
	text: string
	descr: string
	selected: boolean
	condition: any
	priority: number
}

const goal = ref<List | null>(null)
const conditionDialog = ref(false)

const setCondition = (row: any) => {
	console.log(row)
	goal.value = row
	conditionDialog.value = !conditionDialog.value
}

const isOverTable = ref(false)

function onTableDrop() {
	const draggedData = dragContext.dragNode?.data
	if (!draggedData) return

	draggedData.descr = null
	draggedData.condition = null
	draggedData.selected = false
	draggedData.hidden = false

	const newParentId = approveStore.selectedElement?.id
	if (newParentId && !draggedData.parentId.includes(newParentId)) {
		draggedData.parentId.push(newParentId)
	}
}

function checkDropAllowed() {
	return dragContext.dragNode?.data?.filetype === 2
}

const selRoute = computed(() => {
	return selectedId.value ? approveStore.getNameById(selectedId.value) : defaultRoute.value
})

const colsEtaps = [
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
		children = approveStore.getChildren(selectedId.value)
	}
	return children.map((child, index) => ({
		...child,
		text1: '',
		first: index == 0,
		repeat: 'Всегда',
		condition: null,
		regim: index == 0 ? 'Согласование' : 'Консолидация',
		marsh: index == 1 ? 'Параллельно' : 'Последовательно',
		sogl: index == 0 ? 'Согласующие' : 'Инициатор',
		duration: index == 0 ? 8 : 24,
		selected: false,
		hidden: false,
		author: 'admin',
	}))
})
</script>

<template lang="pug">
.q-ma-md
	fieldset
		legend Основные настройки
		.grid2
			q-input(v-model="name" label="Название" dense outlined )
			.q-gutter-y-sm
				q-checkbox(v-model='start' label='Запускать согласование без показа карточки' dense)
				q-checkbox(v-model='files' label='Запускать согласование без показа карточки' dense)
			q-input(v-model="defaultRoute" label="Маршрут по умолчанию" dense outlined )
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="secondary")
					q-icon(name="mdi-close" color="secondary")

		.q-mt-lg Маршрут согласования по условию
		DndTable(
			:columns='cols',
			:rows='restRows',
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

			template(#cell-priority="{ row }")
				.link {{ row.priority }}
					q-popup-edit(v-model="row.priority" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" type="number")

	fieldset
		legend Этапы маршрута {{ selRoute }}
		DndTable(
			:columns='colsEtaps',
			:rows='etapsRows',
			@edit='goedit',
			disableDragHighlight
		)

	q-dialog(v-model="conditionDialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card
			q-btn.close(icon="mdi-close" color="negative" unelevated round dense v-close-popup)
			q-card-section
				.text-h6 Атрибутивный поиск

			q-card-section
				div Здесь настройка атрибутивного поиска
				div И поле для текстового описания.
			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup) 
				q-btn(unelevated color="primary" label="Сохранить" @click="" v-close-popup) 
</template>

<style scoped lang="scss">
.grid2 {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: top;
	column-gap: 1rem;
}
.link {
	max-width: 50px;
	color: $primary;
	border-bottom: 1px dotted $primary;
}
</style>
