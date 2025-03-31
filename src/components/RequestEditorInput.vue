<script setup lang="ts">
import { computed } from 'vue'
import IconUpArrowCircle from '@/components/icons/IconUpArrowCircle.vue'
import IconSave from '@/components/icons/IconSave.vue'
import { useKeys } from '@/stores/keys'
import { uid } from 'quasar'

const mykeys = useKeys()

const selectedItems = defineModel<MenuItem[]>('selectedItems')
const queryModel = defineModel<string>('query')
const isLast = defineModel<boolean>('isLast')
const par = defineModel<boolean>('par')

const query = computed({
	get: () => queryModel.value ?? '',
	set: (val) => (queryModel.value = val),
})

const calcClass = (key: any) => {
	if (key.isSpecial) return 'special'
	return ''
}

const emit = defineEmits(['remove', 'reset'])
const removeItem = (index: number) => {
	emit('remove', index)
}
const reset = () => {
	query.value = ''
	par.value = false
	emit('reset')
}

const transformedData = computed(() => {
	if (selectedItems.value?.length === 0) return []

	if (selectedItems.value) {
		let concatenatedLabel = selectedItems.value[0].label
		let stopIndex = 1

		// Iterate over the array starting from the second element
		for (let i = 1; i < selectedItems.value.length; i++) {
			if (selectedItems.value[i].isSpecial === true) {
				break
			}
			concatenatedLabel += '.' + selectedItems.value[i].label
			stopIndex = i + 1
		}

		// Create the new first element
		const newFirstElement = {
			id: selectedItems.value[0].id,
			label: concatenatedLabel,
			isSpecial: false,
			isLast: false,
		}

		// Return new array with transformed first element
		return [newFirstElement, ...selectedItems.value.slice(stopIndex)]
	}
})

const addCond = () => {
	if (transformedData.value) {
		const items: MenuItem[] = transformedData.value.map((el: MenuItem) => ({
			id: uid(),
			label: el.label,
			isSpecial: el.isSpecial,
			isLast: el.isLast,
			isInput: el.isInput,
		}))

		if (items.at(-1)?.isInput) {
			items.push({
				id: uid(),
				label: query.value,
				isSpecial: false,
				isLast: true,
				isPrompt: true,
			})
		}
		items.push({
			id: uid(),
			label: '',
			isPar: par.value,
		})
		mykeys.addItem(items)
		reset()
	}
}

const save = () => {
	addCond()
	mykeys.toggleDragWindow()
}
const isClearVisible = computed(() => {
	return selectedItems.value?.length || query.value?.length
})
</script>

<template lang="pug">
q-input(v-model="query" dense @clear="query = ''" placeholder="Что ищем?")
	template(v-slot:prepend)
		q-chip Заявка
		q-chip(
			v-for="(item, index) in selectedItems",
			:key="item.id" removable,
			@remove="removeItem(index)",
			:class="calcClass(item)",
			v-motion,
			:initial='{ y: -20, opacity: 0 }'
			:enter='{ y: 0, opacity: 1 }'
		) {{ item.label }}


	template(v-slot:append)
		q-btn(
			v-if='isClearVisible',
			flat,
			round,
			icon="mdi-close-circle",
			color="negative",
			@click="reset" dense
			v-motion,
			:initial='{ y: -20, opacity: 0 }'
			:enter='{ y: 0, opacity: 1 }'
		) 
			q-tooltip Очистить
		q-btn(
			v-if='isLast' flat round,
			color="primary",
			@click="addCond" dense v-motion,
			:initial='{ y: -20, opacity: 0 }' :enter='{ y: 0, opacity: 1 }'
		) 
			IconUpArrowCircle.ic
			q-tooltip Добавить условие и продолжить
		q-btn(
			v-if='isLast' flat round,
			color="primary",
			@click="save" dense v-motion,
			:initial='{ y: -20, opacity: 0 }' :enter='{ y: 0, opacity: 1 }'
		) 
			IconSave.ic
			q-tooltip Сохранить
</template>

<style scoped lang="scss">
.q-chip {
	padding: 2px 8px;
	background: $blue-2;
	min-width: 50px;
}
.special {
	background: $purple-2;
}
.ic {
	font-size: 1.5rem;
}
.q-input {
	font-size: 1.2rem;
}
:deep(input::placeholder) {
	opacity: 0.3;
}
</style>
