<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ConditionRow } from './nodesTypes'

const modelValue = defineModel<boolean>()

const props = defineProps<{
	row: ConditionRow | null
}>()

const emit = defineEmits(['confirm'])

const condition = ref('')
const value = ref('')

watch(modelValue, (open) => {
	if (open && props.row) {
		condition.value = props.row.condition
		value.value = props.row.value
	}
})

const confirm = () => {
	emit('confirm', { condition: condition.value, value: value.value })
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section.q-py-md
			.text-h6 Условие

		q-card-section
			.text-grey-6 Заглушка. Здесь будет настройка условия

		q-card-actions(align='right')
			q-btn(flat label="Отмена" v-close-popup color="primary")
			q-btn(unelevated label="Подтвердить" color="primary" v-close-popup @click="confirm")
</template>

<style scoped lang="scss">
:deep(.q-card__actions) {
	margin-right: 0.5rem;
	margin-bottom: 0.5rem;
}
</style>
