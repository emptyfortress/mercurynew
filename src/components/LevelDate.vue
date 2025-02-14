<script setup lang="ts">
import { ref, reactive, watch, watchEffect, } from 'vue'

const props = defineProps({
	txt: {
		type: String,
		required: true,
		default: ''
	}
})

const emit = defineEmits(['add'])

const date = ref('')

const keywords = reactive([
	{ kind: 7, dvalue: true, text: 'сегодня', selected: false },
	{ kind: 7, dvalue: true, text: 'сейчас', selected: false },
	{ kind: 7, dvalue: true, text: 'текущая неделя', selected: false },
	{ kind: 7, dvalue: true, text: 'текущий месяц', selected: false },
	{ kind: 7, dvalue: true, text: 'текущий квартал', selected: false },
	{ kind: 7, dvalue: true, text: 'текущий год', selected: false },
])

const add = (item: any) => {
	date.value = ''
	keywords.map((el) => el.selected = false)
	item.selected = !item.selected
	emit('add', item)
}

watchEffect(() => {
	if (props.txt) {
		date.value = ''
		keywords.map((el) => el.selected = false)
	}
})

watch(date, (val) => {
	if (val) {
		keywords.map((el) => (el.selected = false))
		emit('add', { text: val, dvalue: true, kind: 7 })
	}
})
</script>

<template lang="pug">
q-date(v-model="date" minimal)

q-list
	q-item(v-for="item in keywords" clickable :key="item.text" @click="add(item)" :class="{ selkey: item.selected }")
		q-item-section(side)
			q-icon(name="mdi-star" size="16px")
		q-item-section
			q-item-label {{ item.text }}
</template>

<style scoped lang="scss">
.selkey {
	background: $purple-2;
}
</style>
