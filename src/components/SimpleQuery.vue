<script setup lang="ts">
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
</script>

<template lang="pug">
.simple
	template(v-for="item in arr.data")
		.con {{ item }}
		q-icon(name="mdi-chevron-right")
	q-btn(flat round dense icon="mdi-close" @click="remove") 
</template>

<style scoped lang="scss">
.simple {
	padding: 0.5rem 1rem;
	background: #dedede;
	border: 1px solid #ccc;
	display: flex;
	align-items: center;
	width: 100%;
	position: relative;
	// margin-bottom: 0.5rem;
	gap: 11px;
	:nth-last-child(2) {
		// color: red;
		display: none;
	}
}
.con {
	font-size: 0.9rem;
}
.q-btn {
	position: absolute;
	right: 0.5rem;
	top: 0.1rem;
}
</style>
