<script setup lang="ts"></script>

<template lang="pug">
.panel-content
	p Здесь превью
	p Расположение панелей сохраняется в localStorage.
	p Открепить панель можно с шифтом.
	p Восстановить можно по кнопке вверху, либо удалив ключ 'dv-layout-mainmenu' в devtools -> Application -> localStorage
	
</template>

<style scoped lang="scss">
.panel-content {
	padding: 1rem;
}
</style>
