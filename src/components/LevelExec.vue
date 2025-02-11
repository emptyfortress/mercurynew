<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import { uid } from 'quasar'
import { Kind } from '@/types/enum'

// const props = defineProps({
// 	kind: {
// 		type: Number,
// 		default: 0
// 	}
// })

// const options = defineModel<Option[] | undefined>('options')

const options = ref([
	{
		id: uid(),
		text: 'Статус',
		kind: Kind.Status,
		type: 1,
		level: 1,
		selected: false,
		children: [],
	},
])

// const emit = defineEmits(['addKey'])
const add = (el: Option) => {
	// emit('addKey', el)
	options.value?.map((item) => (item.selected = false))
	el.selected = true
}

const query = defineModel('query', { type: String, default: '' })

const filtered = computed(() => {
	if (options.value !== undefined && query.value.length > 0) {
		return options.value.filter((item: Option) =>
			item.text.toLowerCase().includes(query.value.toLowerCase())
		)
	} else return options.value
})
</script>

<template lang="pug">
q-item(v-for="item in filtered" :key="item.id" clickable @click="add(item)" :class="{ selected: item.selected }" )
	q-item-section(side v-if="item.kind == 11")
		q-icon(name="mdi-star" size="16px")
	q-item-section
		q-item-label {{ item.text }}
</template>

<style scoped lang="scss">
.selected {
	background: $blue-2;
}
</style>
