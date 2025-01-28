<script setup lang="ts">
const props = defineProps({
	result: {
		type: Boolean,
		required: true,
		default: false
	}
})
</script>

<template lang="pug">
.q-ml-lg
	div
	q-card
		.grey(v-if='!props.result') Превью BPMN схемы процесса

</template>

<style scoped lang="scss">
.q-card {
	min-height: 300px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.grey {
	color: #bbb;
}
</style>
