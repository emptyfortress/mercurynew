<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const app = useStorage('app', localStorage)
</script>

<template lang="pug">
q-page(padding)
	h6 {{ app.label }}
</template>

<style scoped lang="scss"></style>
