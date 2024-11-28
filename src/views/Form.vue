<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
</script>

<template lang="pug">
q-page(padding)
	.editor(ref='editor')
		.text Form
		BackButton(@activate='' @stop='')

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
	position: relative;
}
.editor {
	width: 90%;
	height: calc(100vh - 120px);
	background: #fff;
	padding: 0.5rem;
	border-radius: 0.4rem;
	border: 1px solid #ccc;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
	box-shadow: var(--shad);
	position: relative;
}
</style>
