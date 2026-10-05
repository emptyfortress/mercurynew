<script setup lang="ts">
import type { DefaultTransitionOption } from './types'

const isOpen = defineModel<boolean>({ default: false })
const selectedTransitionId = defineModel<string | null>('selected-transition-id', {
	default: null,
})
defineProps<{ options: DefaultTransitionOption[] }>()
const emit = defineEmits<{ (event: 'confirm'): void }>()
</script>

<template lang="pug">
q-dialog(v-model="isOpen" backdrop-filter="blur(4px) saturate(150%)")
	q-card.default-transition-dialog(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Совпадают операции
			.caption Выберите переход, который будет выполняться по умолчанию. Остальные станут дополнительными.
		q-card-section.q-pt-none
			q-option-group(v-model="selectedTransitionId" :options="options" color="primary")
		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(color="primary" unelevated label="Подтвердить" :disable="!selectedTransitionId" @click="emit('confirm')")
</template>

<style scoped lang="scss">
.default-transition-dialog {
	width: 460px;
	max-width: calc(100vw - 2rem);
}
</style>
