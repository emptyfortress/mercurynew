<script setup lang="ts">
import { ref, watch } from 'vue'

const modelValue = defineModel<boolean>()
const emit = defineEmits<{ create: [name: string] }>()
const name = ref('')
const submitted = ref(false)

watch(modelValue, (open) => {
	if (open) {
		name.value = ''
		submitted.value = false
	}
})

function createProject() {
	if (submitted.value || !name.value.trim()) return
	submitted.value = true
	emit('create', name.value.trim())
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card.create-project
		q-btn.close(round color="negative" icon="mdi-close" title="Закрыть" v-close-popup)
		q-form(@submit.prevent="createProject")
			q-card-section
				.text-h6 Создать проект
				.text-grey-7 Назовите проект. Разметки можно добавить в редакторе.
			q-card-section
				q-input(
					v-model="name"
					autofocus
					outlined
					dense
					label="Название"
					:rules="[value => !!value?.trim() || 'Введите название проекта']"
				)
			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup)
				q-btn(
					unelevated color="primary" label="Создать" type="submit"
					:disable="!name.trim() || submitted"
				)
</template>

<style scoped lang="scss">
.create-project {
	width: 460px;
	max-width: calc(100vw - 48px);
}
</style>
