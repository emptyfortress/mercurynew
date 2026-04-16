<script setup lang="ts">
import { ref, markRaw } from 'vue'
import MdiApplicationBracesOutline from '@/components/icons/list/MdiApplicationBracesOutline.vue'
import IconList from '@/components/IconList.vue'
// import { useApps } from '@/stores/apps'

const modelValue = defineModel<boolean>()

const MdiApplicationBracesOutline1 = markRaw(MdiApplicationBracesOutline)

const handleCancel = () => {
	resetForm()
	modelValue.value = false
}

const form = ref()
const input = ref()
const model = ref(null)
const model1 = ref(null)
const emit = defineEmits(['create', 'goAi'])
const icon = ref(MdiApplicationBracesOutline1)

const resetForm = () => {
	model.value = null
	model1.value = null
}

const submitForm = () => {
	emit('create', {
		label: model.value,
		description: model1.value,
		pic: icon.value,
		group: 1,
	})
	resetForm()
	modelValue.value = false
}

const setIcon = (e: any) => {
	icon.value = e
}

const name = ref()
const goAi = () => {
	modelValue.value = false
	emit('goAi')
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Новое приложение
			div
				span Воспользуйтесь помощью ИИ-ассистента
				q-btn.q-ml-lg(unelevated color="primary" label="ИИ-ассистент" @click="goAi") 

		.q-ml-md или создайте приложение вручную:
		q-form(ref='form' @submit="submitForm")
			q-card-section
				label Название:
				q-input(ref="input"
					v-model="model"
					autofocus
					dense
					clearable
					outlined
					:rules="[val => !!val || 'Это обязательное поле']"
					hint='Название должно быть уникальным'
					)


			q-card-section
				label Описание:
				q-input(
					v-model="model1"
					dense
					clearable
					outlined
					hint='Описание не обязательно'
					)

			.q-mt-md.q-ml-sm.q-mb-md
				IconList(@select='setIcon')

			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" @click="handleCancel")
				q-btn(unelevated color="primary" label="Создать" type='submit') 
</template>

<style scoped lang="scss"></style>
