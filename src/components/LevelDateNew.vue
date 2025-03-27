<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from 'vue'

// const props = defineProps({
// 	txt: {
// 		type: String,
// 		required: true,
// 		default: ''
// 	}
// })

// const emit = defineEmits(['add'])

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
}

const calcClass = (str: string) => {
	return selected.value == str ? 'selected' : ''
}

// const add = (item: any) => {
// 	date.value = ''
// 	keywords.map((el) => el.selected = false)
// 	item.selected = !item.selected
// 	emit('add', item)
// }

// watchEffect(() => {
// 	if (props.txt) {
// 		date.value = ''
// 		keywords.map((el) => el.selected = false)
// 	}
// })

watch(date, (val) => {
	if (val) {
		selected.value = undefined
		// emit('add', { text: val, dvalue: true, kind: 7 })
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

// q-list
// 	q-item(v-for="item in keywords" clickable :key="item.label" @click="add(item)" :class="{ selkey: item.selected }")
// 		q-item-section(side)
// 			q-icon(name="mdi-star" size="16px")
// 		q-item-section
// 			q-item-label {{ item.label }}
</template>

<style scoped lang="scss"></style>
