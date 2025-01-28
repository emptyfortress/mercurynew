<script setup lang="ts">
import { ref } from 'vue'
import StepRole1 from '@/components/StepRole1.vue'
import StepAttribute from '@/components/StepAttribute.vue'
import StepStatus from '@/components/StepStatus.vue'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'

const router = useRouter()

const step = ref(1)

const app = useStorage('app', localStorage)

const button = ref()
const setBt = () => {
	button.value.select()
}
const temp = ref('')
const navigate = (() => {
	router.push('/process')
})
</script>

<template lang="pug">
	q-stepper(
		flat
		v-model="step"
		vertical
		color="primary"
		header-nav
		animated)

		q-step(
			:name="1"
			title="Работа начинается с того, что Инициатор заполняет форму."
			prefix="1"
			:done="step > 1")

			div Придумайте ей название.

			q-input(v-model="app.card" dense outlined bg-color="white")
			q-stepper-navigation
				q-btn(@click="step = 2" color="primary" label="Далее")

		q-step(
			:name="2"
			title="Кто участвует в процессе?"
			prefix="2"
			:done="step > 2")
			div В приложении в виде схемы будет определен процесс, согласно которому к работе будут подключаться следующие роли:
			StepRole1(@next='step = 3')

		q-step(
			:name="3"
			title="Определите поля"
			prefix="3"
			:done="step > 3")
			StepAttribute
			q-stepper-navigation
				q-btn(@click="step = 4" color="primary" label="Далее")

		q-step(
			:name="4"
			title="Если нужно, добавьте статусы"
			prefix="4"
			:done="step > 4")
			StepStatus(@next='step = 5')

		q-step(
			:name="5"
			title="Назовите кнопку старта"
			prefix="5"
			:done="step > 5")
			div Когда все поля будут заполнены, инициатор нажмет кнопку и система автоматически передаст управление следующему участнику процесса. Дайте ей название.
			q-input.q-my-md(ref='button' v-model="temp" dense outlined bg-color="white" @focus="setBt")
			q-stepper-navigation
				q-btn(@click="step = 6" color="primary" label="Далее")

		q-step(
			:name="6"
			title="Завершение"
			prefix="6"
			:done="step > 6")
			div Поздравляем, вы заполнили первичный шаблон приложения <span class='text-bold text-uppercase'>{{ app.card }}</span>!
			div Система автоматически сгенерит схему процесса и все необходимые атрибуты. Вы можете продолжить дальнейшую настройку вне ассистента.

			q-stepper-navigation
				q-btn(@click="navigate" color="primary" label="Продолжить")
</template>

<style scoped lang="scss">
.q-stepper {
	background: initial;
	font-size: 0.9rem;
	max-width: 1200px;
}

.q-input {
	width: 300px;
	margin-bottom: 3px;
}

.sma {
	font-size: 0.8rem;
	font-style: italic;
}
</style>
