<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import AddFormButtonNew from '@/components/common/AddFormButtonNew.vue'
import { state } from '@formkit/drag-and-drop'
import { Kind } from '@/types/enum'
import MaterialSymbolsInsertTextRounded from '@/components/icons/MaterialSymbolsInsertTextRounded.vue'
import MdiCalendar from '@/components/icons/MdiCalendar.vue'
import MaterialSymbolsAccountCircle from '@/components/icons/MaterialSymbolsAccountCircle.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'

// interface Field {
// 	id: string
// 	label: string
// 	caption: string
// 	type: string
// 	def: boolean
// }

const props = defineProps({
	mode: {
		type: Boolean,
		required: true,
		default: true,
	},
})

const elements = ref([
	{
		id: 0,
		label: 'Автор',
		caption: 'Кто создал заявку',
		selected: false,
		type: Kind.Man,
		pic: markRaw(MaterialSymbolsAccountCircle),
	},
	{
		id: 1,
		label: 'Дата начала отпуска',
		caption: 'Планируемая дата старта',
		selected: false,
		type: Kind.Date,
		pic: markRaw(MdiCalendar),
	},
	{
		id: 2,
		label: 'Дата окончания отпуска',
		caption: 'Планируемая дата завершения',
		selected: false,
		type: Kind.Date,
		pic: markRaw(MdiCalendar),
	},
	{
		id: 3,
		label: 'Комментарий',
		caption: 'Свободный комментарий',
		selected: false,
		type: Kind.Text,
		pic: markRaw(MaterialSymbolsInsertTextRounded),
	},
])

const [lib, libitems] = useDragAndDrop(elements.value, { sortable: false, group: 'one' })

const tmp = ref<Control[]>([])

state.on('dragStarted', () => {
	tmp.value = [...libitems.value]
})

state.on('dragEnded', () => {
	libitems.value = tmp.value
})

const create = (e: Control) => {
	libitems.value.push(e)
}

const remove = () => {
	libitems.value.splice(removedIndex.value, 1)
}
const dialog = ref(false)
const removedItem = ref('')
const removedIndex = ref(0)

const confirm = (e: string, num: number) => {
	removedItem.value = e
	removedIndex.value = num
	dialog.value = true
}

const emit = defineEmits(['begin', 'stop'])
const start = (e: Control) => {
	emit('begin', e)
	// dragging.value = true
}
const stop = () => {
	emit('stop')
	// dragging.value = false
}
</script>

<template lang="pug">
.grey(v-if='libitems.length == 0') Поля отсутствуют
q-list.list(v-else bordered separator ref="lib")
	q-item.drag(
		v-for="(item, index) in libitems",
		:key="item.id"
		@dragstart="start(item)"
		@dragend="stop"
	)
		q-item-section(avatar)
			.big
				component(:is='item.pic')
		q-item-section
			q-item-label.text-bold {{ item.label }}
			q-item-label.grey(caption) {{ item.caption }}

		q-item-section(v-if='!props.mode')
			q-item-label.grey(caption)
				span(v-if='item.type == Kind.Man') Строка справочника
				span(v-if='item.type == Kind.Date') Дата
				span(v-if='item.type == Kind.Text') Текст
				span(v-if='item.type == Kind.String') Строка

		q-item-section(side)
			q-btn.remove(flat round icon="mdi-delete-outline" color="secondary" dense size="sm" @click='confirm(item.label, index)') 
.butt
	AddFormButtonNew(@create='create' elementId='field')

DeleteDialog(v-model="dialog" :field='removedItem' @remove="remove")
</template>

<style scoped lang="scss">
.butt {
	margin-top: 1rem;
	margin-left: 1rem;
	min-height: 40px;
}
.list {
	text-align: left;
	margin: 0 1rem;
	// background: #fff;
}

.drag {
	cursor: all-scroll;
	color: $secondary;
	background: #fff;
	.remove {
		visibility: hidden;
	}

	&:hover {
		color: $primary;
		background: #efefef;

		.remove {
			visibility: visible;
		}
	}
}

.big {
	font-size: 1.4rem;
}

.grey {
	color: #aaa;
}

.custom {
	background: hsl(213 38% 81% / 1);

	.con,
	.img {
		display: none;
	}
}

// .ghost {
// 	// background: hsl(213 38% 90% / 1) !important;
// 	background: #73ad81 !important;
// 	box-shadow: none !important;
// 	border: none !important;
//
// 	.handle,
// 	.digit,
// 	.icon {
// 		display: none;
// 	}
//
// 	label {
// 		visibility: hidden;
// 	}
//
// }
</style>
