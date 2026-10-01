<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const isOpen = defineModel<boolean>({ default: false })
const props = withDefaults(defineProps<{
	operationName: string
	targets: Array<{ id: string; label: string }>
}>(), {
	operationName: '',
	targets: () => [],
})
const emit = defineEmits<{ (event: 'confirm', targetNodeId: string): void }>()

const selectedTargetId = ref<string | null>(null)
const targetOptions = computed(() => (props.targets ?? []).map((target) => ({ label: target.label, value: target.id })))

watch(isOpen, (open) => {
	if (open) selectedTargetId.value = null
})

const confirm = () => {
	if (!selectedTargetId.value) return
	emit('confirm', selectedTargetId.value)
	isOpen.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="isOpen" backdrop-filter="blur(4px) saturate(150%)")
	q-card.transition-dialog(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" aria-label="Закрыть" v-close-popup)
		q-card-section
			.text-h6 Настроить переход
			.caption Операция «{{ operationName }}» будет вести в выбранное состояние.
		q-card-section.q-pt-none
			.operation-field-label Целевое состояние
			q-select(v-model="selectedTargetId" :options="targetOptions" outlined dense emit-value map-options autofocus aria-label="Целевое состояние")
		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(color="primary" unelevated label="Подтвердить" :disable="!selectedTargetId" @click="confirm")
</template>

<style scoped lang="scss">
.transition-dialog { width: 480px; max-width: calc(100vw - 2rem); }
.operation-field-label { margin-bottom: 0.25rem; }
</style>
