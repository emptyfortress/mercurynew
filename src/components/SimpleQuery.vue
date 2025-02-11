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
	.con Заявка
	q-icon(name="mdi-chevron-right")
	template(v-for="item in arr.data")
		.con {{ item }}
		q-icon(name="mdi-chevron-right")
	q-btn(flat round dense icon="mdi-close" @click="remove" size="sm") 
</template>

<style scoped lang="scss">
.simple {
	padding: 0.5rem 1rem;
	background: #dedede;
	border: 1px solid #ccc;
	display: inline-flex;
	align-items: center;
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
	margin-left: 3rem;
}
</style>
