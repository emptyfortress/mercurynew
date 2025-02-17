<script setup lang="ts">
import { ref } from 'vue'
import IconUndo from '@/components/icons/IconUndo.vue'
import IconRedo from '@/components/icons/IconRedo.vue'
// import IconSave from '@/components/icons/IconSave.vue'
import { animations } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import img from '@/assets/img/predstavlenie.png'
import DrawBottom from '@/components/DrawBottom.vue'

// const main = ref(true)
// const toggleMain = (() => {
// 	main.value = !main.value
// })

const cols = [
	{ id: 0, vis: true, label: 'Автор', },
	{ id: 1, vis: true, label: 'Дата создания', },
	{ id: 2, vis: true, label: 'Контролер', },
	{ id: 3, vis: true, label: 'Тема', },
	{ id: 4, vis: true, label: 'Номер', },
	{ id: 5, vis: true, label: 'Вложения', },
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
	{ label: 'Dark matter', val: 1, },
	{ label: 'Mexico', val: 2, },
	{ label: 'Grey hound', val: 3, },
	{ label: 'Sunny', val: 4, },
	{ label: 'Rain', val: 5, },
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
				// q-btn(flat round dense color="secondary" @click="") 
				// 	IconSave.ic
				// 	q-tooltip Сохранить
				q-btn(flat round dense icon='mdi-fullscreen' color="primary" @click="") 
					q-tooltip Во весь экран
		.cols
			div
				div Настройте порядок и видимость колонок:
				q-list.pa(ref='parent' dense)
					q-item(v-for="item in tapes" :key='item.id')
						q-item-section(side)
							q-checkbox(v-model="item.vis" dense)
						q-item-section()
							q-item-label {{ item.label }}
			div
				div Настройте тему оформления:
				q-list(dense)
					q-item(tag='label' v-for="item in colors" :key='item.val')
						q-item-section(side)
							q-radio(v-model="theme" :val='item.val' dense)
						q-item-section {{ item.label }}
			div
				div Настройте выделение:
				DrawBottom

				// q-select(dense outlined v-model="column" label='Колонка' :options='options1')
				// q-select(dense outlined v-model="column" label='Условие' :options='options1')
				// q-select(dense outlined v-model="column" label='Значение' :options='options1')

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
	grid-template-columns: 250px 230px 1fr;
	justify-items: space-between;
	// align-items: start;
	column-gap: 1rem;
	row-gap: .5rem;

	&>div:not(:last-child) {
		border-right: 1px solid #ccc;
	}
}

.ic {
	font-size: 1.5rem;
}

.q-item {
	background: #fff;
	cursor: move;
	width: 200px;
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
