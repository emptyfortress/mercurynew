<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconClear from '@/components/icons/IconClear.vue'
import { animations, state } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useTree } from '@/stores/tree12'

const mytree = useTree()

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('condition')
	},
	// onDragstart: (e: any) => {
	// 	draggedItem.value = e.draggedNode.data.index
	// },
}
const [parent, tapes] = useDragAndDrop(mytree.layout, config)

const removeItem = (ind: number): void => {
	tapes.value.splice(ind, 1)
}

const clearAll = () => {
	mytree.layout.length = 0
}

const addTemp = () => {
	let temp = { id: +new Date(), par: false }
	mytree.addItem(temp)
}

const isGridEmpty = computed(() => mytree.layout.length === 0)
</script>

<template lang="pug">
div
	.empty(v-if='isGridEmpty')
		IconFaceMask.big
		div Запрос не настроен.
		q-btn.q-mt-md.q-mr-sm(flat color="primary" label="Quick add" @click="addTemp") 
		q-btn.q-mt-md(unelevated color="primary" label="Настроить" @click="mytree.toggleDragWindow") 


	.grid(ref='parent')
		.condition(v-for="(item, index) in tapes" :key="item.id")
			input(v-model="item.par" type='checkbox')
			template(v-if='item.data')
				div {{ item.data[0].text }}
				div {{ item.data[1].text }}
				q-input(v-if='item.data[2].kind == 100' v-model="item.data[2].text" dense outlined)
				div(v-else) {{ item.data[2].text }}
			template(v-else)
				div fuck
				div fuck
				div fuck
			div
			q-btn.remove(flat dense round icon="mdi-close" @click="removeItem(index)" size='xs')

	.text-center.q-mt-md(v-if='!isGridEmpty')
		q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Quick add" @click="addTemp") 
		q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить условие" @click="mytree.toggleDragWindow") 
		q-btn.q-ml-sm(flat color="negative" @click="clearAll") 
			IconClear.ic.q-mr-sm
			.q-cursor Очистить все

</template>

<style scoped lang="scss">
.empty {
	text-align: center;
	margin: 1rem auto;
	color: $secondary;
	gap: 0.5rem;
}

.big {
	font-size: 3rem;
	color: $secondary;
}

.ic {
	font-size: 1.5rem;
}

.grid {
	padding: 1rem;
}

.condition {
	padding: 0.5rem 0.5rem 0.5rem 1rem;
	background: white;
	display: flex;
	justify-content: left;
	align-items: center;
	width: fit-content;
	width: f;
	gap: 0.5rem;

	.remove {
		cursor: pointer;
		font-size: 0.9rem;
		color: #666;
		visibility: hidden;
		margin-left: 2rem;
	}

	&:hover {
		background: #efefef;

		.remove {
			visibility: visible;
		}
	}
}

.ghost {
	background: hsl(213 38% 91% / 1) !important;
	box-shadow: none !important;
	border: none !important;
	min-height: 40px;

	* {
		visibility: hidden;
	}
}
:deep(.q-field--dense .q-field__control) {
	height: 28px;
}
</style>
