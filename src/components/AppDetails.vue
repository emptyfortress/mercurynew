<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const item = computed(() => route.params.id)
</script>

<template lang="pug">
.myItem {{ item }}
</template>

<style scoped lang="scss">
.myItem {
	width: 100%;
	height: 200px;
	background: #fff;
	padding: 1rem;
}
</style>
