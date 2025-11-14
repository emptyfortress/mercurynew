<script setup lang="ts">
import { ref } from 'vue'

const item = ref({
	id: 2,
})
</script>

<template lang="pug">
.myItem {{ item.id }}
</template>

<style scoped lang="scss">
.myItem {
	width: 100%;
	height: 200px;
	background: #fff;
	padding: 1rem;
}
</style>
