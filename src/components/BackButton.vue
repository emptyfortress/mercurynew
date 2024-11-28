<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
// import { gsap } from 'gsap'
// import { Flip } from 'gsap/Flip'

// gsap.registerPlugin(Flip)

// const button = ref<HTMLElement>()
const emit = defineEmits(['activate', 'stop'])
</script>

<template lang="pug">
.button(@click='$router.back()')
	q-icon(
		name="mdi-arrow-left"
		color="primary"
		size='28px')

</template>

<style scoped lang="scss">
.button {
	width: 48px;
	height: 48px;
	background: #fff;
	box-shadow: var(--shad0);
	border-radius: 24px;
	position: absolute;
	top: 0;
	left: -58px;
	text-align: center;
	padding: 0.6rem;
	cursor: pointer;
}
</style>
