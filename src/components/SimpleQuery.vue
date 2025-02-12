<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
	arr: {
		type: Object,
		default: {
			id: 0,
			data: ['test'],
		},
	},
})


const emit = defineEmits(['remove'])
const remove = () => {
	emit('remove', props.arr)
}
const input = ref('')
</script>

<template lang="pug">
.simple
	q-chip Заявка
	q-icon(name="mdi-chevron-right" size="sm" color="primary")
	template(v-for="(item, index) in arr.data" :key="item")
		q-chip(v-if='index !== arr.data.length - 1') {{ item }}
		q-input(v-if='index == arr.data.length - 1' :model-value="item" dense outlined bg-color="white" placeholder='Укажите значение')
		q-icon(name="mdi-chevron-right" size="sm" color="primary")
	q-btn(flat round dense icon="mdi-close" @click="remove" size="sm" color="primary") 
</template>

<style scoped lang="scss">
.simple {
	padding: 0.2rem 1rem;
	background: var(--bgLight);
	border: 1px solid $blue-3;
	display: inline-flex;
	justify-content: start;
	align-items: center;

	:nth-last-child(2) {
		display: none;
	}
}

:deep(.q-field--dense .q-field__control) {
	height: 28px;
}

.q-chip {
	font-size: 0.8rem;
	background: $blue-2;
	border: 1px solid $blue-5;
}

.q-btn {
	margin-left: 3rem;
}
</style>
