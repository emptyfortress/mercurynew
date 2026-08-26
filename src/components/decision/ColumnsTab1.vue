<script setup lang="ts">
import { ref } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useDndStore } from '@/stores/dnd'
import { KindLabels, Kind } from '@/types/enum'
// import { useViewStore } from '@/stores/view'
import ViewDrawer from '@/components/ViewDrawer.vue'

// const viewStore = useViewStore()
// import DropTarget from '@/components/decision/DropTarget.vue'

const dndStore = useDndStore()

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	dragHandle: '.drag-handle',
	draggable: (child: HTMLElement) => child.classList.contains('mycolumn'),
}

const [parent, tapes] = useDragAndDrop(dndStore.columnData, config)

const insert = () => {
	// let tmp = dndStore.externalDragPayload
	let tmp = {} as any
	tmp.id = Date.now().toString()
	tmp.text = dndStore.externalDragPayload.text
	tmp.sort = false
	tmp.hide = false
	tmp.kind = dndStore.externalDragPayload.kind
	tmp.source = 'field'
	tmp.children = []
	tmp.children.push(dndStore.externalDragPayload)
	tapes.value.push(tmp)
	isHoverTarget.value = false
}

let colCounter = 0

function addColumn() {
	colCounter++
	let newColumn = {
		id: `col-${Date.now()}-${colCounter}`,
		type: '',
		text: `Колонка ${colCounter}`,
		kind: null,
		newkind: null,
		children: [],
		sort: false,
		order: 'up',
		hide: false,
	}
	tapes.value?.push(newColumn)
}

const clear = (ind: number) => {
	tapes.value.splice(ind, 1)
}

const isHoverTarget = ref(false)

function onDragOver() {
	isHoverTarget.value = true
}
function onDragLeave(event: DragEvent) {
	const target = event.currentTarget as HTMLElement
	const related = event.relatedTarget as Node | null

	if (!related || !target.contains(related)) {
		isHoverTarget.value = false
	}
}

const drawer = ref(false)
const currentColumn = ref()

// const toggle = (row: any) => {
// 	drawer.value = !drawer.value
// 	currentColumn.value = row
// }
const open = (row: any) => {
	drawer.value = true
	currentColumn.value = row
}

const calcLabel = (e: Kind) => {
	return KindLabels[e]
}
</script>

<template lang="pug">
.q-mb-md Настройте состав и порядок колонок представления.

.par(ref='parent')
	.mycolumn(
		v-for="(item, index) in tapes",
		:key="item.id",
		@kill='dndStore.remove(index)'
	)

		.drag-handle ⠿
		q-btn.tool(flat round icon="mdi-cog" color="secondary" size='sm' @click="open(item)") 
		.name 
			span {{ item.text}}
				q-popup-edit(v-model="item.text" auto-save v-slot="scope")
					q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
		.type(v-if='item.kind') < {{ calcLabel(item.kind) }} >
		div(v-else)
		q-icon(v-if='item.hide' name="mdi-eye-off" color="secondary" size="18px")
		div(v-else)

		q-btn.close(flat round icon="mdi-close" color="secondary" size='sm' @click="clear(index)") 


.empty(
	:class="{ 'drop-hover': isHoverTarget }",
	@dragover.prevent="onDragOver"
	@dragleave="onDragLeave"
	@drop="insert"
)
	div Перетащите сюда поле чтобы задать колонку.
	q-btn.q-mt-md(outline  color="primary" icon='mdi-plus-circle-outline' label="Добавить колонку" @click="addColumn") 


Teleport(to='body')
	ViewDrawer(v-model:visible="drawer" v-model:column="currentColumn")
</template>

<style scoped lang="scss">
.name {
	color: $primary;
	margin-left: 1rem;
	span {
		border-bottom: 1px dotted $primary;
	}
}
.empty {
	margin-top: 1rem;
	padding: 1rem;
	text-align: center;
	background: var(--bgLight);
	border-radius: 0.5rem;
	border: 2px dashed var(--my-border-color);
}
.ghost {
	width: 100%;
	height: 48px;
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none !important;
	}
}
.drop-hover {
	transform: scale(0.99);
	background: #a8d2bf;
	outline: 2px solid teal;
}
.mycolumn {
	background: var(--bgLight);
	border-radius: 0.5rem;
	border: 1px solid var(--my-border-color);
	padding: 0.25rem 1rem;
	height: 48px;
	margin-top: -1px;
	display: grid;
	grid-template-columns: auto auto 1fr 1fr 1fr 32px;
	align-items: center;
	.close {
		visibility: hidden;
	}
	&:hover {
		.close {
			visibility: visible;
		}
	}
}
.drag-handle {
	font-size: 1.3rem;
	cursor: grab;
	user-select: none;
	margin-right: 1rem;

	&:active {
		cursor: grabbing;
	}
}
.type {
	font-size: 0.8rem;
	color: $blue-grey-6;
}
</style>
