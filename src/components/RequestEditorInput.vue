<script setup lang="ts">
import { computed, ref } from 'vue'
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

const showPar = computed(() => {
	return selectedItems.value?.at(-1)?.isPar || selectedItems.value?.at(-1)?.date
})

const addCond = () => {
	if (transformedData.value) {
		const items: MenuItem[] = transformedData.value.map((el: MenuItem) => ({
			id: uid(),
			label: el.label,
			isSpecial: el.isSpecial,
			isLast: el.isLast,
			isInput: el.isInput,
			isMulti: el.isMulti,
			isKey: el.isKey,
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

		if (items.at(-1)?.label == 'задано' || items.at(-1)?.label == 'не задано') {
			items.push({ id: uid(), label: '', isPrompt: false })
		}
		if (
			items.length == 2 &&
			(items.at(-1)?.label !== 'задано' || items.at(-1)?.label !== 'не задано')
		) {
			items.push({ id: uid(), label: '', isPrompt: true })
		}
		items.push({
			id: uid(),
			label: '',
			isPar: par.value,
			isVis: showPar.value,
			// isActive: false,
		})
		mykeys.addItem(items)
		reset()
		if (mykeys.counter == 0) {
			mykeys.toggleDragWindow()
			mykeys.increment()
		}
	}
}

const isClearVisible = computed(() => {
	return selectedItems.value?.length || query.value?.length
})

const calcOr = (item: any, index: number) => {
	if (selectedItems.value && item.label == 'Я' && selectedItems.value.length > index + 1) {
		return true
	}
	if (
		selectedItems.value &&
		item.label == 'Мои подчиненные' &&
		selectedItems.value.length > index + 1
	) {
		return true
	}
	if (
		selectedItems.value &&
		item.label == 'Мой руководитель' &&
		selectedItems.value.length > index + 1
	) {
		return true
	}
	if (selectedItems.value && item.label == 'Подготовка' && selectedItems.value.length > index + 1) {
		return true
	}
	if (
		selectedItems.value &&
		item.label == 'На согласовании' &&
		selectedItems.value.length > index + 1
	) {
		return true
	}
	if (
		selectedItems.value &&
		item.label == 'На доработке' &&
		selectedItems.value.length > index + 1
	) {
		return true
	}
	if (
		selectedItems.value &&
		item.label == 'Согласовано' &&
		selectedItems.value.length > index + 1
	) {
		return true
	}
	return false
}

// const place = ref('Что ищем?')
const place = computed(() => {
	return isLast.value ? '' : 'Что ищем?'
})
</script>

<template lang="pug">
q-input(v-model="query" dense @clear="query = ''" :placeholder="place")
	template(v-slot:prepend)
		q-chip Заявка
		template(
			v-for="(item, index) in selectedItems",
			:key="item.id",
		)
			q-chip(
				removable,
				@remove="removeItem(index)",
				:class="calcClass(item)",
				v-motion,
				:initial='{ y: -20, opacity: 0 }' :enter='{ y: 0, opacity: 1 }'
			) {{ item.label }}
			q-chip(v-if='calcOr(item, index)' color="purple-2") или

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
			v-if='isLast',
			unelevated,
			color="primary",
			label="Добавить",
			@click="addCond",
			size="sm"
			dense,
			v-motion,
			:initial='{ y: -20, opacity: 0 }',
			:enter='{ y: 0, opacity: 1 }'
		) 

</template>

<style scoped lang="scss">
.q-chip {
	padding: 2px 8px;
	background: $blue-2;
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
