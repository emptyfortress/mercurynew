<script setup lang="ts">
// import { ref, onUpdated } from 'vue'
import { ref, watch, nextTick } from 'vue'

const modelValue = defineModel<boolean>()

const props = defineProps({
	current: {
		type: String,
		required: true,
		default: '',
	},
})

const emit = defineEmits(['create'])

const model = ref('')
const model1 = ref('')

const submitForm = () => {
	emit('create', {
		id: +Date.now(),
		ver: model.value,
		descr: model1.value,
		author: 'Орлов П.С.',
		created: '11.06.25',
		val: +Date.now(),
		server: '',
		published: 0,
	})
	input.value.resetValidation()
}

watch(modelValue, async (val) => {
	if (val) {
		model.value = props.current + ' - copy'
		await nextTick()
		input.value.select()
	}
})

const input = ref()
const otmena = () => {
	model.value = ''
	model1.value = ''
	input.value.resetValidation()
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" transition-show="slide-up" transition-hide="slide-down" backdrop-filter="blur(4px)")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Создать версию
			.caption Создать версию на основе выбранной

		q-card-section
			q-form(ref='form' @submit="submitForm")
				.section
					label Название:
					q-input(ref="input"
						v-model="model"
						autofocus
						dense
						clearable
						filled
						:rules="[val => !!val || 'Это обязательное поле']"
						hint='Название должно быть уникальным'
						)

				.section
					label Описание:
					q-input(
						v-model="model1"
						dense
						clearable
						filled
						hint='Описание не обязательно'
						)

				q-card-actions(align="right"
					v-motion
					:initial="{ opacity: 0 }"
					:enter='{ opacity: 1, transition: { delay: 200 } }'
					)
					q-btn(flat color="primary" label="Отмена" @click="otmena") 
					q-btn(unelevated color="primary" label="Создать" type='submit' v-close-popup) 

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
