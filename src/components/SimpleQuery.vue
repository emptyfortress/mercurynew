<script setup lang="ts">
import { ref } from 'vue'
import { str, datee, stat, mystatus } from '@/stores/conditions'

interface TmpCond {
	text: string,
	kind?: number
}

interface CondL {
	id: Number
	data: TmpCond[]
	and: Boolean
}

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


const setAnd = ((e: any) => {
	e.and = true
})
const setOr = ((e: any) => {
	e.and = false
})
</script>

<template lang="pug">
.simple

	template(v-for="(item, index) in arr.data" :key="item.id")
		q-select(v-if='item.kind > 14 && item.kind !== 100' v-model="item.text" dense outlined :options="options(item.kind)" bg-color="white")

		q-chip(v-if='item.kind < 14 && item.kind !== 7' :class="calcClass(item)") {{ item.text }}

		q-chip.man(v-if='item.kind == 7') {{ item.text }}

		q-input.q-ml-sm(v-if='showInput(item, index)' :model-value="item.text" dense outlined bg-color="white" placeholder='Укажите значение')

	q-btn.close(flat round dense icon="mdi-close" @click="remove" size="sm" color="primary") 

.q-my-sm(v-if='!last')
	q-btn-group
		q-btn(unelevated :outline='!arr.and' label="И" size="sm" color="primary" @click="setAnd(arr)")
		q-btn(unelevated :outline='arr.and' label="Или" size='sm' color="primary" @click='setOr(arr)')
</template>

<style scoped lang="scss">
.simple {
	padding: 0.2rem .5rem;
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
		cursor: pointer;
	}

	&.exe {
		background: $orange-2;
		border: 1px solid $orange-4;
		cursor: pointer;
	}
}

.close {
	margin-left: 2rem;
}
</style>
