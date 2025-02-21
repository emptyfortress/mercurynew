<script setup lang="ts">
import { ref, watch } from 'vue'
import { animations } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { state } from "@formkit/drag-and-drop"
import { uid } from 'quasar'

const props = defineProps({
	restore: {
		type: Boolean,
		required: true,
		default: false
	}
})

watch(() => props.restore,
	(val) => {
		if (val) {
			tapes.value.splice(ind.value, 0, tmp.value!)
		}
	})

interface Field {
	id: string
	label: string
	caption: string
	type: string
}
const fields = [
	{
		id: uid(),
		label: 'Автор',
		caption: 'Кто создал заявку',
		type: 'Строка справочника сотрудников',
	},
	{
		id: uid(),
		label: 'Дата начала отпуска',
		caption: 'Планируемая дата старта',
		type: 'Дата',
	},
	{
		id: uid(),
		label: 'Дата окончания отпуска',
		caption: 'Планируемая дата завершения',
		type: 'Дата',
	},
	{
		id: uid(),
		label: 'Комментарий',
		caption: 'Свободный комментарий',
		type: 'Строка',
	},
]

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	group: 'digest',
	draggable: (el: any) => {
		return el.id !== 'no-drag'
	},
}
const [parent, tapes] = useDragAndDrop(fields, config)

const remove = ((index: number) => {
	tapes.value.splice(index, 1)
})

const tmp = ref<Field>()
const ind = ref(0)
state.on('dragStarted', (event: any) => {
	tmp.value = event.draggedNode.data.value
	ind.value = event.initialIndex
})

</script>

<template lang="pug">
.full
	.text-center Поля {{ props.restore }}
	.pa(ref='parent')
		div(v-if='tapes.length == 0' id="no-drag"
			v-motion
			:initial="{ y: 40, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 400 } }'
			)
			div Поля не заданы

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
