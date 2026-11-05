<script setup lang="ts">
import { ref } from 'vue'
import ProcessValueInput from './TemplateProcessValueInput.vue'
import type { ProcessValue } from './processValue'

const isMilestone = ref(false)
const timingMode = ref('absolute')
const absoluteDate = ref<ProcessValue>(null)
const relativeInterval = ref<ProcessValue>(null)
const timeUnit = ref('hours')
const timeUnitOptions = [
	{ label: 'часов', value: 'hours' },
	{ label: 'минут', value: 'minutes' },
]
</script>

<template lang="pug">
.node-milestone-settings
	.text-caption.text-grey-9 Настройка вехи процесса, связанной с функцией.
	q-checkbox.text-black(
		v-model="isMilestone"
		label="Функция является вехой"
		dense
	)
	.milestone-timing
		.timing-mode
			q-radio(
				v-model="timingMode"
				val="absolute"
				label="По абсолютной дате"
				:disable="!isMilestone"
				dense
			)
			.timing-value
				ProcessValueInput(
					v-model="absoluteDate"
					type="Дата и время"
					label="Дата вехи"
					:disable="!isMilestone || timingMode !== 'absolute'"
				)
		.timing-mode
			q-radio(
				v-model="timingMode"
				val="relative"
				label="Относительно времени запуска процесса / последнего завершения функции"
				:disable="!isMilestone"
				dense
			)
			.timing-value
				ProcessValueInput(
					v-model="relativeInterval"
					type="Целое число"
					label="Интервал"
					:disable="!isMilestone || timingMode !== 'relative'"
				)
				q-option-group(
					v-model="timeUnit"
					:options="timeUnitOptions"
					type="radio"
					inline
					dense
					:disable="!isMilestone || timingMode !== 'relative'"
				)
</template>

<style scoped src="./TemplateMilestoneSettings.scss" lang="scss"></style>
