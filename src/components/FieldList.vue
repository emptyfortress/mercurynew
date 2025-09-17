<script setup lang="ts">
import { ref, watch } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { state } from '@formkit/drag-and-drop'
import { uid } from 'quasar'
import { useRouter } from 'vue-router'
import AddFormButtonNew from '@/components/common/AddFormButtonNew.vue'

const router = useRouter()

const props = defineProps({
	restore: {
		type: Boolean,
		required: true,
		default: false,
	},
})

watch(
	() => props.restore,
	(val) => {
		if (val) {
			tapes.value.splice(ind.value, 0, tmp.value!)
		}
	}
)

interface Field {
	id: string
	label: string
	caption: string
	type: string
	def: boolean
}
const fields = [
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
]

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: false,
	group: 'digest',
	draggable: (child: HTMLElement) => {
		return child.classList.contains('stat')
	},
}

const [parent, tapes] = useDragAndDrop(fields, config)

const remove = (index: number) => {
	tapes.value.splice(index, 1)
}

const ind = ref(0)

state.on('dragStarted', (event: any) => {
	tmp.value = event.draggedNode.data.value
	ind.value = event.initialIndex
})

const goto = () => {
	router.push('/statuses')
}

const emit = defineEmits(['begin', 'stop'])
const tmp = ref<Field>()

const dragging = ref(false)
const start = (e: Field) => {
	emit('begin', e)
	// dragging.value = true
}
const stop = () => {
	emit('stop')
	// dragging.value = false
}

const create = (e: Control) => {
	console.log(e)
	tapes.value.push({
		id: e.id.toString(),
		label: e.label,
		caption: '',
		type: e.type,
		def: false,
	})
}
</script>

<template lang="pug">
.full
	.pa(ref='parent')
		.stat(
			v-for="(item, index) in tapes" :key="item.id" :draggable="true"
			v-motion
			:initial="{ y: 40, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 400 + 100 * index } }'
			@dragstart="start(item)"
			@dragend="stop"
			)
			q-icon.move(name="mdi-drag-vertical" color="primary" size="sm")
			.hg {{ item.label }}
			.sma {{ item.type }}
			.sma
				span(v-if='item.def') Системное поле
			q-btn(v-if='!item.def' flat round icon='mdi-close' dense size='sm') 
				q-menu
					q-list
						q-item(clickable @click="remove(index)" ).pink
							q-item-section Удалить


	.butt
		AddFormButtonNew(@create='create' elementId='field')

</template>

<style scoped lang="scss">
.pa {
	margin-top: 1rem;
}
.butt {
	margin-top: 1rem;
	min-height: 40px;
}

.star {
	margin-left: 0.25rem;
	color: $primary;
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
	grid-template-columns: 24px 1fr 1fr 0.5fr 38px;
	justify-items: start;
	align-items: center;
	display: grid;
	gap: 1rem;

	.q-btn {
		justify-self: end;
		color: grey;
	}
}

.sma {
	font-size: 0.8rem;
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
