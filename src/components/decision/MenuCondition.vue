<script setup lang="ts">
const props = defineProps({
	menu: {
		type: String,
		required: true,
		default: '',
	},
})
</script>

<template lang="pug">
.text-h6
	|{{ props.menu}}
	span (условия выбора)
</template>

<style scoped lang="scss">
.text-h6 span {
	font-size: 1rem;
	margin-left: 1rem;
}
</style>
