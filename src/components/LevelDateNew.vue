<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['add'])

const date = ref('')

const keywords = reactive([
	{ id: 0, label: 'сегодня' },
	{ id: 1, label: 'сейчас' },
	{ id: 2, label: 'текущая неделя' },
	{ id: 3, label: 'текущий месяц' },
	{ id: 4, label: 'текущий квартал' },
	{ id: 5, label: 'текущий год' },
])

const selected = ref<string>()

const selectItem = (str: string) => {
	selected.value = str
	date.value = ''
	emit('add', str)
}

const calcClass = (str: string) => {
	return selected.value == str ? 'selected' : ''
}

watch(date, (val) => {
	if (val) {
		selected.value = undefined
		emit('add', val)
	}
})
</script>

<template lang="pug">
div
	q-date.q-mb-md(v-model="date" minimal)

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
