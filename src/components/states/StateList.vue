<script setup lang="ts">
defineProps<{ states: Array<{ id: string; data?: { label?: string } }>; emptyMessage: string }>()
const emit = defineEmits<{
	(event: 'select', id: string): void
	(event: 'delete', id: string): void
}>()
</script>

<template lang="pug">
q-list.operation-list(separator bordered)
	q-item(v-for="state in states" :key="state.id" clickable dense @click="emit('select', state.id)")
		q-item-section {{ state.data?.label ?? state.id }}
		q-item-section(side)
			q-btn.delete-action(flat round dense size="sm" color="secondary" icon="mdi-close" @click.stop="emit('delete', state.id)")
	.text-body2.text-grey-7.q-pa-sm(v-if="!states.length") {{ emptyMessage }}
</template>

<style scoped lang="scss">
.operation-list {
	border-color: var(--my-border-color);
	border-radius: 0.35rem;
	background: var(--bgLight);
	font-size: 0.78rem;
}
</style>
