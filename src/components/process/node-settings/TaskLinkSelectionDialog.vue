<script setup lang="ts">
const modelValue = defineModel<boolean>()
defineProps<{ editing: boolean }>()
const emit = defineEmits<{ select: [] }>()

function selectLink() {
	emit('select')
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card.task-link-dialog
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 {{ editing ? 'Изменение ссылки' : 'Добавление ссылки' }}
		q-card-section Здесь выбирается ссылка
		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(unelevated color="primary" :label="editing ? 'Сохранить' : 'Добавить'" @click="selectLink")
</template>

<style scoped lang="scss">
.task-link-dialog {
	width: 400px;
	max-width: calc(100vw - 32px);
}
</style>
