<script setup lang="ts">
import { ref } from 'vue'
import { str, datee, stat, mystatus } from '@/stores/conditions'

const props = defineProps({
	arr: {
		type: Object,
		default: {
			id: 0,
			data: [{ text: 'One' }],
			kind: 0
		}
	},
})


const emit = defineEmits(['remove'])
const remove = () => {
	emit('remove', props.arr)
}

const options = ((num: number) => {
	switch (num) {
		case 15:
			return str
		case 16:
			return mystatus
		case 17:
			return stat
		default:
			return stat
	}
})

</script>

<template lang="pug">
.simple
	q-chip Заявка
	q-icon(name="mdi-chevron-right" size="sm" color="primary")

	template(v-for="(item, index) in arr.data" :key="item.id")
		q-select(v-if='item.kind > 14 && item.kind !== 100' v-model="item.text" dense outlined :options="options(item.kind)" bg-color="white")

		q-chip(v-if='item.kind < 14' :class="{ man: item.kind == 11 }") {{ item.text }}
		// q-chip(v-if='item.kind !== 15 && item.kind !== 100' :class="{ man: item.kind == 11 }") {{ item.text }}


		q-input(v-if='item.kind !== 11 && index == arr.data.length - 1' :model-value="item.text" dense outlined bg-color="white" placeholder='Укажите значение')
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

	.q-icon:nth-last-child(2) {
		display: none;
	}
}

.q-icon:last-child {
	display: none;
}

:deep(.q-field--dense .q-field__control) {
	height: 28px;
	// width: 150px;
}

:deep(.q-field--dense .q-field__marginal) {
	height: 28px;
}

:deep(.q-field--auto-height.q-field--dense .q-field__native) {
	min-height: 28px;
	line-height: 15px;
}

:deep(.q-field--auto-height.q-field--dense .q-field__control) {
	min-height: 28px;
	height: 28px;

}

.q-chip {
	font-size: 0.8rem;
	background: $blue-2;
	border: 1px solid $blue-3;

	&.man {
		background: $purple-2;
		border: 1px solid $purple-3;

	}
}

.q-btn {
	margin-left: 3rem;
}
</style>
