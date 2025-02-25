<script setup lang="ts">
import { ref, watch } from 'vue'
import { animations } from "@formkit/drag-and-drop"
// import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
// import { state } from "@formkit/drag-and-drop"
import { uid } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()

// const props = defineProps({
// 	restore: {
// 		type: Boolean,
// 		required: true,
// 		default: false
// 	}
// })

// watch(() => props.restore,
// 	(val) => {
// 		if (val) {
// 			tapes.value.splice(ind.value, 0, tmp.value!)
// 		}
// 	})

interface Field {
	id: string
	label: string
	caption: string
	type: string
	def: boolean
}
const fields = ref([
	{
		id: uid(),
		label: 'Дата начала отпуска',
		caption: 'Планируемая дата старта',
		type: 'Дата',
		def: false,
	},
	{
		id: uid(),
		label: 'Дата окончания отпуска',
		caption: 'Планируемая дата завершения',
		type: 'Дата',
		def: false,
	},
	{
		id: uid(),
		label: 'Комментарий',
		caption: 'Свободный комментарий',
		type: 'Строка',
		def: false,
	},
	{
		id: uid(),
		label: 'Автор',
		caption: 'Кто создал заявку',
		type: 'Строка справочника сотрудников',
		def: true,
	},
	{
		id: uid(),
		label: 'Статус',
		caption: 'Состояние в котором находится процесс',
		type: 'Строка',
		def: true,
	},
	{
		id: uid(),
		label: 'Дата создания',
		caption: 'Когда создано',
		type: 'Строка',
		def: true,
	},
	{
		id: uid(),
		label: 'Дата изменения',
		caption: 'Последняя дата изменения',
		type: 'Строка',
		def: true,
	},
])

// const config = {
// 	plugins: [animations(),],
// 	dragPlaceholderClass: 'ghost',
// 	sortable: false,
// 	group: 'digest',
// 	draggable: (el: any) => {
// 		return el.id !== 'no-drag'
// 	},
// }

// const [parent, tapes] = useDragAndDrop(fields, config)

const remove = ((index: number) => {
	fields.value.splice(index, 1)
})

const ind = ref(0)

// state.on('dragStarted', (event: any) => {
// 	tmp.value = event.draggedNode.data.value
// 	ind.value = event.initialIndex
// 	console.log(event.draggedNode.data.value)
// })

const goto = (() => {
	router.push('/statuses')
})

const emit = defineEmits(['begin'])
const tmp = ref<Field>()
const start = ((e: Field) => {
	emit('begin', e)
})

</script>

<template lang="pug">
.full
	.pa(ref='parent')
		.stat(
			v-for="(item, index) in fields" :key="item.id" :draggable="true"
			v-motion
			:initial="{ y: 40, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 400 + 100 * index } }'
			@dragstart="start(item)"
			)
			.hg
				span {{ item.label }}
				span.star(v-if='item.def') *
			.sma {{ item.type }}
			q-btn.del(v-if='!item.def' flat round icon='mdi-close' @click="remove(index)" dense size='sm') 
			q-btn(v-if='item.label == "Статус"' flat round color="primary" icon='mdi-arrow-right-circle-outline' @click="goto" dense ) 
				q-tooltip Редактировать

	.sma.q-mt-sm * Системное поле (не может быть удалено)
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

.star {
	margin-left: .25rem;
	color: $primary;
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
		justify-self: end;
	}

	.q-btn.del {
		display: none;
	}

	&:hover {
		.q-btn.del {
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
