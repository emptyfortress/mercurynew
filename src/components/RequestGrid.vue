<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconClear from '@/components/icons/IconClear.vue'
import { animations, state } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useKeys } from '@/stores/keys'

const mykeys = useKeys()

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
const [parent, tapes] = useDragAndDrop(mykeys.keys, config)

const removeItem = (ind: number): void => {
	tapes.value.splice(ind, 1)
}

const clearAll = () => {
	mykeys.keys.length = 0
}

const isGridEmpty = computed(() => mykeys.keys.length === 0)
const test = (e: any) => {
	console.log(e)
}
</script>

<template lang="pug">
div
	.empty(v-if='isGridEmpty')
		IconFaceMask.big
		div Запрос не настроен.
		q-btn.q-mt-md(unelevated color="primary" label="Настроить" @click="mykeys.toggleDragWindow") 

	.grid(ref='parent')
		.condition(v-for="(group, index) in tapes" :key="group[0].id")
			q-icon(name='mdi-drag-vertical' size='20px' color="grey")
			div(v-for="item in group" :key="item.id")
				q-input(v-if='item.isPrompt' v-model="item.label" dense outlined)
				div(v-else) {{ item.label }}
			q-checkbox(dense v-model="group?.at(-1)?.isPar" color="secondary" size='xs' @update:model-value='test(group)')
				q-tooltip Параметр
			div
			q-btn.remove(flat dense round icon="mdi-close" @click="removeItem(index)" size='xs')

	.text-center.q-mt-md(v-if='!isGridEmpty')
		q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить условие" @click="mykeys.toggleDragWindow") 
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
	padding: 0.3rem 0.5rem 0.3rem 0;
	background: white;
	display: flex;
	justify-content: left;
	align-items: center;
	width: fit-content;
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
