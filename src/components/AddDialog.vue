<script setup lang="ts">
const modelValue = defineModel<boolean>()

const create = ((data: any) => {
	console.log(data)
	modelValue.value = false
})
</script>

<template lang="pug">
q-dialog(v-model="modelValue" transition-show="slide-up" transition-hide="slide-down")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Новое приложение
		q-card-section
			FormKit(type="form" id="newapp" submit-label="Создать" @submit="create")
				FormKit(type="text" autofocus name="name" label="Название" value='Мое приложение' help="Назовите ваше приложение" validation="required|length:3")
				FormKit(type="textarea" name="descr" label="Описание" help="Что будет делать ваше приложение?")
</template>

<style scoped lang="scss"></style>
