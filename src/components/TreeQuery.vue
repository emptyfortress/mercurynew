<script setup lang="ts">
import { ref } from 'vue'
import { str, datee, stat, mystatus } from '@/stores/conditions'


const props = defineProps({
	arr: {
		type: Object,
		default: {
			id: 0,
			kind: 0,
			text: 'test'
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

const showInput = ((item: any) => {
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

	template(v-for="(item, index) in arr" :key="item.id")
		div(v-if='item.kind < 14 && item.kind !== 11') {{ item.text }}

		.q-ml-md(v-if='item.kind == 11') {{ item.text }}
		// q-select.q-ml-sm(v-if='item.kind == 11' v-model="item.text" dense outlined :options="options(item.kind)" bg-color="white")

		q-select.q-ml-sm(v-if='item.kind > 14 && item.kind !== 100' v-model="item.text" dense :options="options(item.kind)")

		q-input.q-ml-sm(v-if='showInput(item)' :model-value="item.text" dense outlined bg-color="white" placeholder='Укажите значение')

</template>

<style scoped lang="scss">
.oper {
	display: flex;
	align-items: center;
}
.trig {
	padding: .25rem .5rem;
	border-radius: .5rem;
	border: 1px solid #ccc;
	margin-right: 1rem;
} 
.node {
	// height: 36px;
	// min-width: 500px;
	border-radius: .25rem;
	position: relative;
	cursor: pointer;

	.close {
		display: none;
		position: absolute;
		right: .25rem;
		top: 50%;
		transform: translateY(-50%);
	}

	&:hover {
		background-color: #ededed;

		.close {
			display: block;
		}
	}
}

.simple {
	padding: 0.2rem 0.5rem;
	// padding-right: 4rem;
	// display: grid;
	// grid-template-columns: auto auto auto auto;
	display: flex;
	// width: 100%;
	// justify-content: start;
	align-items: center;
	// position: relative;
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
