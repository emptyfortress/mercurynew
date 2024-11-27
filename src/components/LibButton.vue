<script setup lang="ts">
import { ref } from 'vue'

const prop = ref<HTMLElement>()
</script>

<template lang="pug">
.button(ref='button'
	v-motion
	:initial='{rotate: "0deg"}'
	:hovered='{rotate: "90deg"}'
	)
	q-icon(
		name="mdi-tune-vertical-variant"
		color="primary"
		size='24px')
	// template(v-if='selection')
	// 	.text Свойства
	// 	.text Этап {{ selection }}
</template>

<style scoped lang="scss">
.button {
	width: 48px;
	height: 48px;
	// height: calc(100vh - 120px);
	background: #fff;
	box-shadow: var(--shad0);
	border-radius: 50%;
	border: 1px solid #ddd;
	position: absolute;
	top: 0;
	left: -58px;
	text-align: center;
	padding: 0.6rem;
	cursor: pointer;
}
</style>
