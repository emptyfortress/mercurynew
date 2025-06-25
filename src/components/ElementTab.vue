<script setup lang="ts">
import { ref } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import AddFormButton from '@/components/common/AddFormButton.vue'
import { state } from '@formkit/drag-and-drop'
import { Kind } from '@/types/enum'
import IconText from '@/components/icons/IconText.vue'
import MdiCalendar from '@/components/icons/MdiCalendar.vue'
import MaterialSymbolsAccountCircle from '@/components/icons/MaterialSymbolsAccountCircle.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'

const elements = ref([
	{
		id: 0,
		label: 'Автор',
		caption: 'Кто создал заявку',
		selected: false,
		type: Kind.Man,
		pic: MaterialSymbolsAccountCircle,
	},
	{
		id: 1,
		label: 'Дата начала отпуска',
		caption: 'Планируемая дата старта',
		selected: false,
		type: Kind.Date,
		pic: MdiCalendar,
	},
	{
		id: 2,
		label: 'Дата окончания отпуска',
		caption: 'Планируемая дата завершения',
		selected: false,
		type: Kind.String,
		pic: MdiCalendar,
	},
	{
		id: 3,
		label: 'Комментарий',
		caption: 'Свободный комментарий',
		selected: false,
		type: Kind.Text,
		pic: IconText,
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
</script>

<template lang="pug">
.grey(v-if='libitems.length == 0') Поля отсутствуют
q-list.list(v-else bordered separator ref="lib")
	q-item.drag(v-for="(item, index) in libitems" :key="item.id")
		q-item-section(avatar)
			.big
				component(:is='item.pic')
		q-item-section
			q-item-label.text-bold {{ item.label }}
			q-item-label.grey(caption) {{ item.caption }}

		q-item-section(side)
			q-btn.remove(flat round icon="mdi-delete-outline" color="secondary" dense size="sm" @click='confirm(item.label, index)') 

				// q-menu
				// 	q-list(dense)
				// 		q-item.pink(clickable @click="remove(index)")
				// 			q-item-section Да, удалить!

br
AddFormButton(@create='create')
DeleteDialog(v-model="dialog" :field='removedItem' @remove="remove")
// Trash(:dragging='true')
</template>

<style scoped lang="scss">
.list {
	text-align: left;
	margin: 0 1rem;
}

.drag {
	cursor: all-scroll;
	color: $secondary;

	.remove {
		display: none;
	}

	&:hover {
		color: $primary;
		background: #efefef;

		.remove {
			display: block;
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
