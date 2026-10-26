<script setup lang="ts">
withDefaults(defineProps<{ framed?: boolean }>(), { framed: true })
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path v-if="framed" d="M12 1 23 12 12 23 1 12Z" stroke-width="1" />
    <path d="M7 12h10M12 7v10m-3.5-8.5 7 7m0-7-7 7" stroke-width="1.8" />
  </svg>
</template>
