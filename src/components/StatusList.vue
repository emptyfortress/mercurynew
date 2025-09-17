<script setup lang="ts">
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import AddFormButtonNew from '@/components/common/AddFormButtonNew.vue'
import { uid } from 'quasar'

const statuses = [
	{
		id: uid(),
		label: 'На подготовке',
	},
	{
		id: uid(),
		label: 'На согласовании',
	},
	{
		id: uid(),
		label: 'На доработке',
	},
	{
		id: uid(),
		label: 'Согласовано',
	},
	{
		id: uid(),
		label: 'Завершено',
	},
]

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (el: any) => {
		return el.id !== 'no-drag1'
	},
}
const [parent, tapes] = useDragAndDrop(statuses, config)

const remove = (index: number) => {
	tapes.value.splice(index, 1)
}

const create = (e: any) => {
	console.log(e)
	// tapes.value.push(e)
}
</script>

<template lang="pug">
.pa(ref='parent')
	div(v-if='tapes.length == 0' id="no-drag")
		div Статусы не заданы

	.stat(v-else
		v-for="(item, index) in tapes" :key="item.id")
		q-icon.move(name="mdi-drag-vertical" color="primary" size="sm")
		.hg {{ item.label }}

		q-btn(flat round icon='mdi-delete-outline' dense size='sm') 
			q-menu
				q-list
					q-item(clickable @click="remove(index)" ).pink
						q-item-section Удалить

.butt
	AddFormButtonNew(@create='create' elementId='status')

</template>

<style scoped lang="scss">
.pa {
	margin-top: 1rem;
}

.stat {
	border-radius: 0.25rem;
	text-align: left;
	cursor: pointer;
	padding-right: 0.5rem;
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
		color: $secondary;
		display: none;
	}
	&:hover {
		background: #efefef;
		.q-btn {
			display: block;
		}
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
.butt {
	margin-top: 1rem;
}
</style>
