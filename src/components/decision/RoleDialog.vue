<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const modelValue = defineModel<boolean>()

const emit = defineEmits(['add'])

const form = ref({
	label: '',
	common: false,
})

const formRef = ref()
const input = ref()

watch(modelValue, async (val) => {
	if (val) {
		form.value = {
			label: '',
			common: false,
		}
		await nextTick()
		input.value?.select()
	}
})

const submitForm = () => {
	if (form.value.label.trim()) {
		emit('add', {
			label: form.value.label,
			common: form.value.common,
		})
		modelValue.value = false
	}
}

const otmena = () => {
	form.value.label = ''
	form.value.common = false
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Новая роль
			.caption Добавить новую роль

		q-card-section
			q-form(ref='form' @submit="submitForm")
				.section
					label Название:
					q-input(ref="input"
						v-model="form.label"
						autofocus
						dense
						clearable
						filled
						:rules="[val => !!val || 'Это обязательное поле']"
						hint='Название должно быть уникальным'
						)

				.section
					q-checkbox(
						v-model="form.common"
						label="Общая роль"
						)

				q-card-actions(align="right"
					v-motion
					:initial="{ opacity: 0 }"
					:enter='{ opacity: 1, transition: { delay: 200 } }'
					)
					q-btn(flat color="primary" label="Отмена" @click="otmena")
					q-btn(unelevated color="primary" label="Добавить" type='submit' v-close-popup)
</template>

<style scoped lang="scss">
label {
	font-weight: 600;
}
.section {
	margin-top: 1rem;
	margin-bottom: 1rem;
	margin-left: 0.5rem;
	margin-right: 0.5rem;
}
</style>
