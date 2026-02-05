<script setup lang="ts">
const props = defineProps({
	razmet: {
		type: String,
		required: true,
	},
})
</script>

<template lang="pug">
q-page(padding)
	.container
		.text-h6 Здесь будет конструктор {{ props.razmet }}
</template>

<style scoped lang="scss">
.container {
	max-width: 1200px;
	margin: 0 auto;
}
</style>
