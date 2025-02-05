<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['add'])

const date = ref()

const keys = reactive([
	{ dvalue: true, text: 'сегодня', selected: false },
	{ dvalue: true, text: 'сейчас', selected: false },
	{ dvalue: true, text: 'текущая неделя', selected: false },
	{ dvalue: true, text: 'текущий месяц', selected: false },
	{ dvalue: true, text: 'текущий квартал', selected: false },
	{ dvalue: true, text: 'текущий год', selected: false },
])

const add = (item: any) => {
	date.value = null
	keys.map((el) => (el.selected = false))
	item.selected = true
	emit('add', item)
}
watch(date, (val) => {
	if (val) {
		keys.map((el) => (el.selected = false))
		emit('add', { text: val, dvalue: true })
	}
})
</script>

<template lang="pug">
q-date(v-model="date" minimal)
q-list
	q-item(v-for="item in keys" clickable :key="item.text" @click="add(item)" :class="{key: item.selected}")
		q-item-section(side)
			q-icon(name="mdi-star" size="16px")
		q-item-section
			q-item-label {{item.text}}
</template>

<style scoped lang="scss">
.key {
	background: $purple-2;
}
</style>
