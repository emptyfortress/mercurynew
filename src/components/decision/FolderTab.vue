<script setup lang="ts">
import { ref } from 'vue'
import FolderTree from '@/components/decision/FolderTree.vue'
import { useSimpleStore } from '@/stores/simpleStore'

const simpleStore = useSimpleStore()

const selectedFolder = ref(null)

const tree = [
	{
		id: 1,
		text: 'Личная папка',
	},
	{
		id: 2,
		text: 'Папки',
		children: [
			{
				id: 3,
				text: 'Архив документов',
			},
			{
				id: 4,
				text: 'Документы общего пользования',
			},
			{
				id: 5,
				text: 'Карточки документов',
			},
			{
				id: 6,
				text: 'Категории документов',
			},
			{
				id: 7,
				text: 'Папки подразделений',
				children: [
					{
						id: 8,
						text: 'Бухгалтерия',
					},
					{
						id: 9,
						text: 'Дирекция',
					},
					{
						id: 10,
						text: 'Коммерческий отдел',
					},
					{
						id: 11,
						text: 'Отдел IT',
					},
					{
						id: 12,
						text: 'Отдел дизайна',
					},
					{
						id: 13,
						text: 'Отдел закупки сырья',
					},
					{
						id: 14,
						text: 'Отдел по работе с клиентами',
					},
					{
						id: 15,
						text: 'Секретариат',
					},
				],
			},
			{
				id: 16,
				text: 'Рабочие календари подразделений и сотрудников',
			},
			{
				id: 17,
				text: 'Шаблоны документов',
			},
		],
	},
	{
		id: 18,
		text: 'Шанина С. В.',
	},
]
const group = ref('all')
const only = ref(false)
</script>

<template lang="pug">
.row.items-center.q-gutter-x-xl
	q-radio(v-model="group" val="all" label="Искать во всех папках")
	q-radio(v-model="group" val="selected" label="Искать в выбранных папках")
	q-checkbox(v-model="only" dense label='Включая подпапки')

FolderTree(:data="tree" :isDisabled='group == "all"' open)

q-btn(unelevated color="primary" label="Сохранить")
</template>

<style scoped lang="scss"></style>
