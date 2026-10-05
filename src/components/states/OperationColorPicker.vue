<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{
	(event: 'update:modelValue', color: string | undefined): void
}>()

const palette = [
	'#C62828',
	'#AD1457',
	'#6A1B9A',
	'#4527A0',
	'#283593',
	'#1565C0',
	'#0277BD',
	'#00838F',
	'#00796B',
	'#2E7D32',
	'#558B2F',
	'#827717',
	'#9E9D24',
	'#B26A00',
	'#FF8F00',
	'#EF6C00',
	'#D84315',
	'#6D4C41',
	'#4E342E',
	'#546E7A',
]
const color = ref<string | null>(props.modelValue ?? null)

watch(
	() => props.modelValue,
	(value) => {
		color.value = value ?? null
	}
)

const updateColor = (value: string | null) => {
	color.value = value
	emit('update:modelValue', value ?? undefined)
}
</script>

<template lang="pug">
q-btn.color-picker-trigger(flat round dense size="sm" :style="{ '--operation-color': modelValue || 'transparent' }" @click.stop="$event.stopPropagation()")
	q-icon(:name="modelValue ? 'mdi-circle' : 'mdi-palette-outline'" :color="modelValue ? undefined : 'grey-7'")
	q-tooltip {{ modelValue ? 'Изменить цвет операции' : 'Назначить цвет операции' }}
	q-menu(anchor="bottom middle" self="top middle")
		.text-subtitle2.q-px-md.q-py-sm.text-center Цвет операции
		q-color(:model-value="color" :palette="palette" default-view="palette" format-model="hex" @update:model-value="updateColor")
		.text-center
			q-btn(flat dense color="primary" label="Без цвета" :disable="!modelValue" @click="updateColor(null)")
</template>

<style scoped lang="scss">
.color-picker-trigger {
	color: var(--operation-color);
}
// .color-picker-card {
// 	width: 260px;
// }
</style>
