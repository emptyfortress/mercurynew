<script setup lang="ts">
import { ref } from 'vue'
import { str, datee, stat, mystatus } from '@/stores/conditions'

// interface TmpCond {
// 	text: string,
// 	kind?: number
// }

// interface CondL {
// 	id: Number
// 	data: TmpCond[]
// 	and: Boolean
// }

const props = defineProps({
	arr: {
		type: Object,
		default: {
			id: 0,
			data: [{ text: 'One', kind: 0 }],
			kind: 0
		}
	},
	last: {
		type: Boolean
	}
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

const showInput = ((item: any, index: number) => {
	if (item.kind == 100) return true
	else return false
})

const calcClass = ((item: any) => {
	if (item.kind == 11) return 'man'
	if (item.exe == true) return 'exe'
	return ''
})


</script>

<template lang="pug">
.simple
	q-icon(name="mdi-drag-vertical" color="primary" size="sm")

	template(v-for="(item, index) in arr.data" :key="item.id")

		div(v-if='item.kind < 14 && item.kind !== 11') {{ item.text }}

		q-select.q-ml-sm(v-if='item.kind == 11' v-model="item.text" dense outlined :options="options(item.kind)" bg-color="white")

		q-select.q-ml-sm(v-if='item.kind > 14 && item.kind !== 100' v-model="item.text" dense outlined :options="options(item.kind)" bg-color="white")

		q-input.q-ml-sm(v-if='showInput(item, index)' :model-value="item.text" dense outlined bg-color="white" placeholder='Укажите значение')

	q-btn.close(flat round dense icon="mdi-close" @click="remove" size="sm" color="primary") 

</template>

<style scoped lang="scss">
.simple {
	padding: 0.2rem .5rem;
	padding-left: 0;
	display: flex;
	justify-content: start;
	align-items: center;
	border: 1px solid transparent;

	.close {
		visibility: hidden;
		margin-left: 2rem;
	}

	&:hover {
		background: var(--bgLight);
		border-color: $blue-3;

		.close {
			visibility: visible;
		}
	}
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
</style>
