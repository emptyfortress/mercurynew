<script setup lang="ts">
import { watch } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useDndStore } from '@/stores/dnd'
import DropTarget from '@/components/decision/DropTarget.vue'

const dndStore = useDndStore()

const buildConfig = (disabled: boolean) => ({
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => child.classList.contains('my-expansion'),
	disabled,
})
const [parent, tapes, updateConfig] = useDragAndDrop(dndStore.columnData, buildConfig(false))

watch(
	() => dndStore.externalDragPayload,
	(payload) => {
		updateConfig(buildConfig(payload != null))
	}
)

const insert = (item: any) => {
	if (item.newkind == dndStore.externalDragPayload.newkind) {
		item.children.push(dndStore.externalDragPayload)
	} else return
}

const clear = (el: any) => {
	el.column.children.splice(el.index, 1)
}
</script>

<template lang="pug">
q-btn.q-mb-md(unelevated color="primary" label="Добавить колонку" @click="dndStore.addColumn" size="sm") 

.empty(v-if='dndStore.columnData.length === 0')
	ol
		li Добавьте нужное количество колонок.
		li Задайте названия и тип колонок.
		li Настройте данные для показа в колонке, перетащив нужное поле из списка справа.

.par(ref='parent')
	DropTarget(:item="item",
		v-for="(item, index) in tapes",
		:key="item.id",
		@drop='insert(item)',
		@kill='dndStore.remove(index)'
		@remove='clear'
	)

</template>

<style scoped lang="scss">
.empty {
	margin-top: 1rem;
	padding: 1rem;
	border: 1px solid var(--my-border-color);
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
</style>
