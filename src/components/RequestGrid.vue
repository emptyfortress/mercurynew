<script setup lang="ts">
import { computed, h } from 'vue'
import IconFolderSearch from '@/components/icons/IconFolderSearch.vue'
import IconClear from '@/components/icons/IconClear.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useKeys } from '@/stores/keys'
import { QInput, QChip } from 'quasar'

const mykeys = useKeys()

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('condition')
	},
}
const [parent, tapes] = useDragAndDrop(mykeys.keys, config)

const removeItem = (ind: number): void => {
	tapes.value.splice(ind, 1)
}

const clearAll = () => {
	mykeys.keys.length = 0
}

const isGridEmpty = computed(() => mykeys.keys.length === 0)

const formatGroup = (group: any) => {
	let result: any = []
	let multiFoundIndex = -1

	for (let i = 0; i < group.length; i++) {
		if (group[i].isMulti) {
			multiFoundIndex = i
			break
		}
	}

	group.forEach((item: any, index: number) => {
		result.push(formatItem(item))
		// if (multiFoundIndex !== -1 && index > multiFoundIndex && index < group.length - 2) {
		// 	result.push(' ИЛИ ')
		// }
		if (multiFoundIndex !== -1 && index > multiFoundIndex && index < group.length - 2) {
			result.push({ isOr: true }) // Заменяем строку на объект
		}
	})

	return result
}

const formatItem = (item: any) => {
	if (item.isPrompt) {
		return h(QInput, {
			modelValue: item.label,
			'onUpdate:modelValue': (value: any) => (item.label = value),
			dense: true,
			outlined: true,
			bgColor: 'white',
		})
	} else if (item.isKey || (item.isLast && !item.isInput)) {
		return h(QChip, { dense: true, color: 'blue-2' }, () => item.label)
		// } else if (item.isSpecial || item.isSpecial1) {
		// 	return h(QChip, { dense: true, color: 'purple-2' }, () => item.label)
	} else {
		return h('div', item.label)
	}
}

const emit = defineEmits(['button', 'open'])
const search = () => {
	emit('button')
}

const open = (e: boolean) => {
	if (e) emit('open')
}

const calcCheckbox = (group: any) => {
	if (group[3] && group[3].isVis) return true
	return false
}

const currentId = computed(() => {
	return mykeys.hoverItem
})
</script>

<template lang="pug">
.q-px-md
	.empty
		.big
			IconFolderSearch
			span Все заявки
			span(v-if='!isGridEmpty') ,

			span.if(v-if='!isGridEmpty') удовлетворяющие условиям:
		div(v-if='isGridEmpty')
			q-btn.q-mt-md(unelevated color="primary" icon='mdi-filter-plus' label="Настроить фильтр" @click="mykeys.toggleDragWindow")

	.grid(ref='parent')
		.condition(
			v-for="(group, index) in tapes",
			:key="group[0].id"
			:class='{active: currentId == group[0].id}'
		)
			q-icon(name='mdi-drag-vertical' size='20px' color="grey")
			div(v-for="(element, index) in formatGroup(group)" :key="index")
				template(v-if="typeof element === 'string'")
					span {{ element }}
				template(v-else-if="element?.isOr")
					div или
					// q-chip(dense color="purple-2") или
				template(v-else)
					component(:is="element")

			q-checkbox(v-if='calcCheckbox(group)' dense v-model="group[3].isPar" color="primary" size='xs' @update:modelValue="open")
				q-tooltip Параметр
			div
			q-btn.remove.space(flat dense round icon="mdi-pencil" size='xs')
				q-tooltip Редактирование пока недоступно
			q-btn.remove(flat dense round icon="mdi-close" size='xs')
				q-menu
					q-list
						q-item(clickable @click="removeItem(index)" ).pink
							q-item-section Удалить

		.buttons(v-if='!isGridEmpty')
			div
				q-btn(unelevated color="primary" icon='mdi-plus-circle-outline' label="Добавить условие" @click="mykeys.toggleDragWindow")
				q-btn(flat color="primary" @click="search") 
					IconSearch.ic.q-mr-sm
					.q-cursor Проверить запрос

			q-btn.q-ml-sm(flat color="negative" @click="clearAll")
				IconClear.ic.q-mr-sm
				.q-cursor Очистить все
</template>

<style scoped lang="scss">
.empty {
	margin: 1rem auto 0;
	color: $secondary;
	gap: 0.5rem;
}

.big {
	font-size: 1.5rem;
	svg {
		vertical-align: middle;
		margin-bottom: 4px;
		margin-right: 0.5rem;
	}
	span {
		font-size: 1.1rem;
	}
	span.if {
		margin-left: 0.5rem;
	}
}

.ic {
	font-size: 1.5rem;
}

.grid {
	margin-left: 1rem;
}

.condition {
	padding: 0.3rem 0.5rem 0.3rem 0;
	background: white;
	display: flex;
	justify-content: left;
	align-items: center;
	width: fit-content;
	gap: 0.5rem;
	&.active {
		background: hsl(241 94% 93% / 1);
	}

	.remove {
		cursor: pointer;
		font-size: 0.9rem;
		color: #666;
		visibility: hidden;
		&.space {
			margin-left: 2rem;
		}
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
.bold {
	font-weight: 600;
	font-size: 1rem;
	color: $primary;
	margin-left: 0.3rem;
	margin-right: 0.3rem;
}
.buttons {
	margin-top: 2rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
