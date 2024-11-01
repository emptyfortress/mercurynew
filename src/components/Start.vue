<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '@vueuse/core'

const router = useRouter()
const route = useRoute()

const app = useStorage('app', localStorage)
</script>

<template lang="pug">
div
	h2 Start
	div {{ route.params.id }}

	div {{ app.type }}
	pre(v-if="app.type == 0") {{ app.children }}
</template>

<style scoped lang="scss"></style>
