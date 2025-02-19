<script setup lang="ts">
import { ref, computed, watch, watchEffect, } from 'vue'
import { deadline } from '@/stores/conditions'

// const props = defineProps({
// 	txt: {
// 		type: String,
// 		required: true,
// 		default: ''
// 	}
// })

const emit = defineEmits(['add'])
const dead = ref(deadline)


const sel = computed(() => {
	return dead.value.filter((el) => el.selected)
})

watchEffect(() => {
	if (sel.value) {
		emit('add', sel.value)
	}
})

// watch(date, (val) => {
// 	if (val) {
// 		keywords.map((el) => (el.selected = false))
// 		emit('add', { text: val, dvalue: true, kind: 7 })
// 	}
// })

</script>

<template lang="pug">
template( v-for="item in dead" clickable :key="item.text" )
	q-item(tag='label' :class="{ selkey: item.selected }")
		q-item-section(side)
			q-checkbox(dense v-model="item.selected" color="red")
		q-item-section
			q-item-label {{ item.text }}
</template>

<style scoped lang="scss">
.selkey {
	background: $orange-3;
}

.q-item {
	margin-bottom: 1px;
}
</style>
