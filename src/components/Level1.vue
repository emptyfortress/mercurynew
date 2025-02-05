<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Option } from '@/types/enum'

const options = defineModel<Option[] | undefined>('options')

const query = defineModel('query', { type: String, default: '' })

const selected = computed(() => {
	if (!!options.value && options.value.filter((item: Option) => item.selected).length > 0) {
		return true
	} else return false
})

const emit = defineEmits(['addKey'])

const add = (el: Option) => {
	emit('addKey', el)
	options.value?.map((item) => (item.selected = false))
	el.selected = true
}

const filtered = computed(() => {
	if (options.value !== undefined && query.value.length > 0 && selected.value == false) {
		return options.value.filter((item: Option) =>
			item.text.toLowerCase().includes(query.value.toLowerCase())
		)
	} else return options.value
})
</script>

<template lang="pug">
q-item(v-for="item in filtered" :key="item.id" clickable @click="add(item)" :class="{selected: item.selected}" )
	q-item-section(side v-if="item.kind == 11")
		q-icon(name="mdi-star" size="16px")
	q-item-section
		q-item-label {{item.text}}
</template>

<style scoped lang="scss">
.selected {
	background: $blue-2;
}
.key {
	background: $purple-2;
}
</style>
