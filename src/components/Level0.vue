<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Option } from '@/types/enum'
import { zero } from '@/stores/options'
import { getMembers } from '@/utils/utils'

const options = defineModel<Option[] | undefined>('options')
const query = defineModel('query', { type: String, default: '' })

const selected = computed(() => {
	if (!!options.value && options.value.filter((item: Option) => item.selected).length > 0) {
		return true
	} else return false
})

const emit = defineEmits(['addKey', 'addAllKey'])

const add = (el: Option) => {
	emit('addKey', el)
	options.value?.map((item: Option) => (item.selected = false))
	el.selected = true
}

const filtered = computed(() => {
	if (options.value !== undefined && query.value.length > 0 && selected.value == false) {
		return options.value.filter((item: Option) =>
			item.text.toLowerCase().includes(query.value.toLowerCase())
		)
	} else return options.value
})

const all = ref(zero)
const allfiltered = computed(() => {
	return getMembers(zero).filter((item) =>
		item.text.toLowerCase().includes(query.value.toLowerCase())
	)
})
const add1 = (el: Option) => {
	emit('addAllKey', el)
	all.value.map((item: Option) => (item.selected = false))
	el.selected = true
}
</script>

<template lang="pug">
q-item(v-if="filtered && filtered.length == 0" clickable v-for="item in allfiltered" @click="add1(item)")
	q-item-section
		q-item-label {{ item.text }}
		q-item-label(caption)
			template(v-for="par in item.parents")
				span.caption {{ par }}
				span.caption >
q-item(v-else v-for="item in filtered" :key="item.id" clickable @click="add(item)" :class="{ selected: item.selected }")
	q-item-section
		q-item-label {{ item.text }}
</template>

<style scoped lang="scss">
.selected {
	background: $blue-2;
}

.caption:last-child {
	display: none;
}

.caption {
	margin-right: 5px;
}
</style>
