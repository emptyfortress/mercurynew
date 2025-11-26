<script setup lang="ts">
// import { useTourStore, type TourStep } from '@/stores/tour'
//
// const tour = useTourStore()
//
// onMounted(() => {
// 	const steps: TourStep[] = [
// 		{
// 			target: '[data-tour="settings-title"]',
// 			content: 'Тут вы управляете параметрами приложения',
// 		},
// 		{
// 			target: '[data-tour="settings-save"]',
// 			content: 'Нажмите, чтобы сохранить настройки 💾',
// 		},
// 	]
//
// 	tour.addSteps(steps)
// })
</script>

<template lang="pug">
section
	form(data-tour="settings-form")
		label Настройки
		input(type="text" placeholder="Введите значение")
	br
	br
	br
	button(data-tour="settings-save") Сохранить
</template>

<style scoped lang="scss">
.sidebar {
	position: fixed;
	right: 1rem;
	top: 4rem;
	height: 100%;
	width: 220px;
	// background: #2d2d44;
	padding-top: 2rem;
}
</style>
