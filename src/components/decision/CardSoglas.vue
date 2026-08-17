<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import DndTable from '@/components/common/DndTable.vue'
import { useRouter } from 'vue-router'
import type { TreeElement } from '@/components/condition/conditionTypes'
import { dragContext } from '@he-tree/vue'

const router = useRouter()
const approveStore = useApproveStore()
// const name = computed(() => approveStore.selectedElement?.text)
const name = ref(approveStore.selectedElement?.text)

const start = ref(false)
const files = ref(false)

const cols = [
	{
		name: 'priority',
		label: 'Приоритет',
		field: 'priority',
		align: 'center',
	},
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
]

const rows = computed(() => {
	var children: TreeElement[] = []
	if (!!approveStore.selectedElement) {
		children = approveStore.getChildren(approveStore.selectedElement.id)
	}

	return children.map((child, index) => ({
		...child,
		descr: child.descr,
		condition: child.condition,
	}))
})

const remove = (row: TreeElement) => {
	const parentId = approveStore.selectedElement?.id
	if (!parentId) return
	const idx = row.parentId?.indexOf(parentId)
	if (idx !== undefined && idx > -1) {
		row.parentId?.splice(idx, 1)
	}
}

const selectedId = ref(null)

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
	if (row) {
		goal.value = row
		descr.value = row.descr
		active.value = !!row.condition
	} else {
		goal.value = row
		descr.value = ''
		active.value = false
	}
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
	return selectedId.value ? approveStore.getNameById(selectedId.value) : null
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
	if (!!approveStore.selectedElement && selectedId.value) {
		children = approveStore.getChildren(selectedId.value)
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

const descr = ref('')
const active = ref(false)

const handleSave = () => {
	if (goal.value) {
		goal.value.descr = descr.value
		goal.value.condition = active.value
		let tmp = approveStore.getNodeById(goal.value.id)
		if (!!tmp) {
			tmp.descr = descr.value
			tmp.condition = active.value
		}
	}
}

const calcDefault = (row: any, index: number) => {
	return index == rows.value.length - 1 && !row.condition
}

watch(name, (val) => {
	if (val) {
		approveStore.tempName = name.value
	}
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

	fieldset
		legend Маршруты согласования
		.info
			q-icon(name="mdi-information" color="primary" size="sm")
			div Маршруты стартуют согласно приоритету. Чтобы добавить маршрут в согласование  - перетащите его в таблицу из дерева слева.
		DndTable(
			:columns='cols',
			:rows='rows',
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

			template(#cell-priority="{ index }")
				.link {{ index + 1 }}

			template(#cell-descr="{ row, index }")
				div(v-if='calcDefault(row, index)') По умолчанию


	fieldset
		legend Этапы маршрута {{ selRoute }}
		DndTable(v-if='selRoute'
			:columns='colsEtaps',
			:rows='etapsRows',
			@edit='goedit',
			disableDragHighlight
			readonly
		)
			template(#cell-condition="{ row }")
				q-chip(v-if='row.condition' color="green-3" size="sm" selected) Условие

		.text-grey-7(v-else) Маршрут не выбран.

	q-dialog(v-model="conditionDialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card(style='min-width: 400px;')
			q-btn.close(icon="mdi-close" color="negative" unelevated round dense v-close-popup)
			q-card-section
				.text-h6 Условие выбора маршрута

			q-card-section
				div Введите описание условия:
				q-input(v-model="descr" dense outlined type="text")

				q-checkbox.q-mt-md(v-model='active' label='Представьте, что вы задали условие' dense)

			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup) 
				q-btn(unelevated color="primary" label="Сохранить" @click="handleSave" v-close-popup) 
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
.q-chip {
	margin: 0;
	color: $teal-10;
}
</style>
