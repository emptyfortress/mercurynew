<script setup lang="ts">
import { ref, markRaw } from 'vue'
import ChatOutput from '@/components/ChatOutput1.vue'
import MdiApplicationBracesOutline from '@/components/icons/list/MdiApplicationBracesOutline.vue'

const MdiApplicationBracesOutline1 = markRaw(MdiApplicationBracesOutline)
const modelValue = defineModel<boolean>()
const query = ref('')
const result = ref(false)
const loading = ref(false)
const showLoader = ref(false)
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

const emit = defineEmits(['create'])
const create = () => {
	showLoader.value = true
	setTimeout(() => {
		modelValue.value = false
		showLoader.value = false
		emit('create', {
			label: 'Командировки',
			description: 'Простое приложение учета и согласования командировок сотрудников.',
			pic: MdiApplicationBracesOutline1,
			group: 1,
		})
		result.value = false
	}, 4000)
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" persistent)
	q-card(style="width: 700px; max-width: 80vw; position: relative")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6
				span ИИ-ассистент

		.spin-overlay(v-if="showLoader")
			q-spinner(size="100px" color="primary")
			.loading-text
				span Создаю приложение. Это может занять некоторое время.<br />
				span Не закрывайте окно до окончания.

		q-scroll-area.auto(v-if='result')
			ChatOutput

		.shad(v-if='result')
		q-card-section
			q-linear-progress(indeterminate color="primary" v-if='loading')
			.input
				q-input(v-model="query" type='textarea' outlined autogrow :placeholder='place' autofocus)
					template(v-slot:append v-if='query.length')
						q-btn.send(flat color="primary" padding='xs' size='lg' icon="mdi-arrow-up-box" @click="ask")
			.text-right.q-mt-sm
				q-btn(v-if='result' flat color="primary" label="Отмена" @click="create" :disable="showLoader") 
				q-btn(v-if='result' unelevated color="primary" label="Создать приложение" @click="create" :disable="showLoader") 

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

.auto {
	height: calc(90vh - 200px);
	padding: 0 1rem;
}
.spin-overlay {
	position: absolute;
	inset: 0; /* top/right/bottom/left: 0 */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 100;
	background: rgba(255, 255, 255, 0.6); /* опционально: затемнение */
}
.loading-text {
	margin-top: 1rem;
	font-size: 1rem;
	text-align: center;
	span {
		color: #eee;
		background: #333;
		padding: 0.5rem;
		border-radius: 4px;
	}
}
.shad {
	background: #fff;
	padding: 3px;
	box-shadow: 0 -6px 4px rgba(0, 0, 0, 0.2) !important;
}
</style>
