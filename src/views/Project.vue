<script setup lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable'
</script>

<template lang="pug">
q-page(padding)
	.editor
		q-btn(unelevated color="primary" label="Отмена" @click="") 

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
	// overflow: hidden;
	transform-origin: bottom right;
	position: relative;
}
</style>
