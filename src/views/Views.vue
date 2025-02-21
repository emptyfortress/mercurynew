<script setup lang="ts">
import { ref } from 'vue'
import IconUndo from '@/components/icons/IconUndo.vue'
import IconRedo from '@/components/icons/IconRedo.vue'
import { animations } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import img from '@/assets/img/predstavlenie.png'
import DrawBottom from '@/components/DrawBottom.vue'
import frame1 from '@/assets/img/frame1.png'
import frame2 from '@/assets/img/frame2.png'
import frame3 from '@/assets/img/frame3.png'
import frame4 from '@/assets/img/frame4.png'
import frame5 from '@/assets/img/frame5.png'

const cols = [
	{ id: 0, vis: true, label: 'Автор', },
	{ id: 1, vis: true, label: 'Дата начала отпуска', },
	{ id: 2, vis: true, label: 'Дата окончания отпуска', },
	{ id: 3, vis: true, label: 'Комментарий', },
	{ id: 4, vis: false, label: 'Процесс завершен', },
	{ id: 5, vis: false, label: 'Процесс не завершен', },
	{ id: 6, vis: false, label: 'Планируемая дата завершения', },
	{ id: 7, vis: false, label: 'Просрочено', },
	{ id: 8, vis: false, label: 'Есть просроченный этап', },
	{ id: 9, vis: false, label: 'Текущий этап обработки', },
	{ id: 10, vis: false, label: 'Исполнитель текущего этапа', },
]

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (el: any) => {
		return el.id !== 'no-drag'
	},
}
const [parent, tapes] = useDragAndDrop(cols, config)

const colors = [
	{ label: 'Контраст', val: 1, pic: frame1 },
	{ label: 'Мексика', val: 2, pic: frame2 },
	{ label: 'Петербург', val: 3, pic: frame3 },
	{ label: 'Лето', val: 4, pic: frame4 },
	{ label: 'Водный мир', val: 5, pic: frame5 },
]
const theme = ref(1)
</script>

<template lang="pug">
q-page(padding)
	.editor(ref='editor1')
		.top()
			.zg Представление "Все заявки"
			.q-gutter-x-sm
				q-btn(flat round dense color="primary" @click="") 
					IconUndo.ic
					q-tooltip Отменить
				q-btn(flat round dense color="primary" @click="") 
					IconRedo.ic
					q-tooltip Повторить
				q-btn(flat round dense icon='mdi-fullscreen' color="primary" @click="") 
					q-tooltip Во весь экран
		.cols
			div
				div Порядок и видимость колонок:
				q-list.pa(ref='parent' dense)
					q-item(v-for="item in tapes" :key='item.id')
						q-item-section(side)
							q-checkbox(v-model="item.vis" dense)
						q-item-section()
							q-item-label {{ item.label }}
			div
				div Тема оформления:
				q-list(dense)
					q-item(tag='label' v-for="item in colors" :key='item.val')
						q-item-section(side)
							q-radio(v-model="theme" :val='item.val' dense)
						q-item-section {{ item.label }}
						q-item-section(side)
							q-img(:src='item.pic' width='100px' height='34px' fit='cover' position='0 -8px')
			div
				div Подсветка:
				DrawBottom

	br
	q-img(:src='img' width='1200px')

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}


.editor {
	display: block;
	padding: 0;
	max-width: 1200px;
	position: relative;
	height: initial;
}

.zg {
	font-size: 1.3rem;
	font-weight: 500;
}

.cols {
	padding: 1rem;
	display: grid;
	grid-template-columns: 1fr 1fr 1.5fr;
	justify-items: space-between;
	column-gap: 1rem;
	row-gap: .5rem;

	&>div:not(:last-child) {
		border-right: 1px solid #ccc;
	}
}

.ic {
	font-size: 1.5rem;
}

.pa .q-item {
	background: #fff;
	cursor: move;
	// width: 200px;
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
