<script setup lang="ts">
import { computed } from 'vue'
import type {
	ConditionNode,
	ConditionGroupNode,
	ConditionLeafNode,
} from '@/components/condition/conditionTypes'
import { ConditionResult } from '@/components/condition/conditionTypes'

interface List {
	id: string
	text: string
	text1: string
	selected: boolean
	hidden: boolean
	type: number
	author: string
}

const modelValue = defineModel<ConditionLeafNode>({ required: true })

const props = defineProps<{
	stageOptions: List[]
}>()

// Список всех возможных результатов для селекта
const resultOptions = computed(() =>
	Object.values(ConditionResult).map((value) => ({
		label: value,
		value: value,
	}))
)

// Выбранный этап (по id)
const selectedStage = computed({
	get: () => modelValue.value.stageId,
	set: (value) => {
		modelValue.value.stageId = value
	},
})

// Выбранный результат
const selectedResult = computed({
	get: () => modelValue.value.result,
	set: (value) => {
		modelValue.value.result = value
	},
})
</script>

<template lang="pug">
.condition-leaf
	q-select(
		v-model="selectedStage"
		:options="stageOptions"
		option-label="text"
		option-value="id"
		dense
		outlined
		emit-value
		map-options
		label="Этап"
		class="leaf-select"
	)
	
	q-select(
		v-model="selectedResult"
		:options="resultOptions"
		option-label="label"
		option-value="value"
		dense
		outlined
		emit-value
		map-options
		label="Семантика завершения"
		class="leaf-select"
	)
</template>

<style scoped lang="scss">
.condition-leaf {
	display: flex;
	gap: 8px;
	align-items: flex-start;
	width: 100%;
	min-width: 0;
}

.leaf-select {
	flex: 1;
	min-width: 120px;
}
</style>
