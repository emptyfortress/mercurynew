<script setup lang="ts">
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'

const cols = [
	{ id: 0, vis: true, label: 'Автор' },
	{ id: 1, vis: true, label: 'Дата начала отпуска' },
	{ id: 2, vis: true, label: 'Дата окончания отпуска' },
	{ id: 3, vis: true, label: 'Комментарий' },
	{ id: 4, vis: false, label: 'Процесс завершен' },
	{ id: 5, vis: false, label: 'Процесс не завершен' },
	{ id: 6, vis: false, label: 'Планируемая дата завершения' },
	{ id: 7, vis: false, label: 'Просрочено' },
	{ id: 8, vis: false, label: 'Есть просроченный этап' },
	{ id: 9, vis: false, label: 'Текущий этап обработки' },
	{ id: 10, vis: false, label: 'Исполнитель текущего этапа' },
]

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (el: any) => {
		return el.id !== 'no-drag'
	},
}
const [parent, tapes] = useDragAndDrop(cols, config)
</script>

<template lang="pug">
q-list.pa(ref='parent' dense)
	q-item(v-for="item in tapes" :key='item.id')
		q-item-section(side)
			q-checkbox(v-model="item.vis" dense size='sm')
		q-item-section()
			q-item-label {{ item.label }}
</template>

<style scoped lang="scss">
.pa .q-item {
	background: #fff;
	cursor: move;
	text-align: left;
	margin-left: 0.5rem;
}

.ghost {
	background: hsl(213 14% 90% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
	}
}
</style>
