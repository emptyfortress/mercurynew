<script setup lang="ts">
import { ref } from 'vue'
import ChatOutput from '@/components/ChatOutput1.vue'

const modelValue = defineModel<boolean>()
const query = ref('')
const result = ref(false)
const loading = ref(false)
const place = ref('Опишите ваше приложение как можно подробнее')

const ask = () => {
	loading.value = true
	setTimeout(() => {
		loading.value = false
		result.value = true
		query.value = ''
		place.value = 'Дополнительные уточнения и пожелания'
	}, 3000)
}
const create = () => {
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" persistent)
	q-card(style="width: 700px; max-width: 80vw")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6
				span ИИ-ассистент


		q-scroll-area.auto(v-if='result')
			ChatOutput

		q-card-section
			q-linear-progress(indeterminate color="primary" v-if='loading')
			.input
				q-input(v-model="query" type='textarea' outlined autogrow :placeholder='place')
					template(v-slot:append v-if='query.length')
						q-btn.send(flat color="primary" padding='xs' size='lg' icon="mdi-arrow-up-box" @click="ask")
			.text-right.q-mt-sm
				q-btn(v-if='result' flat color="primary" label="Отмена" @click="create") 
				q-btn(v-if='result' unelevated color="primary" label="Создать приложение" @click="create") 

</template>

<style scoped lang="scss">
.input {
	position: relative;
}
.send {
	position: absolute;
	bottom: 0;
	right: 0;
}

:deep(.q-field__control) {
	background: #fff;
}

:deep(.q-textarea .q-field__native) {
	padding-top: 0.5rem;
	padding-bottom: 1.5rem;
	font-size: 1rem;
	min-height: 100px;
}

.search {
	margin-top: 0.5rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.9rem;
}

.auto {
	height: calc(90vh - 200px);
	padding: 0 1rem;
	// min-height: 200px;
	// height: 800px;
	// overflow-y: auto;
}
</style>
