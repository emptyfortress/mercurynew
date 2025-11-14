<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const item = ref(route.params.id)
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
