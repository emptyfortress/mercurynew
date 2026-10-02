<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const isOpen = defineModel<boolean>({ default: false })
const props = withDefaults(
	defineProps<{
		sourceNodeId: string | null
		sources: Array<{ id: string; label: string; operationIds: string[] }>
		operations: Array<{ id: string; name: string }>
		targets: Array<{ id: string; label: string }>
	}>(),
	{
		sourceNodeId: null,
		sources: () => [],
		operations: () => [],
		targets: () => [],
	}
)
const emit = defineEmits<{
	(event: 'confirm', sourceNodeId: string, targetNodeId: string, operationId: string): void
}>()

const selectedSourceId = ref<string | null>(null)
const selectedTargetId = ref<string | null>(null)
const selectedOperationId = ref<string | null>(null)
const targetOptions = computed(() =>
	(props.targets ?? []).map((target) => ({ label: target.label, value: target.id }))
)
const currentSourceId = computed(() => props.sourceNodeId ?? selectedSourceId.value)
const operationOptions = computed(() => {
	const allowedIds = props.sources.find(
		(source) => source.id === currentSourceId.value
	)?.operationIds
	return (props.operations ?? [])
		.filter((operation) => !allowedIds || allowedIds.includes(operation.id))
		.map((operation) => ({ label: operation.name, value: operation.id }))
})

watch(isOpen, (open) => {
	if (open) {
		selectedSourceId.value = props.sourceNodeId
		selectedTargetId.value = null
		selectedOperationId.value = null
	}
})

const confirm = () => {
	if (!currentSourceId.value || !selectedTargetId.value || !selectedOperationId.value) return
	emit('confirm', currentSourceId.value, selectedTargetId.value, selectedOperationId.value)
	isOpen.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="isOpen" backdrop-filter="blur(4px) saturate(150%)")
	q-card.transition-dialog(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Настроить переход
			.caption Выберите операцию и целевое состояние.
		q-card-section.q-pt-none
			template(v-if="!sourceNodeId")
				.operation-field-label Исходное состояние
				q-select.q-mb-md(v-model="selectedSourceId" optionsDense :options="sources.map((source) => ({ label: source.label, value: source.id }))" outlined dense emit-value map-options autofocus @update:model-value="selectedOperationId = null")
			.operation-field-label Операция
			q-select.q-mb-md(v-model="selectedOperationId" optionsDense :options="operationOptions" outlined dense emit-value map-options :disable="!currentSourceId")
			.operation-field-label Целевое состояние
			q-select(v-model="selectedTargetId" optionsDense :options="targetOptions.filter((target) => target.value !== currentSourceId)" outlined dense emit-value map-options :disable="!currentSourceId")
		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(color="primary" unelevated label="Подтвердить" :disable="!currentSourceId || !selectedTargetId || !selectedOperationId" @click="confirm")
</template>

<style scoped lang="scss">
.transition-dialog {
	width: 480px;
	max-width: calc(100vw - 2rem);
}
.operation-field-label {
	margin-bottom: 0.25rem;
}
</style>
