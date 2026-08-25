<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { usePartitionStore } from '@/stores/partition'
import DndTable from '@/components/common/DndTable.vue'
import MainSectionDialog from '@/components/decision/MainSectionDialog.vue'
import DopSectionDialog from '@/components/decision/DopSectionDialog.vue'

const store = useSimpleStore()
const part = usePartitionStore()

watchEffect(() => {
	if (store.currentNode) {
		store.tempNode.text = store.currentNode.data.text
		store.tempNode.text1 = store.currentNode.data.text1
	}
})

const creationDate = computed(() => {
	return '2024-01-15'
})

const author = computed(() => {
	return store.selectedElement?.author || 'System'
})

const cols0 = [
	{
		name: 'card',
		label: 'Тип карточки',
		field: 'card',
		align: 'left',
	},
	{
		name: 'part',
		label: 'Ведущий раздел',
		field: 'part',
		align: 'left',
	},
	{
		name: 'psev',
		label: 'Псевдоним',
		field: 'psev',
		align: 'left',
	},
]

const cols = [
	{
		name: 'psevdo',
		label: 'Псевдоним',
		field: 'psevde',
		align: 'left',
	},
	{
		name: 'orig',
		label: 'Оригинальный раздел',
		field: 'orig',
		align: 'left',
	},
	{
		name: 'attached',
		label: 'Присоединенный раздел',
		field: 'attached',
		align: 'left',
	},
	{
		name: 'common',
		label: 'Объединение через',
		field: 'common',
		align: 'left',
	},
	{
		name: 'condition',
		label: 'Условие',
		field: 'condition',
		align: 'left',
	},
	{
		name: 'action',
		label: '',
		field: 'action',
		align: 'right',
	},
]
const rows = ref<any[]>([])
const selectedId = ref()

interface RowMain {
	id: string
	card: string
	part: any
	psev: string
}

const rows0 = ref<RowMain[]>([])

const remove = (row: any) => {
	const ind = rows0.value.findIndex((el) => el.id == row.id)
	if (ind > -1) {
		rows0.value.splice(ind, 1)
	}
}

const save = (e: RowMain) => {
	rows0.value.push({
		id: Date.now().toString(),
		card: e.card,
		part: e.part,
		psev: e.psev,
	})
}

const goedit = () => {
	console.log(111)
}

const dialog = ref(false)
const asRow = (row: unknown) => row as RowMain

const dialog1 = ref(false)
const save1 = () => {
	console.log(111)
}
</script>

<template lang="pug">
.q-pa-md
	.row.q-col-gutter-md
		.col-6
			q-input(v-model="store.tempNode.text" label="Название" outlined dense)
		.col-3
			q-input(v-model="creationDate" label="Дата создания" outlined dense readonly)
		.col-3
			q-input(v-model="author" label="Автор" outlined dense readonly)
		.col-12
			q-input(v-model="store.tempNode.text1" label="Описание" type="textarea" outlined dense autogrow)

	.section Ведущие разделы карточек
	DndTable(
		:columns='cols0',
		:rows='rows0',
		@removeRow="remove",
		:selected="null"
		@edit='goedit',
	)
		template(#cell-part="{ row }")
			.txt
				template(v-for="item in asRow(row).part.parents" :key="item")
					div {{ item }}
					.q-mx-sm >
				div {{ asRow(row).part.text }}

	q-btn(v-if='part.partitions.length == 0' flat icon="mdi-plus" color="primary" label="Добавить ведущий раздел" @click="dialog = true") 

	template(v-if='rows0.length')
	.section Присоединённые разделы карточек
	DndTable(
		:columns='cols',
		:rows='rows',
		v-model:selected='selectedId',
		@removeRow="remove",
		@edit='goedit',
	)

	q-btn(flat icon="mdi-plus" color="primary" label="Добавить присоединенный раздел" @click="dialog1 = true") 

	DopSectionDialog(v-model='dialog1' @save='save1')
	MainSectionDialog(v-model='dialog' @save='save')

</template>

<style scoped lang="scss">
.ic {
	font-size: 2.6rem;
	color: $secondary;
}
.section {
	margin-top: 2rem;
	font-size: 1.1rem;
	background: $secondary;
	color: white;
	padding-left: 0.5rem;
	// margin-bottom: 0.5rem;
}
.mai {
	display: flex;
	// justify-content: start;
	// align-items: center;
	background: var(--selection);
	padding: 2px 16px;
	padding-right: 2px;
	border-radius: 5rem;
}
.txt {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	font-size: 0.9rem;
}
</style>
