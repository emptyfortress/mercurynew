<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '@vueuse/core'
import AppGrid from '@/components/AppGrid.vue'

const router = useRouter()
const route = useRoute()

const app = useStorage('app', localStorage)
</script>

<template lang="pug">
.start
	AppGrid(v-if='app.id == 0')
	.fuck(v-else) fuck
</template>

<style scoped lang="scss">
.start {
	margin-left: 1rem;
}

.fuck {
	width: 100%;
	height: 100%;
	background: #fff;
	padding: 1rem;
}
</style>
