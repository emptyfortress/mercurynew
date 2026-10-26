<script setup lang="ts">
withDefaults(defineProps<{ framed?: boolean }>(), { framed: true })
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path v-if="framed" d="M12 1 23 12 12 23 1 12Z" stroke-width="1" />
    <circle cx="12" cy="12" r="4.5" stroke-width="1.4" />
  </svg>
</template>
