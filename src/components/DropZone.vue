<script setup lang="ts">
// import { ref } from 'vue'
import IconDragHere from '@/components/icons/IconDragHere.vue'

// const active = ref()

</script>

<template lang="pug">
// .drop(:class='{ active: active }' @dragover.prevent @dragenter="active = true" @dragleave="active = false")
.drop
	IconDragHere.big
	.text-h6 Форма не настроена
	.text-caption Перетащите сюда элемент из библиотеки слева.

</template>

<style scoped lang="scss">
.drop {
	width: 100%;
	height: 420px;
	padding: 2rem;
	text-align: center;
	color: $secondary;

	.big {
		font-size: 2rem;
	}

	// &.active {
	// 	background: #e8f3e1;
	// }

}
</style>
