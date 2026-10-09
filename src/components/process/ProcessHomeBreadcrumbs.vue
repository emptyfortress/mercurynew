<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
defineProps<{ items: { label: string; to: RouteLocationRaw }[] }>()
const emit = defineEmits<{ back: [] }>()
</script>

<template lang="pug">
.row.items-center.q-gutter-sm.q-mb-md
	q-btn(v-if="items.length > 1" flat dense color="primary" icon="arrow_back" label="Назад" @click="emit('back')")
	q-breadcrumbs(separator-color="primary")
		q-breadcrumbs-el(v-for="(item, index) in items" :key="index" :label="item.label" :to="index < items.length - 1 ? item.to : undefined")
</template>
