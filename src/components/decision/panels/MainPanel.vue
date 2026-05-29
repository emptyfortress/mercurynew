<script setup lang="ts">
function resetLayout() {
	localStorage.removeItem('dv-layout-mainmenu')
	window.location.reload()
}
</script>

<template lang="pug">
.panel-content
	p Здесь превью
	p Расположение панелей сохраняется в localStorage.
	p Открепить панель можно с шифтом.
	p Восстановить можно по кнопке, либо удалив ключ 'dv-layout-mainmenu' в devtools -> Application -> localStorage
	br
	br
	q-btn(unelevated color="primary" label="Restore default" @click="resetLayout()") 

	
</template>

<style scoped lang="scss">
.panel-content {
	padding: 1rem;
}
</style>
