<script setup lang="ts">
import { ref } from 'vue'
import IconUpArrowCircle from '@/components/icons/IconUpArrowCircle.vue'
import IconSave from '@/components/icons/IconSave.vue'

// const modelValue = defineModel<MenuItem[]>()
const selectedItems = defineModel<MenuItem[]>('selectedItems')

const query = ref('')
const calcClass = (key: any) => {
	if (key.isSpecial) return 'special'
	return ''
}

const emit = defineEmits(['remove', 'reset'])
const removeItem = (index: number) => {
	emit('remove', index)
}
const reset = () => {
	emit('reset')
}

const addCond = () => {
	console.log(111)
}

const save = () => {
	console.log(111)
}
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
		q-btn(flat round icon="mdi-close-circle" color="negative" @click="reset" dense) 
			q-tooltip Очистить
		q-btn(flat round color="primary" @click="addCond" dense ) 
			IconUpArrowCircle.ic
			q-tooltip Добавить условие и продолжить
		q-btn(flat round color="primary" @click="save" dense ) 
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
