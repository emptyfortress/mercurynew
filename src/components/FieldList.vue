<script setup lang="ts">
import { animations } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import AddButton from '@/components/common/AddButton.vue'
import { uid } from 'quasar'

const fields = [
	{
		id: uid(),
		label: 'Автор',
		type: 'Строка справочника сотрудников',
	},
	{
		id: uid(),
		label: 'Дата создания',
		type: 'Дата',
	},
	{
		id: uid(),
		label: 'Завершено',
		type: '',
	},
	{
		id: uid(),
		label: 'Не завершено',
		type: '',
	},
	{
		id: uid(),
		label: 'Планируемая дата завершения',
		type: 'Дата',
	},
	{
		id: uid(),
		label: 'Просрочено',
		type: '',
	},
	{
		id: uid(),
		label: 'Есть просроченный этап',
		type: 'Boolean',
	},
	{
		id: uid(),
		label: 'Текущий этап обработки',
		type: '',
	},
	{
		id: uid(),
		label: 'Исполнитель текущего этапа',
		type: 'Строка справочника сотрудников',
	},
]

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (el: any) => {
		return el.id !== 'no-drag'
	},
}
const [parent, tapes] = useDragAndDrop(fields, config)

const remove = ((index: number) => {
	tapes.value.splice(index, 1)
})
</script>

<template lang="pug">
.full
	.text-center Поля
	.pa(ref='parent')
		div(v-if='tapes.length == 0' id="no-drag"
			v-motion
			:initial="{ y: 40, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 400 } }'
			)
			div Статусы не заданы

		.stat(v-else
			v-for="(item, index) in tapes" :key="item.id"
			v-motion
			:initial="{ y: 40, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 400 + 100 * index } }'
			)
			.hg {{ item.label }}
			.sma {{ item.type }}
			q-btn(flat round icon='mdi-close' @click="remove(index)" dense size='sm') 

	q-btn.q-mt-md(round unelevated
		icon='mdi-plus'
		color="primary"
		v-motion
		:initial="{ scale: 0.1, opacity: 0, rotate: 360 }"
		:enter='{ scale: 1, opacity: 1, rotate: 0, transition: { delay: 900 } }'
		)
</template>

<style scoped lang="scss">
.pa {
	margin-top: 1rem;
}

.stat {
	border-radius: .25rem;
	text-align: left;
	cursor: pointer;
	padding-left: 1rem;
	padding-right: .5rem;
	background: #fff;
	width: 100%;
	height: 36px;

	margin-bottom: 1px;
	display: grid;
	grid-template-columns: 1fr 1fr 38px;
	justify-items: start;
	align-items: center;
	display: grid;

	.q-btn {
		display: none;
		justify-self: end;
	}

	&:hover {
		.q-btn {
			display: inline-flex;
		}
	}
}

.sma {
	font-size: .8rem;
	color: #666;
	font-style: italic;
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;
	height: 36px;

	* {
		display: none;
	}

}
</style>
