<script setup lang="ts">
import { ref, reactive } from 'vue'

const emit = defineEmits(['add'])

const keywords = reactive([
	{ id: 0, isKey: true, isLast: true, label: 'сегодня' },
	{ id: 1, isKey: true, isLast: true, label: 'сейчас' },
	{ id: 2, isKey: true, isLast: true, label: 'текущая неделя' },
	{ id: 3, isKey: true, isLast: true, label: 'текущий месяц' },
	{ id: 4, isKey: true, isLast: true, label: 'текущий квартал' },
	{ id: 5, isKey: true, isLast: true, label: 'текущий год' },
])

const selected = ref<string>()

const selectItem = (str: string) => {
	selected.value = str
	emit('add', str)
}

const calcClass = (str: string) => {
	return selected.value == str ? 'selected' : ''
}
</script>

<template lang="pug">
div
	ul.menu-items
		li.menu-item(
			v-for="item in keywords"
			:key="item.id"
			@click="selectItem(item.label)"
			:class="calcClass(item.label)"
		)
			q-icon.q-mr-md(name="mdi-star" color="grey-7")
			span {{ item.label }}

</template>

<style scoped lang="scss"></style>
