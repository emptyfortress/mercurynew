<script setup lang="ts">
</script>

<template lang="pug">
q-page(padding)
	.container
		h6 Баги
		br

		q-markup-table(wrap-cells)
			thead
				q-tr
					th #
					th страница
					th описание
					th серьезность

			tbody
				tr
					td 1
					td Главная, роли, формы
					td При большом числе карточек и их переносе на вторую строку, невозможно сортировать перетаскиванием.
					td 1
				tr
					td 2
					td Главная, роли, формы
					td При большом числе карточек flip-анимация неправильно отрабатывает сворачивание распахнутой карточки (в правой части экрана). Баг появляется, когда включаешь wrap in flex container.
					td 2

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
}

.container {
	max-width: 800px;
}
</style>
