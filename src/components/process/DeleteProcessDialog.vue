<script setup lang="ts">
const visible = defineModel<boolean>({ required: true })
defineProps<{ canDelete: boolean }>()
const emit = defineEmits<{ confirm: [] }>()
</script>

<template lang="pug">
q-dialog(v-model="visible" backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 400px; max-width: calc(100vw - 32px)")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Удалить шаблон?
			.text-body2 Экземпляры процесса сохранят свои данные и версию шаблона.
		q-card-actions(align="right")
			q-btn(flat label="Отмена" color="primary" v-close-popup)
			q-btn(unelevated label="Удалить" color="negative" :disable="!canDelete" @click="emit('confirm')")
</template>
