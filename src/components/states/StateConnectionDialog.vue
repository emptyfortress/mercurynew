<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false })
const operationId = defineModel<string | null>('operationId', { default: null })
defineProps<{
	sourceLabel?: string
	targetLabel?: string
	options: Array<{ label: string; value: string }>
}>()
const emit = defineEmits<{ (event: 'confirm'): void }>()
</script>

<template lang="pug">
q-dialog(v-model="isOpen" backdrop-filter="blur(4px) saturate(150%)")
	q-card.connection-dialog
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Выберите операцию
			.caption Связь {{ sourceLabel ?? 'исходного состояния' }} → {{ targetLabel ?? 'целевого состояния' }} будет создана после подтверждения.
		q-card-section.q-pt-none
			.operation-field-label Разрешенная операция
			q-select(v-model="operationId" :options="options" outlined dense emit-value map-options :disable="!options.length" :placeholder="options.length ? 'Выберите операцию' : 'Нет разрешенных операций'")
		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(color="primary" unelevated label="Создать связь" :disable="!operationId || !options.some((option) => option.value === operationId)" @click="emit('confirm')")
</template>

<style scoped lang="scss">
.connection-dialog {
	width: 480px;
	max-width: calc(100vw - 2rem);
}
.operation-field-label {
	margin-bottom: 0.25rem;
}
</style>
