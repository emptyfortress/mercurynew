<script setup lang="ts">
import { computed } from 'vue'
import { useDndStore } from '@/stores/dnd'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'
import { Newkind } from '@/types/enum'

const dndStore = useDndStore()

// const sort = ref(Array(dndStore.columnData.length).fill(false))
// const order = ref(Array(dndStore.columnData.length).fill('up'))

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('q-item')
	},
}

const [parent, tapes] = useDragAndDrop(dndStore.columnData, config)

const calcType = (e: Newkind) => {
	switch (e) {
		case 0:
			return 'Строка'
		case 1:
			return 'Целое число'
		case 2:
			return 'Дробное число'
		case 3:
			return 'Дата, время'
		case 4:
			return 'Логический тип'
		case 5:
			return 'Строка справочника'
		case 6:
			return 'Таблица'
		case 7:
			return 'Виртуальное поле'
		default:
			return 'Строка'
	}
}
</script>

<template lang="pug">
.q-mb-sm(v-if='dndStore.columnData.length == 0') Колонки не настроены.
.q-mb-sm(v-else)
	|Настройте порядок сортировки, перетаскивая колонки.
	|Сортировать по выбранным колонкам (последовательно, сверху вниз):
q-list(ref='parent')
	q-item(v-for="item in tapes" :key="item.id" :class="{active: item.sort}")
		q-item-section(side)
			q-checkbox(v-model='item.sort' dense)
		q-item-section
			q-item-label {{ item.text }}
		template(v-if="item.sort")
			q-item-section.sec
				div(v-if='item.newkind !== null && item.newkind !== undefined') {{ calcType(item.newkind) }}
				div(v-else) Тип не определен
			q-item-section
				.q-gutter-x-lg
					q-radio(dense v-model="item.order" val="up" label="По возрастанию" :disable='!item.sort')
					q-radio(dense v-model="item.order" val="down" label="По убыванию" :disable='!item.sort')
		template(v-else)
			q-item-section.sec  не сортировать
</template>

<style lang="scss" scoped>
.sec {
	color: $blue-grey-7;
}
.q-item {
	border: 1px solid var(--my-border-color);
	margin-top: -1px;
	user-select: none;
	&.active {
		background: var(--bgLight);
	}
}
</style>
