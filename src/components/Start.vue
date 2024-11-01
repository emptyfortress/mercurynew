<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
</script>

<template lang="pug">
h2 Start
div {{ route.params.id }}
</template>

<style scoped lang="scss"></style>
