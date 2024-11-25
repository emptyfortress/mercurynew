<script setup lang="ts">
import { useApps } from '@/stores/apps'
import { uid } from 'quasar'

const modelValue = defineModel<boolean>()
const myapps = useApps()

const create = (data: any) => {
	myapps.toggleNew()
	let tmp = {
		id: uid(),
		label: data.label,
		descr: data.descr,
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.09.2022',
		type: 0,
		group: false,
	}
	myapps.createApp(tmp)
	modelValue.value = false
	myapps.toggleNew()
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" transition-show="slide-up" transition-hide="slide-down")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Новое приложение
		q-card-section
			FormKit(type="form" id="newapp" submit-label="Создать" @submit="create")
				FormKit(type="text" autofocus name="label" label="Название" value='Мое приложение' help="Назовите ваше приложение" validation="required|length:3")
				FormKit(type="textarea" name="descr" label="Описание" value='Описание приложения' help="Что будет делать ваше приложение?")
</template>

<style scoped lang="scss"></style>
