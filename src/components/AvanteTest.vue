<script setup lang="ts">
import { ref } from 'vue'

const test = ref()
</script>

<template lang="pug">
h2 Hello {{ test }}
p This is a dummy paragraph. This is some more text for the first paragraph.
p This is another dummy paragraph.
</template>

<style scoped lang="scss">
h2 {
	color: #ff9999;
}
</style>
