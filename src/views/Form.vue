<script setup lang="ts">
import PlusButton1 from '@/components/PlusButton1.vue'
import LibButton from '@/components/LibButton.vue'
import { editor, startLeft, startRight, stopRight, stopLeft } from '@/composable/panel3'
</script>

<template lang="pug">
q-page(padding)
	.editor(ref='editor')
		.text Form

		PlusButton1(@activate='startRight' @stop='stopRight')
		LibButton(@activate='startLeft' @stop='stopLeft')

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
	position: relative;
}
</style>
