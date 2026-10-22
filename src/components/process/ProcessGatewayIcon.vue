<script setup lang="ts">
defineProps<{ gatewayId: string; icon: string }>()
</script>

<template lang="pug">
span.docsvision-icon(v-if="gatewayId === 'docsvision'") DV
q-icon(v-else :name="icon" color="primary" size="18px")
</template>

<style scoped lang="scss">
.docsvision-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	width: 18px;
	height: 18px;
	border: 1.6px solid currentColor;
	border-radius: 50%;
	color: var(--q-primary);
	font-size: 8px;
	font-weight: 700;
	padding-top: 2px;
	// line-height: 1.6;
}
</style>
