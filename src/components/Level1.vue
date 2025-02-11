<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import type { Option } from '@/types/enum'
import { Kind } from '@/types/enum'

const props = defineProps({
  kind: {
    type: Number,
    default: 0
  }
})

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

onBeforeUnmount(() => {
	options.value?.map((el) => el.selected = false)

})
const man = ref()
const fio = ['Иванов', 'Петров', 'Сидоров', 'Орлов', 'Воробьев', 'Лебедева']

watch(man, (val) => {
	if (val) {
		emit('addKey', { text: val, kind: Kind.Man, selected: false })
	}
})
</script>

<template lang="pug">
q-select(v-if='props.kind == 5' v-model="man" outlined bg-color="white" dense :options="fio")
	template(v-slot:prepend)
		q-icon(name="mdi-book-open-page-variant-outline")

q-item(v-for="item in filtered" :key="item.id" clickable @click="add(item)" :class="{ selected: item.selected }" )
	q-item-section(side v-if="item.kind == 11")
		q-icon(name="mdi-star" size="16px")
	q-item-section
		q-item-label {{ item.text }}
</template>

<style scoped lang="scss">
.q-select {
	min-width: 200px;
}
.selected {
	background: $blue-2;
}

.key {
	background: $purple-2;
}
</style>
