<script setup lang="ts">
import { animations } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import AddButton from '@/components/common/AddButton.vue'
import { uid } from 'quasar'

const statuses = [
	{
		id: uid(),
		label: 'На подготовке'
	},
	{
		id: uid(),
		label: 'На согласовании'
	},
	{
		id: uid(),
		label: 'На доработке'
	},
	{
		id: uid(),
		label: 'Согласовано'
	},
	{
		id: uid(),
		label: 'Завершено'
	},
]

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (el: any) => {
		return el.id !== 'no-drag1'
	},
}
const [parent, tapes] = useDragAndDrop(statuses, config)

const remove = ((index: number) => {
	tapes.value.splice(index, 1)
})
</script>

<template lang="pug">
.full
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
			.hand
			.hg {{ item.label }}
			q-btn(flat round icon='mdi-close' dense size='sm') 
				q-menu
					q-list
						q-item(clickable @click="remove(index)" ).pink
							q-item-section Удалить

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
	padding-right: .5rem;
	background: #fff;
	width: 100%;
	height: 36px;

	margin-bottom: 1px;
	display: grid;
	grid-template-columns: 24px 1fr 38px;
	justify-items: start;
	align-items: center;
	display: grid;
	gap: 1rem;

	.q-btn {
		justify-self: end;
		color: grey;
	}

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
